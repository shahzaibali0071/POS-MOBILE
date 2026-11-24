// Validates the product list the POS pushes on "Update website" (PUT /api/pos/products).
// Rows mirror the POS products table; scripts/pos_to_catalog.py turns them into the public
// catalog at build time, so cost prices never exist here and stock counts never go public.

export type PosRow = {
  id: number;
  name: string;
  brand_name: string;
  model: string;
  category: string;
  sale_price: number;
  stock_qty: number;
  sold_qty: number;
};

export const MAX_ROWS = 10_000;

const text = (v: unknown, max: number) => (v === null || v === undefined ? "" : typeof v === "string" ? v.trim().slice(0, max) : null);
const num = (v: unknown) => (v === null || v === undefined || v === "" ? 0 : typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN);

export function parsePosRows(body: unknown): { rows: PosRow[] } | { error: string } {
  const list = (body as { products?: unknown })?.products;
  if (!Array.isArray(list)) return { error: 'Expected JSON like {"products": [...]}.' };
  if (list.length === 0) return { error: "The product list is empty, so nothing was changed." };
  if (list.length > MAX_ROWS) return { error: `Too many products (max ${MAX_ROWS}).` };

  const rows: PosRow[] = [];
  const seen = new Set<number>();
  for (const [i, raw] of list.entries()) {
    const r = (raw ?? {}) as Record<string, unknown>;
    const id = num(r.id);
    const name = text(r.name, 200);
    const brand = text(r.brand_name, 100);
    const model = text(r.model, 100);
    const category = text(r.category, 100);
    const price = num(r.sale_price);
    const stock = num(r.stock_qty);
    const sold = num(r.sold_qty);
    const where = `Row ${i + 1}`;
    if (!Number.isInteger(id) || id <= 0) return { error: `${where}: id must be a positive whole number.` };
    if (seen.has(id)) return { error: `${where}: id ${id} appears twice.` };
    if (!name) return { error: `${where} (id ${id}): name is missing.` };
    if (brand === null || model === null || category === null) return { error: `${where} (id ${id}): brand_name, model and category must be text.` };
    if (![price, stock, sold].every(Number.isFinite) || price < 0) return { error: `${where} (id ${id}): sale_price, stock_qty and sold_qty must be numbers.` };
    seen.add(id);
    rows.push({ id, name, brand_name: brand, model, category, sale_price: price, stock_qty: stock, sold_qty: Math.max(0, sold) });
  }
  return { rows };
}
