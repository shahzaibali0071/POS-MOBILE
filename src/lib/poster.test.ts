import assert from "node:assert/strict";
import { test } from "node:test";
import { alphaMask, backgroundMask, dropSpecks, fitSize, productBox, wrap } from "./poster";

/** 10x10 white image with a dark 4x4 square at (3,3) and a white "hole" pixel inside it. */
function sample() {
  const w = 10, h = 10, px = new Uint8ClampedArray(w * h * 4).fill(255);
  for (let y = 3; y < 7; y++) for (let x = 3; x < 7; x++) px.set([20, 20, 20, 255], (y * w + x) * 4);
  px.set([255, 255, 255, 255], (4 * w + 4) * 4); // tiny enclosed white stays (part of the product)
  return { px, w, h };
}

test("background mask removes only border-connected background", () => {
  const { px, w, h } = sample();
  const mask = backgroundMask(px, w, h, 30);
  assert.equal(mask[0], 1);
  assert.equal(mask[3 * w + 3], 0);
  assert.equal(mask[4 * w + 4], 0, "white inside the product is kept");
  assert.deepEqual(productBox(mask, w, h), { x: 3, y: 3, w: 4, h: 4 });
  assert.equal(productBox(new Uint8Array(4).fill(1), 2, 2), null);
});

test("wrap and fit text", () => {
  const measure = (s: string) => s.length * 10;
  assert.deepEqual(wrap("fast charging safe and cool", 140, measure, 3), ["fast charging", "safe and cool"]);
  assert.deepEqual(wrap("one two three four five six", 90, measure, 2), ["one two", "three..."]);
  assert.deepEqual(wrap("supercalifragilistic", 50, measure, 2), ["supercalifragilistic"]);
  assert.equal(fitSize("G601", 400, 40, 190, (s, size) => s.length * size * 0.6), 166);
  assert.equal(fitSize("a very long headline", 100, 40, 190, (s, size) => s.length * size), 40);
});

test("specks are dropped, the product stays", () => {
  const w = 60, h = 60, mask = new Uint8Array(w * h).fill(1);
  for (let y = 10; y < 50; y++) for (let x = 10; x < 50; x++) mask[y * w + x] = 0; // product 40x40
  mask[2 * w + 2] = 0; // 1px speck
  dropSpecks(mask, w, h);
  assert.equal(mask[2 * w + 2], 1);
  assert.equal(mask[20 * w + 20], 0);
});

test("large enclosed background gaps are removed", () => {
  const w = 40, h = 40, px = new Uint8ClampedArray(w * h * 4).fill(255);
  // dark ring with a 20x20 white gap inside (like a headband)
  for (let y = 5; y < 35; y++) for (let x = 5; x < 35; x++) {
    const inner = x >= 10 && x < 30 && y >= 10 && y < 30;
    if (!inner) px.set([20, 20, 20, 255], (y * w + x) * 4);
  }
  const mask = backgroundMask(px, w, h, 30);
  assert.equal(mask[20 * w + 20], 1, "gap inside the ring is background");
  assert.equal(mask[7 * w + 7], 0, "ring is product");
});

test("transparent PNGs use their alpha channel, opaque photos do not", () => {
  const w = 20, h = 20, px = new Uint8ClampedArray(w * h * 4); // fully transparent black
  for (let y = 5; y < 15; y++) for (let x = 5; x < 15; x++) px.set([15, 15, 15, 255], (y * w + x) * 4); // dark product
  const mask = alphaMask(px)!;
  assert.equal(mask[0], 1);
  assert.equal(mask[10 * w + 10], 0, "dark product survives");
  assert.equal(alphaMask(new Uint8ClampedArray(16).fill(255)), null);
});
