#!/usr/bin/env node
/**
 * CLI script to test welcome email delivery via Brevo.
 * Sends emails and polls Brevo's API to verify delivery status.
 *
 * Run with:
 *   pnpm test:email [email]         # Send and check delivery status
 *   pnpm test:email --list          # Send to predefined test list
 *   pnpm test:email --no-check      # Send without checking delivery status
 */
import dotenv from "dotenv";

// Load env from .env first, then overlay with .env.local if present
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const PLACEHOLDER_LIST: string[] = [
  "nash911@gmail.com",
  "avinash@inshelf.com",
  "taranukaab@gmail.com",
  "avinash@amsinform.com",
];

// Delivery status types from Brevo
type DeliveryStatus = "delivered" | "soft_bounce" | "hard_bounce" | "blocked" | "error" | "deferred" | "pending" | "unknown";

interface BrevoEvent {
  email: string;
  event: string;
  date: string;
  messageId?: string;
  reason?: string;
}

interface SendResult {
  email: string;
  messageId: string | null;
  sendError?: string;
}

interface DeliveryResult {
  email: string;
  messageId: string | null;
  status: DeliveryStatus;
  reason?: string;
  sendError?: string;
}

function isEmailLike(s: string) {
  return /.+@.+\..+/.test(s);
}

/**
 * Clean an email string by removing brackets, quotes, and extra whitespace.
 */
function cleanEmail(s: string): string {
  return s.replace(/[\[\]"'<>]/g, "").trim();
}

function splitListToken(tok: string): string[] {
  return tok
    .split(",")
    .map((t) => cleanEmail(t))
    .filter(Boolean);
}

function hasFlag(name: string, argv: string[]): boolean {
  return argv.includes(`--${name}`);
}

function parseRecipients(argv: string[]): string[] {
  const DEFAULT_EMAIL = "nash911@gmail.com";
  if (!argv || argv.length === 0) return [DEFAULT_EMAIL];

  let usePlaceholder = false;
  const out: string[] = [];

  // First, join all args and check if it's a bracket-enclosed list
  // e.g., "[email1, email2, email3]" or "[email1," "email2," "email3]"
  const joined = argv.join(" ");
  const bracketMatch = joined.match(/\[([^\]]+)\]/);
  if (bracketMatch) {
    // Extract emails from bracket notation
    const emails = bracketMatch[1].split(",").map((e) => cleanEmail(e)).filter(isEmailLike);
    if (emails.length > 0) {
      // Check if there are flags after the bracket
      const hasNoCheck = hasFlag("no-check", argv) || hasFlag("skip-check", argv);
      const hasDebug = hasFlag("debug", argv);
      // Return the emails (flags are handled separately in main)
      return Array.from(new Set(emails));
    }
  }

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a || a === "--") continue;

    if (a === "--list" || a === "--multi" || a === "--many") {
      usePlaceholder = true;
      continue;
    }

    // Skip known flags
    if (a === "--no-check" || a === "--skip-check" || a === "--debug") continue;

    if (a.startsWith("--to=")) {
      const list = a.slice(5).trim();
      const parts = splitListToken(list);
      parts.forEach((p) => out.push(p));
      continue;
    }

    if (a === "--to") {
      // collect subsequent tokens until next flag
      let j = i + 1;
      while (j < argv.length && argv[j] && !argv[j].startsWith("--")) {
        const tok = argv[j];
        if (tok.includes(",")) splitListToken(tok).forEach((p) => out.push(p));
        else out.push(cleanEmail(tok));
        j++;
      }
      i = j - 1;
      continue;
    }

    // positional email(s)
    const cleaned = cleanEmail(a);
    if (cleaned.includes(",")) splitListToken(cleaned).forEach((p) => out.push(p));
    else if (isEmailLike(cleaned)) out.push(cleaned);
  }

  if (usePlaceholder) return PLACEHOLDER_LIST.slice();

  const deduped = Array.from(new Set(out.filter(isEmailLike)));
  return deduped.length ? deduped : [DEFAULT_EMAIL];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Send welcome email directly via Brevo HTTP API (standalone, no server-only import).
 * Uses minimal template for Gmail, rich template for others (same as email.ts).
 * Returns the messageId if successful.
 */
