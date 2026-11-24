import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanVariant, isImportableUrl, ownPhotoPath, sniffImage } from "./upload-rules";
import { layout, levels, toneTable } from "./photo-edit";

const bytes = (...b: number[]) => new Uint8Array([...b, ...new Array(16).fill(0)]);

test("sniffImage trusts magic bytes, not names", () => {
  assert.equal(sniffImage(bytes(0xff, 0xd8, 0xff))?.type, "image/jpeg");
  assert.equal(sniffImage(bytes(0x89, 0x50, 0x4e, 0x47))?.ext, "png");
  const webp = new TextEncoder().encode("RIFF\0\0\0\0WEBPVP8 ");
  assert.equal(sniffImage(webp)?.type, "image/webp");
  assert.equal(sniffImage(new TextEncoder().encode("<html><script>alert(1)</script>")), null);
  assert.equal(sniffImage(new Uint8Array(3)), null);
});

test("photo path ownership checks", () => {
  assert.equal(ownPhotoPath("/api/photos/products/12/1-main-x.webp", "products/"), "products/12/1-main-x.webp");
  assert.equal(ownPhotoPath("products/12/1-main-x.webp", "products/"), "products/12/1-main-x.webp");
  assert.equal(ownPhotoPath("/api/photos/drafts/12/1-ai.png", "products/"), null);
  assert.equal(ownPhotoPath("products/12/../orders/x.json", "products/"), null);
  assert.equal(ownPhotoPath("products/abc/x.webp", "products/"), null);
  assert.equal(ownPhotoPath("orders/123.json", "products/"), null);
  assert.equal(ownPhotoPath(undefined, "drafts/"), null);
});

test("import URL rules", () => {
  assert.ok(isImportableUrl("https://cdn.example.com/a.jpg"));
  for (const bad of ["http://x.com/a.jpg", "https://localhost/a", "https://127.0.0.1/a", "https://[::1]/a", "ftp://x", "nope"]) {
    assert.equal(isImportableUrl(bad), false, bad);
  }
  assert.equal(cleanVariant("Close Up!!"), "close-up");
  assert.equal(cleanVariant(""), "photo");
});

test("layout: cover fills, contain fits with margin, pan clamps", () => {
  const cover = layout(2000, 1000, 0, 1000, 1000, "cover", 1, 0, 0);
  assert.equal(cover.scale, 1);
  assert.equal(cover.maxX, 500);
  assert.equal(layout(2000, 1000, 0, 1000, 1000, "cover", 1, 5, 0).cx, 1000);
  const rotated = layout(2000, 1000, 90, 1000, 1000, "cover", 1, 0, 0);
  assert.equal(rotated.maxY, 500);
  const contain = layout(2000, 1000, 0, 1000, 1000, "contain", 1, 0, 0);
  assert.ok(Math.abs(contain.scale - 0.43) < 1e-9);
  assert.equal(contain.maxX, 0);
});

test("tone: identity, stretch, flat images untouched", () => {
  const id = toneTable(0, 255, 1, 1);
  assert.equal(id[0], 0);
  assert.equal(id[200], 200);
  const stretch = toneTable(50, 200, 1, 1);
  assert.equal(stretch[50], 0);
  assert.equal(stretch[200], 255);
  const flat = new Uint8ClampedArray(4 * 400).fill(120);
  assert.deepEqual(levels(flat), { lo: 0, hi: 255 });
});
