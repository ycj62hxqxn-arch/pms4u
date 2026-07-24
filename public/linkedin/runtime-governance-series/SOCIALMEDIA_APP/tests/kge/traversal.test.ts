import test from "node:test";
import assert from "node:assert/strict";

import {
  findKnowledgePath,
  traverseKnowledgeGraph,
  type KnowledgeGraph,
} from "../../lib/kge";

const graph: KnowledgeGraph = {
  nodes: [
    {
      id: "claim-node",
      type: "CLAIM",
      label: "Authority claim",
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
    {
      id: "verification-node",
      type: "VERIFICATION",
      label: "Verification result",
      objectId: "verification-001",
      metadata: {},
    },
    {
      id: "verifier-node",
      type: "VERIFIER",
      label: "Human verifier",
      objectId: "verifier-001",
      metadata: {},
    },
  ],
  relations: [
    {
      id: "r1",
      type: "SUPPORTS",
      sourceNodeId: "evidence-node",
      targetNodeId: "claim-node",
      createdBy: "actor-001",
      createdAt: "2026-07-24T00:00:00Z",
      metadata: {},
    },
    {
      id: "r2",
      type: "VERIFIED_BY",
      sourceNodeId: "claim-node",
      targetNodeId: "verification-node",
      createdBy: "actor-001",
      createdAt: "2026-07-24T00:00:00Z",
      metadata: {},
    },
    {
      id: "r3",
      type: "VERIFIED_BY",
      sourceNodeId: "verification-node",
      targetNodeId: "verifier-node",
      createdBy: "actor-001",
      createdAt: "2026-07-24T00:00:00Z",
      metadata: {},
    },
  ],
};

test("traversal follows graph relations in both directions", () => {
  const result = traverseKnowledgeGraph(
    graph,
    "claim-node",
    {
      direction: "BOTH",
      maxDepth: 2,
    },
  );

  assert.ok(
    result.visitedNodeIds.includes("evidence-node"),
  );

  assert.ok(
    result.visitedNodeIds.includes("verification-node"),
  );
});

test("traversal respects maximum depth", () => {
  const result = traverseKnowledgeGraph(
    graph,
    "claim-node",
    {
      direction: "OUTBOUND",
      maxDepth: 1,
    },
  );

  assert.ok(
    !result.visitedNodeIds.includes("verifier-node"),
  );

  assert.equal(result.truncated, true);
});

test("traversal protects against relation cycles", () => {
  const cyclicGraph: KnowledgeGraph = {
    nodes: graph.nodes,
    relations: [
      ...graph.relations,
      {
        id: "r4",
        type: "RELATES_TO",
        sourceNodeId: "verifier-node",
        targetNodeId: "claim-node",
        createdBy: "actor-001",
        createdAt: "2026-07-24T00:00:00Z",
        metadata: {},
      },
    ],
  };

  const result = traverseKnowledgeGraph(
    cyclicGraph,
    "claim-node",
    {
      direction: "BOTH",
      maxDepth: 10,
    },
  );

  assert.equal(
    new Set(result.visitedNodeIds).size,
    result.visitedNodeIds.length,
  );
});

test("finds path between evidence and verifier", () => {
  const path = findKnowledgePath(
    graph,
    "evidence-node",
    "verifier-node",
    {
      direction: "BOTH",
      maxDepth: 4,
    },
  );

  assert.ok(path.length >= 3);
  assert.equal(path[0]?.node.id, "evidence-node");
  assert.equal(
    path[path.length - 1]?.node.id,
    "verifier-node",
  );
});

test("returns empty path when target is unreachable", () => {
  const path = findKnowledgePath(
    graph,
    "claim-node",
    "missing-node",
  );

  assert.deepEqual(path, []);
});
