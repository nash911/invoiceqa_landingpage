import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseService() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key);
}

// Required tags to process - skip webhooks that don't have both
const REQUIRED_TAGS = ["landing-page", "welcome-email"];

type BrevoEvent = {
  email?: string;
  event?: string;
  messageId?: string;
  reason?: string;
  date?: string;
  tags?: string[];
  // Allow unknown extra fields without using `any`
  [key: string]: unknown;
};

function toBrevoEvent(u: unknown): BrevoEvent {
  if (u && typeof u === "object") {
    const o = u as Record<string, unknown>;
    // Parse tags - can be string (pipe-separated) or array
    let tags: string[] | undefined;
    if (typeof o.tags === "string") {
      tags = o.tags.split("|").map((t) => t.trim()).filter(Boolean);
    } else if (Array.isArray(o.tags)) {
      tags = o.tags.filter((t): t is string => typeof t === "string");
    } else if (typeof o.tag === "string") {
      // Brevo sometimes sends "tag" instead of "tags"
      tags = o.tag.split("|").map((t) => t.trim()).filter(Boolean);
    }
    return {
      email: typeof o.email === "string" ? o.email : undefined,
      event: typeof o.event === "string" ? o.event : undefined,
      messageId: typeof o.messageId === "string" ? o.messageId : undefined,
      reason: typeof o.reason === "string" ? o.reason : undefined,
      date: typeof o.date === "string" ? o.date : undefined,
      tags,
    };
  }
  return {};
}

/**
 * Check if the event has all required tags (landing-page and welcome-email).
 */
function hasRequiredTags(ev: BrevoEvent): boolean {
  if (!ev.tags || ev.tags.length === 0) return false;
  return REQUIRED_TAGS.every((tag) => ev.tags!.includes(tag));
}

// Brevo webhook endpoint
// Configure Brevo to POST delivery events to /api/email-webhook
// We expect JSON payloads with fields like: event, email, messageId, reason, date, etc.
export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const arr = Array.isArray(raw) ? raw : [raw];
  const events: BrevoEvent[] = arr.map(toBrevoEvent);

  const supabase = getSupabaseService();

  let updated = 0;
  let skipped = 0;
  for (const ev of events) {
    // Skip events that don't have the required tags (landing-page and welcome-email)
    if (!hasRequiredTags(ev)) {
      skipped++;
      continue;
    }

    const email = ev.email?.trim().toLowerCase();
    const evt = ev.event?.toLowerCase();

    if (!email || !evt) continue;

    // Determine validation status
    const isBounce = [
      "bounces",
      "hard_bounce",
      "soft_bounce",
      "blocked",
      "invalid_email",
      "deferred",
      "error",
    ].includes(evt);
    const isDelivered = [
        "delivered",
        "sent",
        "requests",
        "queued",
        "processed"
    ].includes(evt);

    const email_validated: boolean | undefined = isDelivered ? true : isBounce ? false : undefined;

    if (typeof email_validated === "boolean") {
      const { error } = await supabase
        .from("leads")
        .update({ email_validated })
        .eq("email", email);
      if (!error) updated++;
      else console.error("[webhook] Supabase update error", error);
    }
  }

  return NextResponse.json({ ok: true, updated, skipped });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}

export const runtime = "nodejs";
