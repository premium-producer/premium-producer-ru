import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const pagesDir = path.join(root, "src/pages");
const assetsDir = path.join(root, "src/assets");
const publicDir = path.join(root, "public");
const staticDir = path.join(root, "src/static");

await rm(distDir, { force: true, recursive: true });
await mkdir(distDir, { recursive: true });

await copyIfExists(staticDir, distDir);
await copyIfExists(publicDir, path.join(distDir, "public"));
await copyIfExists(assetsDir, path.join(distDir, "assets"));
await copyPages(pagesDir, distDir);

async function copyIfExists(from, to) {
  try {
    await cp(from, to, { recursive: true });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

async function copyPages(from, to) {
  const entries = await readdir(from, { withFileTypes: true });

  await mkdir(to, { recursive: true });

  for (const entry of entries) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await copyPages(source, target);
      continue;
    }

    await cp(source, target);
  }
}
