import test from "node:test";
import assert from "node:assert/strict";

import {
  validateClaim,
} from "../../lib/kge/claim";

import type {
  Claim,
} from "../../lib/kge/claim";

test("valid claim passes validation", () => {
  const claim: Claim = {
    id: "claim-001",
    conceptId: "concept-execution-governance",
    discussionId: "discussion-001",
    statement: "Execution Governance should precede execution.",
    type: "PRINCIPLE",
    authorId: "actor-001",
    evidenceIds: [],
    confidence: 0.95,
    verificationScore: 0.80,
    status: "VERIFIED",
    createdAt: "2026-07-24T00:00:00Z",
    updatedAt: "2026-07-24T00:00:00Z",
  };

  assert.deepEqual(validateClaim(claim), []);
});

test("empty statement fails", () => {
  const claim: Claim = {
    id: "claim-002",
    conceptId: "concept-001",
    discussionId: "discussion-001",
    statement: "",
    type: "FACT",
    authorId: "actor-001",
    evidenceIds: [],
    confidence: 0.5,
    verificationScore: 0.5,
    status: "PROPOSED",
    createdAt: "",
    updatedAt: "",
  };

  const errors = validateClaim(claim);

  assert.ok(errors.some(e => e.includes("Statement")));
});

test("confidence outside range fails", () => {
  const claim: Claim = {
    id: "claim-003",
    conceptId: "concept-001",
    discussionId: "discussion-001",
    statement: "Invalid confidence",
    type: "FACT",
    authorId: "actor-001",
    evidenceIds: [],
    confidence: 1.5,
    verificationScore: 0.4,
    status: "PROPOSED",
    createdAt: "",
    updatedAt: "",
  };

  const errors = validateClaim(claim);

  assert.ok(errors.some(e => e.includes("Confidence")));
});

test("verification score outside range fails", () => {
  const claim: Claim = {
    id: "claim-004",
    conceptId: "concept-001",
    discussionId: "discussion-001",
    statement: "Invalid verification",
    type: "FACT",
    authorId: "actor-001",
    evidenceIds: [],
    confidence: 0.7,
    verificationScore: -1,
    status: "PROPOSED",
    createdAt: "",
    updatedAt: "",
  };

  const errors = validateClaim(claim);

  assert.ok(errors.some(e => e.includes("Verification")));
});