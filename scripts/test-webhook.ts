#!/usr/bin/env tsx
/*
Usage:
  pnpm run test:webhook                  # single delivered for default email (with required tags)
  pnpm run test:webhook -- --email you@example.com --event delivered
  pnpm run test:webhook -- --email you@example.com other@ex.com --event delivered hard_bounce --batch
  pnpm run test:webhook -- --no-tags     # test without tags (should be skipped by webhook)
  pnpm run test:webhook -- --custom-tags "tag1|tag2"  # test with custom tags

Env:
  WEBHOOK_BASE_URL (default http://localhost:3000)
*/

import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";

// Required tags that the webhook expects
const REQUIRED_TAGS = "landing-page|welcome-email";

// Prefer .env.local, fallback to .env
(() => {
  const cwd = process.cwd();
  const localPath = path.resolve(cwd, ".env.local");
  const defaultPath = path.resolve(cwd, ".env");
  const pathToUse = fs.existsSync(localPath) ? localPath : fs.existsSync(defaultPath) ? defaultPath : undefined;
  if (pathToUse) {
    loadEnv({ path: pathToUse });
    console.log(`[env] Loaded ${path.basename(pathToUse)}`);
  } else {
    console.warn("[env] No .env.local or .env found. Relying on process env.");
  }
})();

const args = process.argv.slice(2);
function getArg(name: string, fallback?: string) {
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && idx + 1 < args.length) return args[idx + 1];
  return fallback;
}
function getAll(name: string, fallback?: string[]) {
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && idx + 1 < args.length) {
    const rest = args.slice(idx + 1);
    return rest.filter((v) => !v.startsWith("--"));
  }
  return fallback;
}
function hasFlag(name: string) {
  return args.includes(`--${name}`);
}

const baseUrl = process.env.WEBHOOK_BASE_URL || "http://localhost:3000";
const url = `${baseUrl}/api/email-webhook`;

const batch = hasFlag("batch");
const noTags = hasFlag("no-tags");
const customTags = getArg("custom-tags");
const emails = getAll("email");
const events = getAll("event");

// Determine which tags to use
const tags = noTags ? undefined : (customTags || REQUIRED_TAGS);

// Default data
const defaultSingle = { email: "nash911@gmail.com", event: "delivered" };
const defaultBatch = [
  { email: "nash911@gmail.com", event: "delivered" },
  { email: "nash911@gmx.com", event: "hard_bounce" },
];

let payload: unknown;
if (batch) {
  // Build array payload from supplied emails/events; zip events or reuse first.
  const arr: { email: string; event: string; date: string; messageId: string; tag?: string }[] = [];
  if (emails && emails.length) {
    const evs = events && events.length ? events : [events?.[0] || "delivered"]; // use first event or default
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const event = evs[i] || evs[0] || "delivered";
      const item: { email: string; event: string; date: string; messageId: string; tag?: string } = {
        email,
        event: event.toLowerCase(),
        date: new Date().toISOString(),
        messageId: `test-${i + 1}`,
      };
      if (tags) item.tag = tags;
      arr.push(item);
    }
  } else {
    for (let i = 0; i < defaultBatch.length; i++) {
      const d = defaultBatch[i];
      const item: { email: string; event: string; date: string; messageId: string; tag?: string } = {
        email: d.email,
        event: d.event,
        date: new Date().toISOString(),
        messageId: `test-${i + 1}`,
      };
      if (tags) item.tag = tags;
      arr.push(item);
    }
  }
  payload = arr;
} else {
  const email = getArg("email", defaultSingle.email) as string;
  const event = (getArg("event", defaultSingle.event) as string).toLowerCase();
  const item: { event: string; email: string; date: string; messageId: string; tag?: string } = {
    event,
    email,
    date: new Date().toISOString(),
    messageId: "test-message-id",
  };
  if (tags) item.tag = tags;
  payload = item;
}

(async () => {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  Webhook Test");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`  URL: ${url}`);
  console.log(`  Tags: ${tags || "(none - should be SKIPPED)"}`);
  console.log(`  Mode: ${batch ? "batch" : "single"}`);
  console.log("───────────────────────────────────────────────────────────────");
  console.log("Payload:", JSON.stringify(payload, null, 2));
  console.log("───────────────────────────────────────────────────────────────");

  try {
    // @ts-ignore - fetch in Node 18+
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log(`\nResponse: ${res.status}`);
    console.log(text);

    // Parse and interpret the response
    try {
      const json = JSON.parse(text);
      console.log("\n───────────────────────────────────────────────────────────────");
      if (json.ok) {
        console.log(`  ✓ Webhook processed successfully`);
        console.log(`  Updated: ${json.updated || 0} record(s)`);
        console.log(`  Skipped: ${json.skipped || 0} event(s) (missing required tags)`);
        if (!tags && json.skipped > 0) {
          console.log(`\n  ✓ Tag filtering is working correctly!`);
          console.log(`    Events without 'landing-page' and 'welcome-email' tags are skipped.`);
        }
        if (tags && json.updated > 0) {
          console.log(`\n  ✓ Events with correct tags were processed!`);
        }
      } else {
        console.log(`  ✗ Webhook returned error: ${json.error}`);
      }
    } catch {}
    console.log("═══════════════════════════════════════════════════════════════");
  } catch (e) {
    console.error("Failed to POST webhook:", e);
    process.exit(1);
  }
})();
