import assert from "node:assert/strict";
import { test } from "node:test";
import { products, shippingFor } from "./catalog";
import { buildOrder, keyMatches, newOrderId } from "./orders";

const P = products[0];
const form = { name: "Ali Khan", phone: "+92 300 1234567", email: "", city: "Islamabad", address: "House 1, Street 2, G-9/1", notes: "", payment: "cod" };

test("order: priced from catalog, not from the client", () => {
  const r = buildOrder({ form, lines: [{ slug: P.slug, color: P.colors[0].name, qty: 2, price: 1 }] }, "VX-TEST0001", new Date(0));
  assert.ok("order" in r);
  const o = r.order;
  assert.equal(o.lines[0].price, P.price);
  assert.equal(o.subtotal, P.price * 2);
  assert.equal(o.shipping, shippingFor(P.price * 2));
  assert.equal(o.total, o.subtotal + o.shipping);
  assert.equal(o.customer.phone, "03001234567");
  assert.equal(o.paymentLabel, "Cash on Delivery");
  assert.equal(o.createdAt, "1970-01-01T00:00:00.000Z");
});

test("order: rejects empty cart, bad fields, card, junk body", () => {
  const r = buildOrder({ form: { ...form, phone: "123", payment: "card" }, lines: [{ slug: "nope", color: "x", qty: 1 }] }, "id", new Date());
  assert.ok("errors" in r);
  assert.ok(r.errors.phone && r.errors.payment && r.errors.lines);
  assert.ok("errors" in buildOrder(null, "id", new Date()));
  assert.ok("errors" in buildOrder({ form: { name: 5 }, lines: "x" }, "id", new Date()));
});

test("order: long fields are clipped", () => {
  const r = buildOrder({ form: { ...form, notes: "x".repeat(5000) }, lines: [{ slug: P.slug, color: P.colors[0].name, qty: 1 }] }, "id", new Date());
  assert.ok("order" in r && r.order.customer.notes.length === 300);
});

test("order id and key check", () => {
  assert.match(newOrderId(), /^VX-[A-HJ-NP-Z2-9]{8}$/);
  assert.notEqual(newOrderId(), newOrderId());
  assert.ok(keyMatches("abc", "abc"));
  assert.ok(!keyMatches("abd", "abc") && !keyMatches("ab", "abc") && !keyMatches("abcd", "abc"));
  assert.ok(!keyMatches(null, "abc") && !keyMatches("abc", undefined) && !keyMatches("", ""));
});

test("catalog comes from the POS: real prices, no invented ratings, POS id on order lines", () => {
  assert.ok(products.length > 100);
  assert.ok(products.every((p) => p.rating === undefined && p.compareAt === undefined && p.colors.length === 1));
  assert.ok(products.every((p) => !/\bcopy\b/i.test(p.name)), "replicas must not be listed");
  assert.equal(new Set(products.map((p) => p.slug)).size, products.length, "slugs unique");
  const r = buildOrder({ form, lines: [{ slug: P.slug, color: P.colors[0].name, qty: 1 }] }, "VX-T", new Date());
  assert.ok("order" in r && r.order.lines[0].posId === P.posId);
});
