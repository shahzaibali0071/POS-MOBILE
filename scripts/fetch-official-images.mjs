// Runs before `next build` (npm "prebuild"). Downloads each official brand photo listed in
// src/data/official-images.json into public/products/official/ and records the ones that
// worked in official-manifest.json. A failed download never fails the build: that product
// simply keeps its shop photo.
import { mkdir, readFile, writeFile } from "node:fs/promises";

const MAX_BYTES = 5_000_000;
const TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif" };
const urls = JSON.parse(await readFile("src/data/official-images.json", "utf8"));
await mkdir("public/products/official", { recursive: true });

const manifest = {};
await Promise.all(
  Object.entries(urls).map(async ([id, url]) => {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000), headers: { "User-Agent": "Mozilla/5.0" } });
      const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
      if (!res.ok || !TYPES[type]) throw new Error(`HTTP ${res.status} ${type}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1_000 || buf.length > MAX_BYTES) throw new Error(`size ${buf.length}`);
      const file = `${id}.${TYPES[type]}`;
      await writeFile(`public/products/official/${file}`, buf);
      manifest[id] = `/products/official/${file}`;
    } catch (err) {
      console.warn(`official image ${id}: ${err.message}; keeping shop photo`);
    }
  }),
);
await writeFile("src/data/official-manifest.json", JSON.stringify(manifest, null, 1) + "\n");
console.log(`official images: ${Object.keys(manifest).length}/${Object.keys(urls).length}`);
