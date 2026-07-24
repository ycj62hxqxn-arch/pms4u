import test from "node:test";
import assert from "node:assert/strict";

import {
  validateKnowledgeGraph,
  validateKnowledgeRelation,
  type KnowledgeGraph,
  type KnowledgeRelation,
} from "../../lib/kge/graph";

function relation(
  overrides: Partial<KnowledgeRelation> = {},
): KnowledgeRelation {
  return {
    id: "relation-001",
    type: "SUPPORTS",
    sourceNodeId: "evidence-node",
    targetNodeId: "claim-node",
    createdBy: "actor-001",
    confidence: 0.9,
    createdAt: "2026-07-24T00:00:00Z",
    metadata: {},
    ...overrides,
  };
}

test("valid graph relation passes validation", () => {
  assert.deepEqual(validateKnowledgeRelation(relation()), []);
});

test("graph relation cannot reference itself", () => {
  const errors = validateKnowledgeRelation(
    relation({
      sourceNodeId: "node-001",
      targetNodeId: "node-001",
    }),
  );

  assert.ok(errors.some((error) => error.includes("itself")));
});

test("graph rejects relations with missing nodes", () => {
  const graph: KnowledgeGraph = {
    nodes: [
      {
        id: "claim-node",
        type: "CLAIM",
        label: "Claim",
        objectId: "claim-001",
        metadata: {},
      },
    ],
    relations: [relation()],
  };

  const errors = validateKnowledgeGraph(graph);

  assert.ok(errors.some((error) => error.includes("source node")));
});

test("complete knowledge graph passes validation", () => {
  const graph: KnowledgeGraph = {
    nodes: [
      {
        id: "evidence-node",
        type: "EVIDENCE",
        label: "Evidence",
        objectId: "evidence-001",
        metadata: {},
      },
      {
        id: "claim-node",
        type: "CLAIM",
        label: "Claim",
        objectId: "claim-001",
        metadata: {},
      },
    ],
    relations: [relation()],
  };

  assert.deepEqual(validateKnowledgeGraph(graph), []);
});
