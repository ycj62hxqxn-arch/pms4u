import test from "node:test";
import assert from "node:assert/strict";

import {
  validateVerifier,
  type Verifier,
} from "../../lib/kge/verifier";

function verifier(overrides: Partial<Verifier> = {}): Verifier {
  return {
    id: "verifier-001",
    name: "Governance Reviewer",
    type: "HUMAN",
    status: "ACTIVE",
    authorityScope: ["EXECUTION_GOVERNANCE"],
    metadata: {},
    createdAt: "2026-07-24T00:00:00Z",
    updatedAt: "2026-07-24T00:00:00Z",
    ...overrides,
  };
}

test("valid verifier passes validation", () => {
  assert.deepEqual(validateVerifier(verifier()), []);
});

test("verifier requires authority scope", () => {
  const errors = validateVerifier(verifier({ authorityScope: [] }));

  assert.ok(errors.some((error) => error.includes("authority scope")));
});
