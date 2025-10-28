#!/usr/bin/env tsx
/*
Usage:
  pnpm run test:webhook                  # single delivered for default email
  pnpm run test:webhook -- --email you@example.com --event delivered
  pnpm run test:webhook -- --email you@example.com other@ex.com --event delivered hard_bounce --batch

Env:
  WEBHOOK_BASE_URL (default http://localhost:3000)
*/

import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";

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
const emails = getAll("email");
const events = getAll("event");

// Default data
const defaultSingle = { email: "nash911@gmail.com", event: "delivered" };
const defaultBatch = [
  { email: "nash911@gmail.com", event: "delivered" },
  { email: "nash911@gmx.com", event: "hard_bounce" },
];

let payload: unknown;
if (batch) {
  // Build array payload from supplied emails/events; zip events or reuse first.
  const arr: { email: string; event: string; date: string; messageId: string }[] = [];
  if (emails && emails.length) {
    const evs = events && events.length ? events : [events?.[0] || "delivered"]; // use first event or default
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const event = evs[i] || evs[0] || "delivered";
      arr.push({ email, event: event.toLowerCase(), date: new Date().toISOString(), messageId: `test-${i + 1}` });
    }
  } else {
    for (let i = 0; i < defaultBatch.length; i++) {
      const d = defaultBatch[i];
      arr.push({ email: d.email, event: d.event, date: new Date().toISOString(), messageId: `test-${i + 1}` });
    }
  }
  payload = arr;
} else {
  const email = getArg("email", defaultSingle.email) as string;
  const event = (getArg("event", defaultSingle.event) as string).toLowerCase();
  payload = { event, email, date: new Date().toISOString(), messageId: "test-message-id" };
}

(async () => {
  try {
    // @ts-ignore - fetch in Node 18+
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log(`POST ${url} -> ${res.status}`);
    console.log(text);
  } catch (e) {
    console.error("Failed to POST webhook:", e);
    process.exit(1);
  }
})();
