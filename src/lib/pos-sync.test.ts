import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePosRows } from "./pos-sync";

const row = { id: 7, name: "Orbit earbuds", brand_name: "Sovo", model: "SBT-950", category: "wireless", sale_price: 3499, stock_qty: 4, sold_qty: 9 };

test("accepts POS rows and normalises blanks", () => {
  const r = parsePosRows({ products: [row, { id: "8", name: " Cable ", brand_name: null, model: undefined, category: "", sale_price: "450", stock_qty: -1 }] });
  assert.ok("rows" in r);
  assert.deepEqual(r.rows[1], { id: 8, name: "Cable", brand_name: "", model: "", category: "", sale_price: 450, stock_qty: -1, sold_qty: 0 });
});

test("rejects bad payloads with a readable reason", () => {
  for (const [body, hint] of [
    [null, "Expected"],
    [{ products: [] }, "empty"],
    [{ products: [{ ...row, id: 0 }] }, "positive"],
    [{ products: [row, row] }, "twice"],
    [{ products: [{ ...row, name: "" }] }, "name"],
    [{ products: [{ ...row, sale_price: "abc" }] }, "numbers"],
    [{ products: [{ ...row, sale_price: -5 }] }, "numbers"],
    [{ products: [{ ...row, brand_name: 5 }] }, "text"],
  ] as const) {
    const r = parsePosRows(body);
    assert.ok("error" in r && r.error.includes(hint), `${JSON.stringify(body)} -> ${JSON.stringify(r)}`);
  }
});
