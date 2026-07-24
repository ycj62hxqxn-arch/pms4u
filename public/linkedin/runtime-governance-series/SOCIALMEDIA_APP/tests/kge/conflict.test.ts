import test from "node:test";
import assert from "node:assert/strict";

import {
  detectRelationConflicts,
  detectVerificationConflicts,
  type KnowledgeGraph,
} from "../../lib/kge";

test("detects support and contradiction on same relation pair", () => {
  const graph: KnowledgeGraph = {
    nodes: [],
    relations: [
      {
        id: "r1",
        type: "SUPPORTS",
        sourceNodeId: "e1",
        targetNodeId: "c1",
        createdBy: "actor",
        createdAt: "2026-07-24T00:00:00Z",
        metadata: {},
      },
      {
        id: "r2",
        type: "CONTRADICTS",
        sourceNodeId: "e1",
        targetNodeId: "c1",
        createdBy: "actor",
        createdAt: "2026-07-24T00:00:00Z",
        metadata: {},
      },
    ],
  };

  const conflicts = detectRelationConflicts(
    graph,
    "2026-07-24T00:00:00Z",
  );

  assert.equal(conflicts.length, 1);
  assert.equal(conflicts[0]?.type, "RELATION_CONFLICT");
});

test("detects opposing verification results", () => {
  const conflicts = detectVerificationConflicts(
    [
      {
        verificationId: "v1",
        claimId: "c1",
        verifierId: "human-1",
        decision: "SUPPORTED",
        confidence: 0.9,
      },
      {
        verificationId: "v2",
        claimId: "c1",
        verifierId: "human-2",
        decision: "CONTRADICTED",
        confidence: 0.8,
      },
    ],
    "2026-07-24T00:00:00Z",
  );

  assert.equal(conflicts.length, 1);
  assert.equal(
    conflicts[0]?.type,
    "VERIFICATION_DISAGREEMENT",
  );
});
