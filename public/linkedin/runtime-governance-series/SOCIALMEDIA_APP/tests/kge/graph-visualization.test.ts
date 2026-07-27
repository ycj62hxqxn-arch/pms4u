import assert from "node:assert/strict";
import test from "node:test";
import {
  buildDeterministicLayout,
  findShortestKnowledgePath,
  graphToGraphML,
  graphToMermaid,
} from "../../lib/kge/visualization";

const graph = {
  nodes: [
    { id: "claim", type: "CLAIM", label: "Claim" },
    { id: "evidence", type: "EVIDENCE", label: "Evidence" },
    { id: "verifier", type: "VERIFIER", label: "Verifier" },
  ],
  relations: [
    { id: "r1", type: "SUPPORTS", sourceNodeId: "evidence", targetNodeId: "claim", confidence: 0.9 },
    { id: "r2", type: "VERIFIED_BY", sourceNodeId: "evidence", targetNodeId: "verifier", confidence: 0.8 },
  ],
};

test("graph layout is deterministic", () => {
  assert.deepEqual(buildDeterministicLayout(graph), buildDeterministicLayout(graph));
});

test("path finder returns relation path", () => {
  const path = findShortestKnowledgePath(graph, "claim", "verifier");
  assert.deepEqual(path?.nodeIds, ["claim", "evidence", "verifier"]);
  assert.deepEqual(path?.relationIds, ["r1", "r2"]);
});

test("exports contain graph structure", () => {
  assert.match(graphToMermaid(graph), /SUPPORTS/);
  assert.match(graphToGraphML(graph), /<graphml/);
});
