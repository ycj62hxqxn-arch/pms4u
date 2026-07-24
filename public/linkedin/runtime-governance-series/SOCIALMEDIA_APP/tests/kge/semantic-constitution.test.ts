import test from "node:test";
import assert from "node:assert/strict";

import {
  decideSemanticAdmission,
  lexiconConstitutionEntry,
  SemanticConstitutionRegistry,
  validateSemanticConstitutionEntry,
  type SemanticConstitutionEntry,
} from "../../lib/kge";

function cloneEntry():
  SemanticConstitutionEntry {
  return structuredClone(
    lexiconConstitutionEntry,
  );
}

test("ratified foundational entry is structurally valid", () => {
  const result =
    validateSemanticConstitutionEntry(
      lexiconConstitutionEntry,
    );

  assert.equal(result.valid, true);
  assert.deepEqual(result.issues, []);
});

test("entry without a definition is rejected", () => {
  const entry = cloneEntry();
  entry.definition = "";

  const result =
    validateSemanticConstitutionEntry(entry);

  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.field === "definition" &&
        issue.code === "REQUIRED",
    ),
  );
});

test("entry requires acceptance criteria", () => {
  const entry = cloneEntry();
  entry.acceptanceCriteria = [];

  const result =
    validateSemanticConstitutionEntry(entry);

  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code ===
        "MISSING_ACCEPTANCE_CRITERIA",
    ),
  );
});

test("entry requires rejection criteria", () => {
  const entry = cloneEntry();
  entry.rejectionCriteria = [];

  const result =
    validateSemanticConstitutionEntry(entry);

  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code ===
        "MISSING_REJECTION_CRITERIA",
    ),
  );
});

test("entry requires semantic boundaries", () => {
  const entry = cloneEntry();
  entry.boundaries = [];

  const result =
    validateSemanticConstitutionEntry(entry);

  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code === "MISSING_BOUNDARIES",
    ),
  );
});

test("draft entry is held from runtime admission", () => {
  const entry = cloneEntry();
  entry.governanceStatus = "DRAFT";

  const decision =
    decideSemanticAdmission(entry);

  assert.equal(decision.admitted, false);
  assert.equal(decision.status, "HELD");
});

test("ratified entry is admitted", () => {
  const decision =
    decideSemanticAdmission(
      lexiconConstitutionEntry,
    );

  assert.equal(decision.admitted, true);
  assert.equal(decision.status, "ADMITTED");
});

test("registry resolves the canonical Arabic term", () => {
  const registry =
    new SemanticConstitutionRegistry(
      "constitution-001",
      "المعجم اللساني المفاهيمي المعتمد",
      "1.0.0",
    );

  registry.register(
    lexiconConstitutionEntry,
  );

  const resolved = registry.resolve("المعجم");

  assert.equal(
    resolved?.id,
    "semantic-entry-almojam-001",
  );
});

test("registry resolves an approved alias", () => {
  const registry =
    new SemanticConstitutionRegistry(
      "constitution-001",
      "المعجم اللساني المفاهيمي المعتمد",
      "1.0.0",
    );

  registry.register(
    lexiconConstitutionEntry,
  );

  const resolved = registry.resolve(
    "المعجم اللساني المفاهيمي المعتمد",
  );

  assert.equal(
    resolved?.canonicalTerm,
    "المعجم",
  );
});

test("registry prevents duplicate governed terms", () => {
  const registry =
    new SemanticConstitutionRegistry(
      "constitution-001",
      "المعجم اللساني المفاهيمي المعتمد",
      "1.0.0",
    );

  registry.register(
    lexiconConstitutionEntry,
  );

  const duplicate = cloneEntry();
  duplicate.id = "semantic-entry-duplicate";

  assert.throws(
    () => registry.register(duplicate),
    /already assigned/,
  );
});

test("registry snapshot is deterministic", () => {
  const registry =
    new SemanticConstitutionRegistry(
      "constitution-001",
      "المعجم اللساني المفاهيمي المعتمد",
      "1.0.0",
    );

  registry.register(
    lexiconConstitutionEntry,
  );

  const snapshot = registry.snapshot(
    "2026-07-24T00:00:00Z",
  );

  assert.equal(snapshot.entries.length, 1);
  assert.equal(snapshot.version, "1.0.0");
  assert.equal(
    snapshot.entries[0]?.governanceStatus,
    "RATIFIED",
  );
});
