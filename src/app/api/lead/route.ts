import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// Validation schema (mirror of functions/src/lead.ts)
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

// Simple in-memory rate limiter per IP
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

export async function POST(req: NextRequest) {
  // Enforce JSON content type
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Invalid Content-Type" }, { status: 400 });
  }

  // Rate limit by IP
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

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // In local development, instruct developer to set envs
    const msg =
      "Server configuration error: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local for local dev (server-only).";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

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
  };

  const { data: inserted, error } = await supabase.from("leads").insert([leadRow]).select();

  if (error) {
    // Gracefully handle duplicate email
    if ((error as { code?: string; message?: string }).code === "23505" || error.message?.includes("duplicate")) {
      return NextResponse.json({ ok: true, duplicate: true }, { status: 200 });
    }
    console.error("Supabase error:", error);
    return NextResponse.json({ ok: false, error: "Failed to save lead" }, { status: 500 });
  }

  console.log("Lead captured:", inserted);
  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET() {
  // Method not allowed to mirror the function
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
