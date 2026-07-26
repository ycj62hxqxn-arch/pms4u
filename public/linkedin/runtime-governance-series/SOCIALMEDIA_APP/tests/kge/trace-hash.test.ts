import assert from "node:assert/strict";
import test from "node:test";
import { hashReasoningTrace } from "../../lib/kge/trace/hash";
test("trace hash is canonical", () => {
  assert.equal(hashReasoningTrace({ b: 2, a: { y: true, x: "v" } }), hashReasoningTrace({ a: { x: "v", y: true }, b: 2 }));
});
