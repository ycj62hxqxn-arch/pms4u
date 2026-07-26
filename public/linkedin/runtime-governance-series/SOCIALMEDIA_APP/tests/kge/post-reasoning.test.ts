import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPostReasoning,
} from "../../lib/kge/integration/post-reasoning";

test("post reasoning creates a claim graph", () => {
  const trace = buildPostReasoning({
    postId: "post-1",
    actorId: "actor-1",
    actorName: "Test Actor",
    text: "Runtime governance requires traceable constitutional evidence.",
    createdAt: "2026-07-26T12:00:00.000Z",
  });

  assert.equal(trace.decision, "INSUFFICIENT_EVIDENCE");
  assert.equal(trace.claimId, "post-claim:post-1");
  assert.ok(trace.nodeCount >= 3);
  assert.ok(trace.relationCount >= 2);
  assert.ok(trace.concepts.includes("runtime"));
  assert.equal(trace.evidenceCount, 0);
});

test("attached media becomes supporting evidence", () => {
  const trace = buildPostReasoning({
    postId: "post-2",
    actorId: "actor-1",
    actorName: "Test Actor",
    text: "Evidence-backed contribution",
    mediaUrl: "data:image/png;base64,abc",
    mediaType: "image",
    createdAt: "2026-07-26T12:00:00.000Z",
  });

  assert.equal(trace.decision, "SUPPORTED");
  assert.equal(trace.evidenceCount, 1);
  assert.ok(trace.graph.nodes.some((node) => node.type === "EVIDENCE"));
});