async function sendWelcomeEmailDirect(toEmail: string): Promise<string | null> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set");
  }

  const fromEnv = process.env.EMAIL_FROM || "Avinash Ranganath <no-reply@invoiceqa.com>";
  const replyTo = process.env.EMAIL_REPLY_TO || "support@invoiceqa.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://invoiceqa.com";
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-link";

  // Parse sender
  const fromEmailMatch = /<?([^<>@\s]+@[^<>@\s]+)>?/.exec(fromEnv);
  const fromEmail = fromEmailMatch ? fromEmailMatch[1] : fromEnv;
  const displayNameMatch = /^\s*([^<]+)</.exec(fromEnv);
  const fromName = displayNameMatch ? displayNameMatch[1].trim() : undefined;

  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL || fromEmail;
  const brevoSenderName = process.env.BREVO_SENDER_NAME || fromName;

  // A/B switch: when enabled, Gmail recipients get minimal; others get rich
  const abGmailMinimal = process.env.EMAIL_WELCOME_AB_GMAIL_MINIMAL === "true";
  const isGmail = /@(gmail\.com|googlemail\.com)$/i.test(toEmail);

  // Resolve minimal mode: AB logic takes precedence, else fall back to env flag
  const minimal = abGmailMinimal ? isGmail : process.env.EMAIL_WELCOME_MINIMAL === "true";
  const noLinks = process.env.EMAIL_WELCOME_NO_LINKS === "true";

  const subject = minimal
    ? "Welcome to InvoiceQA early access"
    : "Welcome to InvoiceQA early access 🎉";

  // --- Text content ---
  const textMinimal = `Hi there,

You're on the InvoiceQA early access list. Welcome aboard.

What to expect:
- Early access invite when we launch
- Lifetime discount for early adopters
- Your input will shape what we build next

Quick question: what's the biggest invoice-related headache for you? Just hit reply.

Thanks,
Avinash Ranganath
Founder, InvoiceQA${noLinks ? "" : `\n\nP.S. If you'd prefer to chat live, grab a 15-minute slot here: ${calendlyUrl}`}`;

  const textRich = `Hi there,

You're officially on the InvoiceQA early access list. Welcome aboard!
I'm Avinash, the founder building InvoiceQA. I'm creating an intelligent system that catches invoice errors, fraud risks, and duplicates before they cost you time and money.

Here's what you can expect:
  ✓ Early access invite: You'll be among the first to get access when we launch
  ✓ Lifetime discount: Early adopters get special pricing
  ✓ Product input: Your feedback shapes what features we prioritize

Quick question: What's the biggest invoice-related headache you deal with today? Duplicate payments? Fraud concerns? Manual checking taking too long? Just hit reply and let me know. Your answer directly influences what features I prioritize.

Thanks for your interest,
Avinash Ranganath
Founder, InvoiceQA
${noLinks ? "" : `\nP.S. If you'd prefer to chat live, grab a 15-minute slot here: ${calendlyUrl}\nI'm talking to as many finance teams as possible to make sure we build something you actually need.`}
\nInvoiceQA - A product by Taranuka AB\n${siteUrl}`;

  const textContent = minimal ? textMinimal : textRich;

  // --- HTML content ---
  const htmlMinimal = `
  <div style="background:#ffffff;padding:16px;">
    <div style="max-width:600px;margin:0 auto;color:#0f172a;">
      <p style="margin:0 0 12px;line-height:1.6;">Hi there,</p>
      <p style="margin:0 0 12px;line-height:1.6;">You're on the InvoiceQA early access list. Welcome aboard.</p>
      <p style="margin:0 0 12px;line-height:1.6;"><strong>What to expect:</strong></p>
      <ul style="margin:0 0 12px 18px;padding:0;line-height:1.6;">
        <li>Early access invite when we launch</li>
        <li>Lifetime discount for early adopters</li>
        <li>Your input will shape what we build next</li>
      </ul>
      <p style="margin:0 0 12px;line-height:1.6;">Quick question: what's the biggest invoice‑related headache for you? Just hit reply.</p>
      <p style="margin:0 0 12px;line-height:1.6;">Thanks,<br/><strong>Avinash Ranganath</strong><br/>Founder, InvoiceQA</p>
      ${noLinks ? "" : `<p style="margin:12px 0;line-height:1.6;color:#475569;"><em>P.S. If you'd prefer to chat live, grab a <a href="${calendlyUrl}" style="color:#2563eb;text-decoration:underline;">15-minute slot</a>. I'm talking to as many finance teams as possible to make sure we build something you actually need.</em></p>`}
    </div>
  </div>`;

  const htmlRich = `
  <div style="background:#f6f9fc; padding:24px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; box-shadow:0 8px 24px rgba(15,23,42,0.06); overflow:hidden;">
      <div style="padding:24px 24px 0; text-align:center;">
        <img src="${siteUrl}/brand/logo-bluegray.png" alt="InvoiceQA" width="140" height="40" style="display:inline-block; max-width:140px; height:auto;" />
      </div>
      <div style="padding:24px 24px 8px;">
        <h1 style="margin:0 0 12px; font-size:24px; line-height:1.25; color:#0f172a;">Welcome to InvoiceQA early access 🎉</h1>
        <p style="margin:0 0 12px; font-size:16px; color:#334155; line-height:1.7;">Hi there,</p>
        <p style="margin:0 0 12px; font-size:16px; color:#334155; line-height:1.7;">You're officially on the <strong>InvoiceQA early access</strong> list. Welcome aboard!</p>
        <p style="margin:0 0 16px; font-size:16px; color:#334155; line-height:1.7;">I'm Avinash, the founder building InvoiceQA. I'm creating an intelligent system that catches invoice errors, fraud risks, and duplicates before they cost you time and money.</p>
        <p style="margin:0 0 8px; font-size:16px; color:#0f172a; line-height:1.7;"><strong>Here's what you can expect:</strong></p>
        <ul style="list-style:none; padding-left:0; margin:0 0 16px 0;">
          <li style="margin:6px 0; font-size:16px; color:#334155;">✓ <strong>Early access invite</strong>: You'll be among the first to get access when we launch</li>
          <li style="margin:6px 0; font-size:16px; color:#334155;">✓ <strong>Lifetime discount</strong>: Early adopters get special pricing</li>
          <li style="margin:6px 0; font-size:16px; color:#334155;">✓ <strong>Product input</strong>: Your feedback shapes what features we prioritize</li>
        </ul>
        <p style="margin:0 0 20px; font-size:16px; color:#334155; line-height:1.7;"><strong>Quick question:</strong> What's the biggest invoice-related headache you deal with today? Duplicate payments? Fraud concerns? Manual checking taking too long? Just hit reply and let me know. Your answer directly influences what features I prioritize.</p>
        <p style="margin:0 0 8px; font-size:16px; color:#334155; line-height:1.7;">Thanks for your interest,</p>
        <p style="margin:0; font-size:16px; color:#0f172a; line-height:1.7;"><strong>Avinash Ranganath</strong><br/>Founder, InvoiceQA</p>
        ${noLinks ? "" : `<hr style="margin:20px 0; border:none; border-top:1px solid #e2e8f0;"/>`}
        ${noLinks ? "" : `<div style="text-align:center; margin:12px 0 8px;"><a href="${calendlyUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:12px 18px; background:#2563eb; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;">Book a 15‑min call</a></div>`}
        ${noLinks ? "" : `<p style="margin:16px 0; font-size:14px; color:#475569; line-height:1.7;"><em>P.S. If you'd prefer to chat live, grab a <a href="${calendlyUrl}" target="_blank" rel="noopener noreferrer">15-minute slot</a>. I'm talking to as many finance teams as possible to make sure we build something you actually need.</em></p>`}
      </div>
      <div style="padding:20px 24px; background:#f8fafc; text-align:center;">
        <p style="margin:0; font-size:12px; color:#64748b;">InvoiceQA • A product by Taranuka AB • <a href="${siteUrl}" style="color:#64748b; text-decoration:underline;">${siteUrl}</a></p>
      </div>
    </div>
  </div>`;

  const htmlContent = minimal ? htmlMinimal : htmlRich;

  // Build tags for tracking
  const tags = ["landing-page", "welcome-email", "test-script", minimal ? "variant-minimal" : "variant-rich"] as string[];
  if (abGmailMinimal) tags.push(isGmail ? "ab-gmail-minimal" : "ab-nongmail-rich");

  const payload = {
    sender: { email: brevoSenderEmail, name: brevoSenderName },
    to: [{ email: toEmail }],
    subject,
    htmlContent,
    textContent,
    replyTo: { email: replyTo },
    tags,
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as { messageId?: string };
  return data.messageId || null;
}

