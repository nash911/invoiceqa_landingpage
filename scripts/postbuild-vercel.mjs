import { promises as fs } from "fs";
import path from "path";

const nextManifest = path.join(".next", "routes-manifest.json");
const outputs = [
  path.join(".vercel", "output", "routes-manifest.json"),
  path.join(".vercel", "output", "static", "routes-manifest.json"),
];

async function copyManifest() {
  try {
    await fs.access(nextManifest);
  } catch {
    console.warn(`Next.js routes manifest not found at ${nextManifest}`);
    return;
  }

  for (const target of outputs) {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(nextManifest, target);
    console.log(`Copied routes-manifest.json to ${target}`);
  }
}

copyManifest().catch((error) => {
  console.error("Failed to copy routes manifest for Vercel:", error);
  process.exit(1);
});
