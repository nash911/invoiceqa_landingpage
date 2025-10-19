import { onRequest } from "firebase-functions/v2/https";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Response } from "express";

const defaultAllowedOrigins = ["https://www.invoiceqa.com", "https://invoiceqa.com"];

function parseAllowedOrigins(): { allowAll: boolean; origins: string[] } {
  const raw = process.env.ALLOW_ORIGINS;
  if (!raw) {
    return { allowAll: false, origins: defaultAllowedOrigins };
  }

  const entries = raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const allowAll = entries.includes("*");
  const origins = allowAll ? ["*"] : entries;

  return { allowAll, origins: origins.length > 0 ? origins : defaultAllowedOrigins };
}

function isOriginAllowed(origin: string | undefined, allowAll: boolean, origins: string[]): boolean {
  if (!origin) {
    return allowAll;
  }

  return allowAll || origins.includes(origin);
}

function applyCorsHeaders(res: Response, origin: string | undefined, allowAll: boolean) {
  const headerOrigin = allowAll ? "*" : origin ?? "";
  if (!headerOrigin) {
    return;
  }

  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  res.set("Access-Control-Allow-Origin", headerOrigin);
}

// Validation schema
const leadSchema = z.object({
  email: z.string().email(),
  company: z.string().optional(),
  invoices_per_month: z.string().optional(),
  utm: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_term: z.string().optional(),
      utm_content: z.string().optional(),
    })
    .optional(),
});

// Rate limiting (simple in-memory token bucket)
const rateLimitMap = new Map<string, { tokens: number; lastRefill: number }>();
const RATE_LIMIT_TOKENS = 5;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let bucket = rateLimitMap.get(ip);

  if (!bucket) {
    bucket = { tokens: RATE_LIMIT_TOKENS, lastRefill: now };
    rateLimitMap.set(ip, bucket);
  }

  // Refill tokens
  const timePassed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(timePassed / RATE_LIMIT_WINDOW) * RATE_LIMIT_TOKENS;
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(RATE_LIMIT_TOKENS, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  // Check if we have tokens
  if (bucket.tokens > 0) {
    bucket.tokens--;
    return true;
  }

  return false;
}

export const lead = onRequest(
  {
    region: "europe-west1",
    secrets: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
  },
  async (req, res) => {
    const { allowAll, origins } = parseAllowedOrigins();
    const requestOrigin = (req.headers.origin as string | undefined)?.trim();
    const originAllowed = isOriginAllowed(requestOrigin, allowAll, origins);

    if (req.method === "OPTIONS") {
      if (originAllowed) {
        applyCorsHeaders(res, requestOrigin, allowAll);
        res.status(204).send("");
      } else {
        res.status(403).send("");
      }
      return;
    }

    if (!originAllowed) {
      res.status(403).json({ ok: false, error: "Origin not allowed" });
      return;
    }

    const respond = (status: number, payload: unknown) => {
      applyCorsHeaders(res, requestOrigin, allowAll);
      res.status(status).json(payload);
    };

    // Only allow POST
    if (req.method !== "POST") {
      respond(405, { ok: false, error: "Method not allowed" });
      return;
    }

    // Get IP address
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "unknown";

    // Rate limiting
    if (!checkRateLimit(ip)) {
      respond(429, { ok: false, error: "Too many requests" });
      return;
    }

    try {
      // Validate request body
      const validationResult = leadSchema.safeParse(req.body);
      if (!validationResult.success) {
        respond(400, {
          ok: false,
          error: "Invalid request data",
          details: validationResult.error.errors,
        });
        return;
      }

      const data = validationResult.data;

      // Initialize Supabase client
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase credentials");
        respond(500, { ok: false, error: "Server configuration error" });
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Prepare lead data
      const leadData = {
        email: data.email,
        company: data.company || null,
        invoices_per_month: data.invoices_per_month || null,
        utm_source: data.utm?.utm_source || null,
        utm_medium: data.utm?.utm_medium || null,
        utm_campaign: data.utm?.utm_campaign || null,
        utm_term: data.utm?.utm_term || null,
        utm_content: data.utm?.utm_content || null,
        user_agent: req.headers["user-agent"] || null,
        ip: ip,
        referer: req.headers["referer"] || req.headers["referrer"] || null,
      };

      // Insert into Supabase
      const { data: insertedData, error } = await supabase
        .from("leads")
        .insert([leadData])
        .select();

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === "23505" || error.message.includes("duplicate")) {
          // Return success for duplicates (graceful handling)
          respond(200, { ok: true, duplicate: true });
          return;
        }

        console.error("Supabase error:", error);
        respond(500, { ok: false, error: "Failed to save lead" });
        return;
      }

      console.log("Lead captured:", insertedData);
      respond(200, { ok: true });
    } catch (error) {
      console.error("Unexpected error:", error);
      respond(500, { ok: false, error: "Internal server error" });
    }
  }
);
