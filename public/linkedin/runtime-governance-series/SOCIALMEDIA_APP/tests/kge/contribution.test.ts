import test from "node:test";
import assert from "node:assert/strict";

import {
  validateContribution,
} from "../../lib/kge/discussion";

import type {
  Actor,
} from "../../lib/kge/ontology";

import type {
  Contribution,
} from "../../lib/kge/discussion";

test("a governed contribution preserves attribution and source", () => {
  const contributor: Actor = {
    id: "actor-tyson-miller",
    type: "USER",
    displayName: "Tyson Miller",
    createdAt: "2026-07-24T00:00:00.000Z",
  };

  const contribution: Contribution = {
    id: "contribution-interpretation-governance",
    discussionId: "discussion-execution-governance-001",
    conceptId: "concept-execution-governance",
    contributor,
    contributionType: "EXTENDS",
    statement:
      "Governance should also address how interpretations are formed before execution.",
    source: {
      sourceType: "COMMENT",
      sourceId: "linkedin-comment-001",
      capturedAt: "2026-07-24T00:00:00.000Z",
    },
    confidence: 0.94,
    status: "UNDER_REVIEW",
    createdAt: "2026-07-24T00:00:00.000Z",
  };

  assert.deepEqual(
    validateContribution(contribution),
    [],
  );

  assert.equal(
    contribution.contributionType,
    "EXTENDS",
  );

  assert.equal(
    contribution.contributor.id,
    "actor-tyson-miller",
  );

  assert.equal(
    contribution.source.sourceType,
    "COMMENT",
  );
});

test("a non-question contribution requires a concept or claim", () => {
  const contribution: Contribution = {
    id: "contribution-invalid",
    discussionId: "discussion-001",
    contributor: {
      id: "actor-001",
      type: "USER",
      displayName: "Contributor",
      createdAt: "2026-07-24T00:00:00.000Z",
    },
    contributionType: "SUPPORTS",
    statement: "I support this.",
    source: {
      sourceType: "COMMENT",
      sourceId: "comment-001",
      capturedAt: "2026-07-24T00:00:00.000Z",
    },
    status: "PROPOSED",
    createdAt: "2026-07-24T00:00:00.000Z",
  };

  const errors = validateContribution(contribution);

  assert.equal(errors.length, 1);
  assert.match(
    errors[0],
    /reference a concept or claim/i,
  );
});