/**
 * Query Brevo's transactional email events API to get delivery status.
 * Polls for events related to the given email address.
 * Note: We don't filter by messageId in the API call because Brevo's API
 * may not match the messageId format consistently. We filter locally instead.
 */
async function getEmailEvents(email: string): Promise<BrevoEvent[]> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set");
  }

  // Query events for this email address
  const params = new URLSearchParams({
    email,
    limit: "50",
    sort: "desc",
  });


  const res = await fetch(`https://api.brevo.com/v3/smtp/statistics/events?${params}`, {
    headers: {
      "api-key": apiKey,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo events API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as { events?: BrevoEvent[] };
  return data.events || [];
}

/**
 * Determine delivery status from Brevo events.
 * Event names aligned with email-webhook/route.ts:
 *   Bounce: bounces, hard_bounce, soft_bounce, blocked, invalid_email, deferred, error
 *   Delivered: delivered, sent, requests, queued, processed
 * Note: Brevo API returns camelCase variants (e.g., hardBounces, softBounces)
 */
function determineStatus(events: BrevoEvent[], messageId: string | null): { status: DeliveryStatus; reason?: string } {
  if (events.length === 0) {
    return { status: "pending" };
  }

  // Filter to events matching our messageId if available
  // Handle messageId format variations (with/without angle brackets)
  let relevantEvents = events;
  if (messageId) {
    const cleanMessageId = messageId.replace(/^<|>$/g, ""); // Remove angle brackets
    relevantEvents = events.filter((e) => {
      if (!e.messageId) return false;
      const cleanEventId = e.messageId.replace(/^<|>$/g, "");
      return cleanEventId === cleanMessageId || e.messageId === messageId;
    });
  }

  if (relevantEvents.length === 0) {
    return { status: "pending" };
  }

  // Map Brevo event names to our status types
  // Includes both snake_case (webhook) and camelCase (API) variants
  const eventToStatus: Record<string, DeliveryStatus> = {
    // Hard bounce events
    hardBounces: "hard_bounce",
    hardBounce: "hard_bounce",
    hard_bounce: "hard_bounce",
    bounces: "hard_bounce",
    // Soft bounce events
    softBounces: "soft_bounce",
    softBounce: "soft_bounce",
    soft_bounce: "soft_bounce",
    // Block/error events
    blocked: "blocked",
    spam: "blocked",
    invalid: "error",
    invalid_email: "error",
    invalidEmail: "error",
    error: "error",
    // Deferred
    deferred: "deferred",
    // Success events (delivered is the terminal success state)
    delivered: "delivered",
  };

  // Check for terminal statuses (in priority order - worst first)
  // Aligns with email-webhook/route.ts bounce detection
  const terminalEventOrder = [
    // Hard bounces (highest priority - permanent failure)
    "hardBounces", "hardBounce", "hard_bounce", "bounces",
    // Blocked/invalid (permanent failure)
    "blocked", "spam", "invalid", "invalid_email", "invalidEmail", "error",
    // Soft bounces (temporary failure)
    "softBounces", "softBounce", "soft_bounce",
    // Deferred (temporary)
    "deferred",
    // Delivered (success)
    "delivered",
  ];

  for (const eventName of terminalEventOrder) {
    const event = relevantEvents.find((e) => e.event === eventName);
    if (event) {
      const status = eventToStatus[eventName] || "unknown";
      return { status, reason: event.reason };
    }
  }

  // Check for in-progress events (sent, requests, queued, processed)
  // These indicate the email is still being processed
  const inProgressEvents = ["requests", "sent", "queued", "processed"];
  const inProgressEvent = relevantEvents.find((e) => inProgressEvents.includes(e.event));
  if (inProgressEvent) {
    return { status: "pending" };
  }

  return { status: "unknown" };
}

/**
 * Poll Brevo for delivery status with retries.
 */
async function pollDeliveryStatus(
  email: string,
  messageId: string | null,
  maxAttempts: number = 12,
  intervalMs: number = 5000,
  debug: boolean = false
): Promise<{ status: DeliveryStatus; reason?: string }> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const events = await getEmailEvents(email);

      if (debug && events.length > 0 && messageId) {
        // Only show events matching our messageId
        const cleanMessageId = messageId.replace(/^<|>$/g, "");
        const matchingEvents = events.filter((e) => {
          if (!e.messageId) return false;
          const cleanEventId = e.messageId.replace(/^<|>$/g, "");
          return cleanEventId === cleanMessageId;
        });

        if (matchingEvents.length > 0) {
          console.log(`\n   [debug] Events for messageId ${messageId}:`);
          matchingEvents.forEach((e) => {
            console.log(`     - ${e.event} at ${e.date}${e.reason ? ` (${e.reason})` : ""}`);
          });
        }
      }

      const result = determineStatus(events, messageId);

      // If we have a terminal status, return it
      if (result.status !== "pending" && result.status !== "unknown") {
        return result;
      }

      // If still pending, wait and retry
      if (attempt < maxAttempts) {
        process.stdout.write(".");
        await sleep(intervalMs);
      }
    } catch (err) {
      console.error(`\n  [poll attempt ${attempt}] Error:`, err);
      if (attempt < maxAttempts) {
        await sleep(intervalMs);
      }
    }
  }

  return { status: "pending", reason: "Timed out waiting for delivery confirmation" };
}

