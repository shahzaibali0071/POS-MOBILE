// Runs before `next build` (npm "prebuild"), on Vercel where the brand sites are reachable.
// 1. Downloads each brand's full Shopify catalog (src/data/brand-sources.json) and saves a
//    snapshot to public/brand-catalog/<brand>.json, so the catalog is kept for future updates.
// 2. Photos: hand-checked URLs in official-images.json win; other products of those brands are
//    matched by model code; official-exclude.json lists known wrong-variant photos.
// 3. Downloads the chosen photos into public/products/official/ and writes official-manifest.json.
// Nothing here can fail the build: anything that goes wrong keeps the shop photo.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { findMatch, modelCodes, type BrandProduct } from "../src/lib/brand-match";

type Source = { brand: string; site: string };
type ShopifyProduct = { title: string; handle: string; variants?: { sku: string | null }[]; images?: { src: string }[] };

const MAX_BYTES = 5_000_000;
const MAX_PAGES = 20; // 250 products per page
const TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif" };
const readJson = async <T,>(p: string) => JSON.parse(await readFile(p, "utf8")) as T;
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/png,image/*;q=0.8,*/*;q=0.5",
};
const get = (url: string) => fetch(url, { signal: AbortSignal.timeout(20_000), headers: HEADERS });

/**
 * cdn.shopify.com refuses some server downloads (HTTP 403), but every Shopify store also
 * serves its files from its own domain at /cdn/shop/files/<name>, so try those too.
 */
function candidates(url: string, sites: string[]): string[] {
  const m = /^https:\/\/cdn\.shopify\.com\/s\/files\/[\d/]+\/files\/(.+)$/.exec(url);
  return m ? [url, ...sites.map((site) => `${site}/cdn/shop/files/${m[1]}`)] : [url];
}

async function brandCatalog({ site }: Source): Promise<BrandProduct[]> {
  const out: BrandProduct[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await get(`${site}/products.json?limit=250&page=${page}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { products } = (await res.json()) as { products: ShopifyProduct[] };
    if (!products?.length) break;
    for (const p of products) {
      out.push({
        title: p.title,
        handle: p.handle,
        skus: (p.variants ?? []).map((v) => v.sku ?? "").filter(Boolean),
        image: p.images?.[0]?.src ?? null,
      });
    }
  }
  return out;
}

async function download(id: string, url: string, sites: string[]): Promise<string> {
  let lastError = new Error("no URL");
  for (const u of candidates(url, sites)) {
    try {
      return await save(id, u);
    } catch (err) {
      lastError = err as Error;
    }
  }
  throw lastError;
}

async function save(id: string, url: string): Promise<string> {
  const res = await get(url);
  const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!res.ok || !TYPES[type]) throw new Error(`HTTP ${res.status} ${type}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1_000 || buf.length > MAX_BYTES) throw new Error(`size ${buf.length}`);
  const file = `${id}.${TYPES[type]}`;
  await writeFile(`public/products/official/${file}`, buf);
  return `/products/official/${file}`;
}

const sources = await readJson<Source[]>("src/data/brand-sources.json");
const manual = await readJson<Record<string, string>>("src/data/official-images.json");
const exclude = await readJson<Record<string, string>>("src/data/official-exclude.json");
const { products } = await readJson<{ products: { posId: number; model: string; name: string; specs: [string, string][] }[] }>("src/data/products.json");
await mkdir("public/products/official", { recursive: true });
await mkdir("public/brand-catalog", { recursive: true });

const catalogs = new Map<string, BrandProduct[]>();
await Promise.all(
  sources.map(async (s) => {
    try {
      const items = await brandCatalog(s);
      catalogs.set(s.brand, items);
      await writeFile(`public/brand-catalog/${s.brand}.json`, JSON.stringify({ site: s.site, fetchedAt: new Date().toISOString(), products: items }));
      console.log(`brand catalog ${s.brand}: ${items.length} products`);
    } catch (err) {
      console.warn(`brand catalog ${s.brand}: ${(err as Error).message}; only hand-checked photos used`);
    }
  }),
);

const chosen: Record<string, { url: string; how: string }> = {};
for (const [id, url] of Object.entries(manual)) chosen[id] = { url, how: "hand-checked" };
for (const p of products) {
  const id = String(p.posId);
  if (chosen[id] || exclude[id]) continue;
  const catalog = catalogs.get(p.model.trim().toLowerCase());
  if (!catalog) continue;
  const model = p.specs.find(([k]) => k === "Model")?.[1] ?? "";
  const hit = findMatch(modelCodes(`${model} ${p.name}`), catalog);
  if (hit?.image) chosen[id] = { url: hit.image, how: `auto: ${hit.title}` };
}

const manifest: Record<string, string> = {};
const report: Record<string, string> = {};
await Promise.all(
  Object.entries(chosen).map(async ([id, { url, how }]) => {
    try {
      manifest[id] = await download(id, url, sources.map((s) => s.site));
      report[id] = how;
    } catch (err) {
      console.warn(`official image ${id}: ${(err as Error).message}; keeping shop photo`);
    }
  }),
);
await writeFile("src/data/official-manifest.json", JSON.stringify(manifest, null, 1) + "\n");
await writeFile("public/brand-catalog/matches.json", JSON.stringify(report, null, 1));
const auto = Object.values(report).filter((h) => h.startsWith("auto")).length;
console.log(`official images: ${Object.keys(manifest).length}/${Object.keys(chosen).length} (${auto} auto-matched)`);
