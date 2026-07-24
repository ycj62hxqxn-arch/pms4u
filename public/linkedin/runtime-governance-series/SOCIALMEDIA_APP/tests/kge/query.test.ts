import test from "node:test";
import assert from "node:assert/strict";

import {
  queryKnowledgeGraph,
  type KnowledgeGraph,
} from "../../lib/kge";

const graph: KnowledgeGraph = {
  nodes: [
    {
      id: "claim-node",
      type: "CLAIM",
      label: "Runtime authority claim",
      objectId: "claim-001",
      metadata: {},
    },
    {
      id: "evidence-node",
      type: "EVIDENCE",
      label: "Execution receipt",
      objectId: "evidence-001",
      metadata: {},
    },
  ],
  relations: [
    {
      id: "relation-001",
      type: "SUPPORTS",
      sourceNodeId: "evidence-node",
      targetNodeId: "claim-node",
      createdBy: "actor-001",
      createdAt: "2026-07-24T00:00:00Z",
      metadata: {},
    },
  ],
};

test("query returns nodes by type", () => {
  const result = queryKnowledgeGraph(graph, {
    nodeTypes: ["CLAIM"],
  });

  assert.equal(result.totalNodes, 1);
  assert.equal(result.nodes[0]?.objectId, "claim-001");
});

test("query supports case-insensitive label matching", () => {
  const result = queryKnowledgeGraph(graph, {
    labels: ["execution receipt"],
  });

  assert.equal(result.totalNodes, 1);
});

test("empty query returns the whole graph", () => {
  const result = queryKnowledgeGraph(graph, {});

  assert.equal(result.totalNodes, 2);
  assert.equal(result.totalRelations, 1);
});
