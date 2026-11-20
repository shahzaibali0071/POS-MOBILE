import assert from "node:assert/strict";
import { test } from "node:test";
import { findMatch, modelCodes, tokens, type BrandProduct } from "./brand-match";

const bp = (title: string, handle = "", skus: string[] = [], image: string | null = `https://cdn/${title}.png`): BrandProduct => ({ title, handle, skus, image });

test("model codes are normalised the same way on both sides", () => {
  assert.deepEqual(modelCodes("Cord c-c (SC308)"), ["SC308"]);
  assert.deepEqual(modelCodes("R-9 Earphone"), ["R9"]);
  assert.deepEqual(modelCodes("Play Type - C (PL-50C)"), ["PL50C"]);
  assert.ok(tokens("SC-308 67W C to C").has("SC308"));
  assert.ok(!tokens("SC-308PD 27W").has("SC308"), "SC-308PD is a different product");
});

test("match only when exactly one catalog product carries the code", () => {
  const cat = [bp("SC-308 67W C to C"), bp("SC-308PD 27W"), bp("Cable", "x", ["CE-421"]), bp("A SC-1"), bp("B SC-1"), bp("SC-9 no photo", "", [], null)];
  assert.equal(findMatch(["SC308"], cat)?.title, "SC-308 67W C to C");
  assert.equal(findMatch(["CE421"], cat)?.title, "Cable");          // SKU match
  assert.equal(findMatch(["SC1"], cat), null);                       // ambiguous
  assert.equal(findMatch(["SC9"], cat), null);                       // no photo
  assert.equal(findMatch(["ZZ1"], cat), null);
});
