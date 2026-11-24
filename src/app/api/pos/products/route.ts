import { put } from "@vercel/blob";
import type { NextRequest } from "next/server";
import { keyMatches } from "@/lib/orders";
import { parsePosRows } from "@/lib/pos-sync";

const POS_ROWS_PATH = "pos/products.json";
const MAX_BODY = 4_000_000;

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

/**
 * POS "Update website": PUT /api/pos/products with header "Authorization: Bearer <POS_API_KEY>"
 * and body {"products": [{id, name, brand_name, model, category, sale_price, stock_qty, sold_qty}]}.
 * Saves the list privately, then starts a rebuild (DEPLOY_HOOK_URL) that regenerates the catalog.
 */
export async function PUT(req: NextRequest) {
  const key = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
  if (!process.env.POS_API_KEY) return json({ error: "POS_API_KEY is not set on the server." }, 503);
  if (!keyMatches(key, process.env.POS_API_KEY)) return json({ error: "Unauthorized" }, 401);

  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ error: "Product list too large." }, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Body is not valid JSON." }, 400);
  }
  const parsed = parsePosRows(body);
  if ("error" in parsed) return json({ error: parsed.error }, 422);

  try {
    await put(POS_ROWS_PATH, JSON.stringify({ receivedAt: new Date().toISOString(), products: parsed.rows }), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (err) {
    console.error("pos products store failed", err);
    return json({ error: "Could not save the product list. Try again." }, 503);
  }

  let rebuild: "started" | "failed" | "not-configured" = "not-configured";
  if (process.env.DEPLOY_HOOK_URL) {
    try {
      const res = await fetch(process.env.DEPLOY_HOOK_URL, { method: "POST", signal: AbortSignal.timeout(10_000) });
      rebuild = res.ok ? "started" : "failed";
      if (!res.ok) console.error("deploy hook returned", res.status);
    } catch (err) {
      console.error("deploy hook failed", err);
      rebuild = "failed";
    }
  }

  const inStock = parsed.rows.filter((r) => r.stock_qty > 0 && r.sale_price > 0).length;
  return json({ ok: true, received: parsed.rows.length, inStock, rebuild }, 200);
}
