import test from "node:test";
import assert from "node:assert/strict";

import {
  explainClaim,
  explainKnowledgePath,
  type KnowledgeGraph,
  type ReasoningResult,
} from "../../lib/kge";

const graph: KnowledgeGraph = {
  nodes: [
    {
      id: "claim-node",
      type: "CLAIM",
      label: "Execution requires authority",
      objectId: "claim-001",
      metadata: {},
    },
    {
      id: "evidence-1",
      type: "EVIDENCE",
      label: "Signed execution receipt",
      objectId: "evidence-001",
      metadata: {},
    },
    {
      id: "evidence-2",
      type: "EVIDENCE",
      label: "Conflicting operator log",
      objectId: "evidence-002",
      metadata: {},
    },
    {
      id: "verification-node",
      type: "VERIFICATION",
      label: "Governance verification",
      objectId: "verification-001",
      metadata: {},
    },
  ],
  relations: [
    {
      id: "support-relation",
      type: "SUPPORTS",
      sourceNodeId: "evidence-1",
      targetNodeId: "claim-node",
      createdBy: "actor-001",
      confidence: 0.95,
      createdAt: "2026-07-24T00:00:00Z",
      metadata: {},
    },
    {
      id: "contradiction-relation",
      type: "CONTRADICTS",
      sourceNodeId: "evidence-2",
      targetNodeId: "claim-node",
      createdBy: "actor-001",
      confidence: 0.4,
      createdAt: "2026-07-24T00:00:00Z",
      metadata: {},
    },
    {
      id: "verification-relation",
      type: "VERIFIED_BY",
      sourceNodeId: "claim-node",
      targetNodeId: "verification-node",
      createdBy: "actor-001",
      confidence: 0.9,
      createdAt: "2026-07-24T00:00:00Z",
      metadata: {},
    },
  ],
};

const reasoningResult: ReasoningResult = {
  claimId: "claim-001",
  decision: "SUPPORTED",
  score: 0.81,
  explanation:
    "Supporting evidence outweighs contradicting evidence.",
  conflictIds: [],
};

test("claim explanation identifies supporting evidence", () => {
  const explanation = explainClaim({
    claimNodeId: "claim-node",
    reasoningResult,
    graphNodes: graph.nodes,
    graphRelations: graph.relations,
  });

  assert.deepEqual(
    explanation.supportingEvidenceIds,
    ["evidence-001"],
  );

  assert.equal(explanation.decision, "SUPPORTED");
});

test("claim explanation identifies contradicting evidence", () => {
  const explanation = explainClaim({
    claimNodeId: "claim-node",
    reasoningResult,
    graphNodes: graph.nodes,
    graphRelations: graph.relations,
  });

  assert.deepEqual(
    explanation.contradictingEvidenceIds,
    ["evidence-002"],
  );
});

test("claim explanation identifies verification objects", () => {
  const explanation = explainClaim({
    claimNodeId: "claim-node",
    reasoningResult,
    graphNodes: graph.nodes,
    graphRelations: graph.relations,
  });

  assert.deepEqual(
    explanation.verificationIds,
    ["verification-001"],
  );
});

test("claim explanation produces deterministic summary", () => {
  const explanation = explainClaim({
    claimNodeId: "claim-node",
    reasoningResult,
    graphNodes: graph.nodes,
    graphRelations: graph.relations,
  });

  assert.ok(
    explanation.summary.includes("Claim claim-001 is supported"),
  );

  assert.ok(
    explanation.summary.includes("1 supporting evidence"),
  );
});

test("claim explanation includes governance conflicts", () => {
  const explanation = explainClaim({
    claimNodeId: "claim-node",
    reasoningResult: {
      ...reasoningResult,
      decision: "CONTESTED",
      conflictIds: ["conflict-001"],
    },
    graphNodes: graph.nodes,
    graphRelations: graph.relations,
  });

  assert.deepEqual(
    explanation.conflictIds,
    ["conflict-001"],
  );

  assert.ok(
    explanation.factors.some(
      (factor) => factor.type === "CONFLICT",
    ),
  );
});

test("knowledge path explanation returns auditable relation path", () => {
  const explanation = explainKnowledgePath(
    graph,
    "evidence-1",
    "verification-node",
  );

  assert.equal(explanation.found, true);
  assert.equal(
    explanation.nodeIds[0],
    "evidence-1",
  );

  assert.equal(
    explanation.nodeIds.at(-1),
    "verification-node",
  );
});

test("knowledge path explanation handles missing paths", () => {
  const explanation = explainKnowledgePath(
    graph,
    "evidence-1",
    "missing-node",
  );

  assert.equal(explanation.found, false);
  assert.deepEqual(explanation.nodeIds, []);
});
