import assert from "node:assert/strict";
import { test } from "node:test";
import { cartReducer, cartTotals, sanitize, MAX_QTY } from "./cart-reducer";
import { discountPct, formatPrice, getCollection, products, shippingFor, FREE_SHIPPING_MIN, SHIPPING_FEE } from "./catalog";
import { normalizePkMobile, validateCheckout } from "./checkout";

const P = products[0];
const C = P.colors[0].name;

test("cart: add merges same product+colour and clamps qty", () => {
  let s = cartReducer([], { type: "add", slug: P.slug, color: C });
  s = cartReducer(s, { type: "add", slug: P.slug, color: C, qty: 50 });
  assert.equal(s.length, 1);
  assert.equal(s[0].qty, MAX_QTY);
  s = cartReducer(s, { type: "setQty", slug: P.slug, color: C, qty: 0 });
  assert.equal(s[0].qty, 1);
  assert.equal(cartReducer(s, { type: "add", slug: "nope", color: C }), s);
  assert.deepEqual(cartReducer(s, { type: "remove", slug: P.slug, color: C }), []);
});

test("cart: sanitize drops junk and unknown colours", () => {
  const out = sanitize([null, { slug: P.slug, color: "Neon", qty: 1 }, { slug: P.slug, color: C, qty: "3" }, { slug: P.slug, color: C, qty: NaN }]);
  assert.deepEqual(out, [{ slug: P.slug, color: C, qty: 4 }]);
  assert.deepEqual(sanitize("garbage"), []);
});

test("totals and shipping", () => {
  assert.equal(shippingFor(0), 0);
  assert.equal(shippingFor(FREE_SHIPPING_MIN - 1), SHIPPING_FEE);
  assert.equal(shippingFor(FREE_SHIPPING_MIN), 0);
  const t = cartTotals([{ slug: P.slug, color: C, qty: 2 }]);
  assert.equal(t.subtotal, P.price * 2);
  assert.equal(t.total, t.subtotal + t.shipping);
  assert.equal(formatPrice(14995), "Rs 14,995");
  assert.equal(discountPct({ price: 100 }), 0);
});

test("every collection and product is consistent", () => {
  assert.equal(getCollection("all")?.products.length, products.length);
  assert.equal(getCollection("missing"), undefined);
  for (const p of products) {
    assert.ok(p.colors.length > 0, p.slug);
    assert.ok(!p.compareAt || p.compareAt > p.price, p.slug);
  }
  assert.equal(new Set(products.map((p) => p.slug)).size, products.length);
});

test("checkout validation", () => {
  assert.equal(normalizePkMobile("+92 300-1234567"), "03001234567");
  assert.equal(normalizePkMobile("03001234567"), "03001234567");
  assert.equal(normalizePkMobile("0423456789"), null);
  const ok = { name: "Ali Khan", phone: "0300 1234567", email: "", city: "Lahore", address: "House 1, Street 2, DHA", notes: "", payment: "cod" as const };
  assert.deepEqual(validateCheckout(ok), {});
  assert.ok(validateCheckout({ ...ok, payment: "card" }).payment);
  assert.ok(validateCheckout({ ...ok, email: "bad@" }).email);
  assert.deepEqual(Object.keys(validateCheckout({ ...ok, name: "", address: "x" })), ["name", "address"]);
});
