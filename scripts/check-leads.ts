#!/usr/bin/env tsx
/*
Usage:
  pnpm run check:leads                                 # checks default emails
  pnpm run check:leads -- --email a@b.com b@c.com      # checks provided emails
Env:
  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.
*/

import { createClient } from "@supabase/supabase-js";
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
function getAll(name: string, fallback?: string[]) {
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && idx + 1 < args.length) {
    const rest = args.slice(idx + 1);
    return rest.filter((v) => !v.startsWith("--"));
  }
  return fallback;
}

const emails = getAll("email", ["nash911@gmail.com", "nash911@gmx.com"])!;

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env.");
  process.exit(1);
}

(async () => {
  const supabase = createClient(url, key);
  console.log("Checking leads in:", new URL(url).host, "for", emails);
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .in("email", emails);
  if (error) {
    console.error("Query error:", error);
    process.exit(1);
  }
  console.log("Rows:");
  console.log(JSON.stringify(data, null, 2));
})();
