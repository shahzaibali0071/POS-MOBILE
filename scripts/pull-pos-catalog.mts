// Runs first in `npm run build` (prebuild). If the POS has pushed a product list
// (PUT /api/pos/products), regenerate src/data/products.json from it with the same script the
// shop uses locally. Any problem keeps the committed catalog, so a bad push never breaks the site.
import { get } from "@vercel/blob";
import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CATALOG = "src/data/products.json";
const ROWS_PATH = "pos/products.json";

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return console.log("[pos] no Blob token, using committed catalog");

  const blob = await get(ROWS_PATH, { access: "private", useCache: false });
  if (!blob || blob.statusCode !== 200) return console.log("[pos] POS has not pushed products yet, using committed catalog");
  const rowsFile = join(tmpdir(), "pos-rows.json");
  await writeFile(rowsFile, await new Response(blob.stream).text());

  const before = await readFile(CATALOG, "utf8");
  const run = spawnSync("python3", ["scripts/pos_to_catalog.py", rowsFile, "public/products"], { encoding: "utf8" });
  if (run.error || run.status !== 0) {
    await writeFile(CATALOG, before);
    return console.warn("[pos] catalog script failed, using committed catalog:", run.error?.message ?? run.stderr);
  }

  const count = (JSON.parse(await readFile(CATALOG, "utf8")) as { products: unknown[] }).products.length;
  if (count === 0) {
    await writeFile(CATALOG, before);
    return console.warn("[pos] pushed list has no products in stock, keeping committed catalog");
  }
  console.log(`[pos] ${run.stdout.trim()}`);
}

main().catch((err) => console.warn("[pos] skipped:", err instanceof Error ? err.message : err));
