import { get, list, put } from "@vercel/blob";
import type { NextRequest } from "next/server";
import { buildOrder, keyMatches, newOrderId, type Order } from "@/lib/orders";

// Blob free tier counts every put() and list() against 2,000 operations a month, so
// the POS poll reads one small marker file (a cheap read) and lists only when it moved.
const MARKER = "orders-latest.txt";
const PREFIX = "orders/";
const SKEW_MS = 60_000; // tolerate clock drift between function instances
const MAX_BODY = 20_000;
const MAX_PER_POLL = 100;

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

async function readText(pathname: string): Promise<string | null> {
  const r = await get(pathname, { access: "private", useCache: false });
  return r?.statusCode === 200 ? await new Response(r.stream).text() : null;
}

/** Customer checkout: validate, re-price from the catalog, store privately. */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > MAX_BODY) return json({ error: "Order too large." }, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const result = buildOrder(body, newOrderId(), new Date());
  if ("errors" in result) return json({ errors: result.errors }, 422);
  const { order } = result;

  try {
    await put(`${PREFIX}${order.id}.json`, JSON.stringify(order), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: false,
    });
    // Written after the order, so the marker never points past an order that isn't stored yet.
    await put(MARKER, String(Date.now()), { access: "private", contentType: "text/plain", addRandomSuffix: false, allowOverwrite: true });
  } catch (err) {
    console.error("order store failed", order.id, err);
    return json({ error: "We could not place your order. Please try again or call us." }, 503);
  }
  return json({ id: order.id, total: order.total }, 201);
}

/**
 * POS feed: GET /api/orders?since=<ms>[&force=1] with header "Authorization: Bearer <POS_API_KEY>".
 * Returns orders uploaded at or after `since` (minus clock skew); the POS de-duplicates by id.
 */
export async function GET(req: NextRequest) {
  const key = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
  if (!process.env.POS_API_KEY) return json({ error: "POS_API_KEY is not set on the server." }, 503);
  if (!keyMatches(key, process.env.POS_API_KEY)) return json({ error: "Unauthorized" }, 401);

  const since = Math.max(0, Number(req.nextUrl.searchParams.get("since")) || 0);
  const force = req.nextUrl.searchParams.get("force") === "1";

  try {
    if (!force) {
      const marker = Number(await readText(MARKER)) || 0;
      if (marker < since - SKEW_MS) return json({ orders: [], cursor: since, more: false });
    }

    const fresh: { pathname: string; at: number }[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
      for (const b of page.blobs) {
        const at = new Date(b.uploadedAt).getTime();
        if (at >= since - SKEW_MS) fresh.push({ pathname: b.pathname, at });
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    fresh.sort((a, b) => a.at - b.at);
    const batch = fresh.slice(0, MAX_PER_POLL);
    const orders = (await Promise.all(batch.map((b) => readText(b.pathname))))
      .filter((t): t is string => t !== null)
      .map((t) => JSON.parse(t) as Order);
    const more = fresh.length > batch.length;
    return json({ orders, cursor: batch.length ? batch[batch.length - 1].at : since, more });
  } catch (err) {
    console.error("order feed failed", err);
    return json({ error: "Order storage unavailable." }, 503);
  }
}
