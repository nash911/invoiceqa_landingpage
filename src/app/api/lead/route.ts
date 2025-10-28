import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { sendWelcomeEmail } from "@/lib/email";

// Validation schema shared with the client
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

const RATE_LIMIT_TOKENS = 5;
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const rateLimitMap = new Map<string, { tokens: number; lastRefill: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let bucket = rateLimitMap.get(ip);
  if (!bucket) {
    bucket = { tokens: RATE_LIMIT_TOKENS, lastRefill: now };
    rateLimitMap.set(ip, bucket);
  }
  const timePassed = now - bucket.lastRefill;
  const tokensToAdd = Math.floor(timePassed / RATE_LIMIT_WINDOW) * RATE_LIMIT_TOKENS;
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(RATE_LIMIT_TOKENS, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }
  if (bucket.tokens > 0) {
    bucket.tokens--;
    return true;
  }
  return false;
}

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Invalid Content-Type" }, { status: 400 });
  }

  const xff = req.headers.get("x-forwarded-for") || "";
  const ip = (xff.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid request data", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const supabase = getSupabaseClient();

    const leadRow = {
      email: data.email,
      company: data.company ?? null,
      invoices_per_month: data.invoices_per_month ?? null,
      utm_source: data.utm?.utm_source ?? null,
      utm_medium: data.utm?.utm_medium ?? null,
      utm_campaign: data.utm?.utm_campaign ?? null,
      utm_term: data.utm?.utm_term ?? null,
      utm_content: data.utm?.utm_content ?? null,
      user_agent: req.headers.get("user-agent") ?? null,
      ip,
      referer: req.headers.get("referer") || req.headers.get("referrer") || null,
      early_access: process.env.EARLY_ACCESS === "true",
    };

    const { data: inserted, error } = await supabase.from("leads").insert([leadRow]).select();

    if (error) {
      if ((error as { code?: string; message?: string }).code === "23505" || error.message?.includes("duplicate")) {
        return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
      }
      console.error("[lead] Supabase insert error:", error);
      return NextResponse.json({ ok: false, error: "Failed to save lead" }, { status: 500 });
    }

    console.log("[lead] Lead captured:", inserted);
    console.log("[lead] Dispatching welcome email", {
      to: data.email,
    });

    const shouldSync = process.env.EMAIL_SYNC === "true" || process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    if (shouldSync) {
      let emailSent = false;
      try {
        await sendWelcomeEmail(data.email);
        emailSent = true;
        console.info("[lead] Welcome email sent (sync)", { to: data.email });
      } catch (e) {
        console.error("[lead] Welcome email failed (sync)", e);
      }
      return NextResponse.json({ ok: true, emailSent, early_access: leadRow.early_access }, { status: 200 });
    }

    // Best-effort, non-blocking (dev only)
    sendWelcomeEmail(data.email)
      .then(() => console.info("[lead] Welcome email dispatched (async)", { to: data.email }))
      .catch((e) => console.error("[lead] Welcome email error (async)", e));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Server configuration error. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in the environment.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}

export const runtime = "nodejs";
