import test from "node:test";
import assert from "node:assert/strict";

import {
  validateEvidence,
  type Evidence,
} from "../../lib/kge/evidence";

function evidence(overrides: Partial<Evidence> = {}): Evidence {
  return {
    id: "evidence-001",
    type: "DOCUMENT",
    title: "Governance specification",
    authorId: "actor-001",
    supportsClaimIds: ["claim-001"],
    contradictsClaimIds: [],
    metadata: {},
    status: "PROPOSED",
    createdAt: "2026-07-24T00:00:00Z",
    updatedAt: "2026-07-24T00:00:00Z",
    ...overrides,
  };
}

test("valid evidence passes validation", () => {
  assert.deepEqual(validateEvidence(evidence()), []);
});

test("evidence requires a title", () => {
  assert.ok(
    validateEvidence(evidence({ title: " " })).some((error) =>
      error.includes("title"),
    ),
  );
});

test("evidence must relate to a claim", () => {
  const errors = validateEvidence(
    evidence({
      supportsClaimIds: [],
      contradictsClaimIds: [],
    }),
  );

  assert.ok(errors.some((error) => error.includes("support or contradict")));
});

test("evidence cannot support and contradict the same claim", () => {
  const errors = validateEvidence(
    evidence({
      supportsClaimIds: ["claim-001"],
      contradictsClaimIds: ["claim-001"],
    }),
  );

  assert.ok(errors.some((error) => error.includes("same claim")));
});

test("invalid evidence hash is rejected", () => {
  const errors = validateEvidence(evidence({ sha256: "not-a-hash" }));

  assert.ok(errors.some((error) => error.includes("SHA256")));
});
