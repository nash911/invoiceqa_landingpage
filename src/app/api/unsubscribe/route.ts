import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";

const unsubscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

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
    return NextResponse.json(
      { ok: false, error: "Content-Type must be application/json" },
      { status: 415 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = unsubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid email address" },
      { status: 400 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (err) {
    console.error("[unsubscribe] Supabase client error:", err);
    return NextResponse.json(
      { ok: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Update the contacts table - set unsubscribed = true
  const { data, error } = await supabase
    .from("contacts")
    .update({
      unsubscribed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("email", email)
    .select("id, email")
    .single();

  if (error) {
    // Check if it's a "not found" error (no rows matched)
    if (error.code === "PGRST116") {
      // Email not found in contacts - still return success to avoid email enumeration
      console.log("[unsubscribe] Email not found in contacts:", email);
      return NextResponse.json({ ok: true, message: "Unsubscribed successfully" });
    }

    console.error("[unsubscribe] Supabase update error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to process unsubscribe request" },
      { status: 500 }
    );
  }

  console.log("[unsubscribe] Successfully unsubscribed:", { email, id: data?.id });

  return NextResponse.json({ ok: true, message: "Unsubscribed successfully" });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}

