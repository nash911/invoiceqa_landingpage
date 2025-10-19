import { promises as fs } from "fs";
import path from "path";

const MANIFEST_FILENAME = "routes-manifest.json";

const DEFAULT_MANIFEST = {
  version: 3,
  pages404: true,
  basePath: "",
  rewrites: {
    beforeFiles: [],
    afterFiles: [],
    fallback: [],
  },
  redirects: [],
  headers: [],
  dynamicRoutes: [],
  dataRoutes: [],
  staticRoutes: [],
};

async function ensureManifest(manifestPath) {
  try {
    await fs.access(manifestPath);
    return true;
  } catch {
    return false;
  }
}

async function writeManifest(manifestPath) {
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(DEFAULT_MANIFEST));
}

async function main() {
  const outputsToCheck = [
    path.join(".vercel", "output", "static", MANIFEST_FILENAME),
    path.join(".next", MANIFEST_FILENAME),
  ];

  for (const manifestPath of outputsToCheck) {
    const exists = await ensureManifest(manifestPath);
    if (!exists) {
      console.warn(`Creating missing ${MANIFEST_FILENAME} at ${manifestPath}`);
      await writeManifest(manifestPath);
    }
  }
}

main().catch((error) => {
  console.error("Failed to ensure routes manifest:", error);
  process.exit(1);
});
