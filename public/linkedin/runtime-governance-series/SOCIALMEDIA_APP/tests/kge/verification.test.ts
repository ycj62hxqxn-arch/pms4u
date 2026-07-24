import test from "node:test";
import assert from "node:assert/strict";

import {
  validateVerificationResult,
  type VerificationResult,
} from "../../lib/kge/verification";

function verification(
  overrides: Partial<VerificationResult> = {},
): VerificationResult {
  return {
    id: "verification-001",
    claimId: "claim-001",
    evidenceIds: ["evidence-001"],
    verifierId: "verifier-001",
    decision: "SUPPORTED",
    confidence: 0.91,
    rationale: "Evidence directly supports the claim.",
    status: "COMPLETED",
    createdAt: "2026-07-24T00:00:00Z",
    ...overrides,
  };
}

test("valid verification passes validation", () => {
  assert.deepEqual(validateVerificationResult(verification()), []);
});

test("verification requires evidence", () => {
  const errors = validateVerificationResult(
    verification({ evidenceIds: [] }),
  );

  assert.ok(errors.some((error) => error.includes("evidence")));
});

test("verification confidence must be bounded", () => {
  const errors = validateVerificationResult(
    verification({ confidence: 1.5 }),
  );

  assert.ok(errors.some((error) => error.includes("confidence")));
});

test("verification requires rationale", () => {
  const errors = validateVerificationResult(
    verification({ rationale: " " }),
  );

  assert.ok(errors.some((error) => error.includes("rationale")));
});