function formatStatus(status: DeliveryStatus): string {
  const colors = {
    delivered: "\x1b[32m", // green
    soft_bounce: "\x1b[33m", // yellow
    hard_bounce: "\x1b[31m", // red
    blocked: "\x1b[31m", // red
    error: "\x1b[31m", // red
    deferred: "\x1b[33m", // yellow
    pending: "\x1b[36m", // cyan
    unknown: "\x1b[90m", // gray
  };
  const reset = "\x1b[0m";
  return `${colors[status] || ""}${status.toUpperCase()}${reset}`;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const recipients = parseRecipients(rawArgs);
  const skipCheck = hasFlag("no-check", rawArgs) || hasFlag("skip-check", rawArgs);
  const debug = hasFlag("debug", rawArgs);

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  InvoiceQA Welcome Email Test Script");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`  Recipients: ${recipients.length}`);
  console.log(`  Check delivery: ${skipCheck ? "No (--no-check)" : "Yes (polling Brevo API)"}`);
  if (debug) console.log(`  Debug mode: ON`);
  console.log("───────────────────────────────────────────────────────────────\n");

  const results: DeliveryResult[] = [];

  // Check A/B settings
  const abGmailMinimal = process.env.EMAIL_WELCOME_AB_GMAIL_MINIMAL === "true";
  const forceMinimal = process.env.EMAIL_WELCOME_MINIMAL === "true";

  for (const email of recipients) {
    const isGmail = /@(gmail\.com|googlemail\.com)$/i.test(email);
    const variant = abGmailMinimal ? (isGmail ? "minimal" : "rich") : (forceMinimal ? "minimal" : "rich");

    console.log(`📧 Sending to: ${email}`);
    console.log(`   📝 Template: ${variant}${isGmail ? " (Gmail)" : ""}`);

    // Step 1: Send the email
    let messageId: string | null = null;
    let sendError: string | undefined;
    try {
      messageId = await sendWelcomeEmailDirect(email);
      console.log(`   ✓ Sent (messageId: ${messageId || "N/A"})`);
    } catch (err) {
      sendError = err instanceof Error ? err.message : String(err);
      console.log(`   ✗ Send failed: ${sendError}`);
      results.push({ email, messageId: null, status: "error", sendError });
      continue;
    }

    // Step 2: Check delivery status (unless skipped)
    if (skipCheck) {
      results.push({ email, messageId, status: "pending", reason: "Skipped check" });
      console.log(`   ⏭ Skipped delivery check\n`);
      continue;
    }

    process.stdout.write("   ⏳ Checking delivery status ");
    const { status, reason } = await pollDeliveryStatus(email, messageId, 24, 5000, debug);
    console.log(`\n   📊 Status: ${formatStatus(status)}${reason ? ` (${reason})` : ""}\n`);
    results.push({ email, messageId, status, reason });

    // Delay between recipients
    if (recipients.indexOf(email) < recipients.length - 1) {
      await sleep(1000);
    }
  }

  // Summary
  console.log("───────────────────────────────────────────────────────────────");
  console.log("  SUMMARY");
  console.log("───────────────────────────────────────────────────────────────");

  const delivered = results.filter((r) => r.status === "delivered").length;
  const bounced = results.filter((r) => ["hard_bounce", "soft_bounce", "blocked"].includes(r.status)).length;
  const errors = results.filter((r) => r.status === "error" || r.sendError).length;
  const pending = results.filter((r) => r.status === "pending" || r.status === "unknown").length;

  console.log(`  Total: ${results.length}`);
  console.log(`  ✓ Delivered: ${delivered}`);
  console.log(`  ✗ Bounced: ${bounced}`);
  console.log(`  ⚠ Errors: ${errors}`);
  console.log(`  ⏳ Pending/Unknown: ${pending}`);
  console.log("");

  // Detailed results table
  console.log("  Details:");
  for (const r of results) {
    const statusStr = formatStatus(r.status);
    const detail = r.sendError || r.reason || "";
    console.log(`    ${r.email.padEnd(35)} ${statusStr.padEnd(20)} ${detail}`);
  }
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Exit code based on results
  if (errors > 0 || bounced > 0) {
    process.exit(1);
  }
  process.exit(0);
}

main();
