import test from "node:test";
import assert from "node:assert/strict";

import { reasonAboutClaim } from "../../lib/kge";

test("reasoning supports a claim with stronger supporting evidence", () => {
  const result = reasonAboutClaim({
    claimId: "claim-001",
    supportingEvidenceCount: 3,
    contradictingEvidenceCount: 1,
    completedVerificationCount: 2,
    averageVerificationConfidence: 0.9,
  });

  assert.equal(result.decision, "SUPPORTED");
  assert.ok(result.score > 0.5);
});

test("reasoning contradicts a claim when opposing evidence dominates", () => {
  const result = reasonAboutClaim({
    claimId: "claim-001",
    supportingEvidenceCount: 1,
    contradictingEvidenceCount: 4,
    completedVerificationCount: 2,
    averageVerificationConfidence: 0.8,
  });

  assert.equal(result.decision, "CONTRADICTED");
});

test("reasoning returns insufficient evidence with no evidence", () => {
  const result = reasonAboutClaim({
    claimId: "claim-001",
    supportingEvidenceCount: 0,
    contradictingEvidenceCount: 0,
    completedVerificationCount: 0,
  });

  assert.equal(result.decision, "INSUFFICIENT_EVIDENCE");
});

test("reasoning returns contested when conflicts exist", () => {
  const result = reasonAboutClaim({
    claimId: "claim-001",
    supportingEvidenceCount: 3,
    contradictingEvidenceCount: 1,
    completedVerificationCount: 2,
    conflicts: [
      {
        id: "conflict-001",
        type: "VERIFICATION_DISAGREEMENT",
        severity: "HIGH",
        subjectId: "claim-001",
        relatedIds: ["v1", "v2"],
        explanation: "Opposing decisions.",
        detectedAt: "2026-07-24T00:00:00Z",
      },
    ],
  });

  assert.equal(result.decision, "CONTESTED");
  assert.deepEqual(result.conflictIds, ["conflict-001"]);
});
