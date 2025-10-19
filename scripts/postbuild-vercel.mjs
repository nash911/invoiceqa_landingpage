import { promises as fs } from "fs";
import path from "path";

const nextManifest = path.join(".next", "routes-manifest.json");
const vercelManifestDir = path.join(".vercel", "output", "static");
const vercelManifest = path.join(vercelManifestDir, "routes-manifest.json");

async function copyManifest() {
  try {
    await fs.access(nextManifest);
  } catch {
    console.warn(`Next.js routes manifest not found at ${nextManifest}`);
    return;
  }

  await fs.mkdir(vercelManifestDir, { recursive: true });
  await fs.copyFile(nextManifest, vercelManifest);
  console.log(`Copied routes-manifest.json to ${vercelManifest}`);
}

copyManifest().catch((error) => {
  console.error("Failed to copy routes manifest for Vercel:", error);
  process.exit(1);
});
