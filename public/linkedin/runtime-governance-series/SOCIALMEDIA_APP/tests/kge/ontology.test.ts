import test from "node:test";
import assert from "node:assert/strict";

import type {
  Actor,
  Concept,
} from "../../lib/kge/ontology/entities";

test("a concept preserves its originator attribution", () => {
  const actor: Actor = {
    id: "actor-alaa-atia",
    type: "USER",
    displayName: "Alaa Atia",
    createdAt: "2026-07-24T00:00:00.000Z",
  };

  const concept: Concept = {
    id: "concept-execution-governance",
    slug: "execution-governance",
    name: "Execution Governance",
    definition:
      "Governance applied to authority, admissibility and execution before consequence.",
    originatorId: actor.id,
    originatedAt: "2026-01-01T00:00:00.000Z",
    parentConceptIds: [],
    relatedConceptIds: ["concept-runtime-governance"],
    currentVersion: 1,
    status: "VERIFIED",
    createdAt: "2026-07-24T00:00:00.000Z",
    updatedAt: "2026-07-24T00:00:00.000Z",
  };

  assert.equal(concept.originatorId, actor.id);
  assert.equal(concept.status, "VERIFIED");
  assert.equal(concept.currentVersion, 1);
});
