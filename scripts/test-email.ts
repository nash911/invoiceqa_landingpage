#!/usr/bin/env node
import dotenv from "dotenv";

// Load env from .env first, then overlay with .env.local if present
dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import { sendWelcomeEmail } from "../src/lib/email";

const PLACEHOLDER_LIST: string[] = [
  "nash911@gmail.com",
  "avinash@inshelf.com",
  "taranukaab@gmail.com",
  "avinash@amsinform.com",
];

function isEmailLike(s: string) {
  return /.+@.+\..+/.test(s);
}

function splitListToken(tok: string): string[] {
  return tok
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseRecipients(argv: string[]): string[] {
  const DEFAULT_EMAIL = "nash911@gmail.com";
  if (!argv || argv.length === 0) return [DEFAULT_EMAIL];

  let usePlaceholder = false;
  const out: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a || a === "--") continue;

    if (a === "--list" || a === "--multi" || a === "--many") {
      usePlaceholder = true;
      continue;
    }

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
        else out.push(tok);
        j++;
      }
      i = j - 1;
      continue;
    }

    // positional email(s)
    if (a.includes(",")) splitListToken(a).forEach((p) => out.push(p));
    else if (isEmailLike(a)) out.push(a);
  }

  if (usePlaceholder) return PLACEHOLDER_LIST.slice();

  const deduped = Array.from(new Set(out.filter(isEmailLike)));
  return deduped.length ? deduped : [DEFAULT_EMAIL];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const recipients = parseRecipients(rawArgs);

  if (recipients.length === 1) {
    console.log(`Sending welcome email to: ${recipients[0]}`);
    try {
      await sendWelcomeEmail(recipients[0]);
      console.log("sendWelcomeEmail() invoked. Check logs/inbox for delivery status.");
      process.exit(0);
    } catch (err) {
      console.error("sendWelcomeEmail() threw an error:", err);
      process.exit(1);
    }
    return;
  }

  console.log(`Sending welcome email to ${recipients.length} recipients...`);
  let failures = 0;
  for (const to of recipients) {
    process.stdout.write(`  → ${to} ... `);
    try {
      await sendWelcomeEmail(to);
      console.log("OK");
    } catch (err) {
      failures++;
      console.log("FAILED");
      console.error(err);
    }
    await sleep(750);
  }

  if (failures > 0) {
    console.log(`Done with ${failures} failure(s).`);
    process.exit(1);
  } else {
    console.log("All emails queued successfully.");
    process.exit(0);
  }
}

main();
