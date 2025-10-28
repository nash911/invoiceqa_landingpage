import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseService() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key);
}

// Brevo webhook endpoint
// Configure Brevo to POST delivery events to /api/email-webhook
// We expect JSON payloads with fields like: event, email, messageId, reason, date, etc.
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Brevo can send batch or single events. Normalize to array.
  const events = Array.isArray(body) ? body : [body];

  const supabase = getSupabaseService();

  let updated = 0;
  for (const ev of events) {
    const email = ev?.email as string | undefined;
    const evt = (ev?.event as string | undefined)?.toLowerCase();

    if (!email || !evt) continue;

    // Determine validation status
    const isBounce = ["hard_bounce", "soft_bounce", "blocked", "invalid_email", "deferred", "error"].includes(evt);
    const isDelivered = ["delivered", "sent"].includes(evt);

    const email_validated = isDelivered ? true : isBounce ? false : undefined;

    if (typeof email_validated === "boolean") {
      const { error } = await supabase
        .from("leads")
        .update({ email_validated })
        .eq("email", email);
      if (!error) updated++;
      else console.error("[webhook] Supabase update error", error);
    }
  }

  return NextResponse.json({ ok: true, updated });
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}

export const runtime = "nodejs";

