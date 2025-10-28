#!/usr/bin/env tsx
/*
Usage:
  pnpm run test:webhook                  # delivered for default email
  pnpm run test:webhook -- --email you@example.com --event delivered
  pnpm run test:webhook -- --email you@example.com --event hard_bounce
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

const email = getArg("email", "nash911@gmail.com") as string;
const event = (getArg("event", "delivered") as string).toLowerCase();
const baseUrl = process.env.WEBHOOK_BASE_URL || "http://localhost:3000";
const url = `${baseUrl}/api/email-webhook`;

const payload = { event, email, date: new Date().toISOString(), messageId: "test-message-id" };

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
