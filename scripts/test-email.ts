#!/usr/bin/env node
import dotenv from "dotenv";

// Load env from .env first, then overlay with .env.local if present
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import { sendWelcomeEmail } from "../src/lib/email";

function parseRecipient(argv: string[]): string {
  const DEFAULT_EMAIL = "nash911@gmail.com";
  if (!argv || argv.length === 0) return DEFAULT_EMAIL;

  // Support: pnpm run test:email -- someone@example.com
  // Support flags: --to someone@example.com or --to=someone@example.com
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a || a === "--") continue;
    if (a.startsWith("--to=")) return a.slice(5).trim();
    if (a === "--to" && argv[i + 1]) return argv[i + 1].trim();
    if (a.includes("@")) return a.trim();
  }
  return DEFAULT_EMAIL;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const toEmail = parseRecipient(rawArgs);
  console.log(`Sending welcome email to: ${toEmail}`);
  try {
    await sendWelcomeEmail(toEmail);
    console.log("sendWelcomeEmail() invoked. Check logs/inbox for delivery status.");
    process.exit(0);
  } catch (err) {
    console.error("sendWelcomeEmail() threw an error:", err);
    process.exit(1);
  }
}

main();
