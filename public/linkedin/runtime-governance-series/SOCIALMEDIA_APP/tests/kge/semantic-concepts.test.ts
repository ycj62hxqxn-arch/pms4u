import test from "node:test";
import assert from "node:assert/strict";

import {
  canonicalFoundationEntries,
  createCanonicalFoundationRegistry,
  createCanonicalFoundationSnapshot,
  decideSemanticAdmission,
  validateSemanticRegistryIntegrity,
  type SemanticConstitutionEntry,
} from "../../lib/kge";

test("canonical foundation contains six ratified entries", () => {
  assert.equal(
    canonicalFoundationEntries.length,
    6,
  );

  assert.ok(
    canonicalFoundationEntries.every(
      (entry) =>
        entry.governanceStatus ===
        "RATIFIED",
    ),
  );
});

test("all foundational concepts pass admission", () => {
  for (
    const entry of canonicalFoundationEntries
  ) {
    const decision =
      decideSemanticAdmission(entry);

    assert.equal(
      decision.admitted,
      true,
      `${entry.canonicalTerm}: ${decision.reasons.join(" | ")}`,
    );
  }
});

test("canonical foundation has closed relation targets", () => {
  const result =
    validateSemanticRegistryIntegrity(
      canonicalFoundationEntries,
    );

  assert.equal(result.valid, true);
  assert.deepEqual(result.issues, []);
});

test("registry resolves every canonical term", () => {
  const registry =
    createCanonicalFoundationRegistry();

  for (
    const entry of canonicalFoundationEntries
  ) {
    const resolved = registry.resolve(
      entry.canonicalTerm,
    );

    assert.equal(
      resolved?.id,
      entry.id,
    );
  }
});

test("registry resolves foundational aliases", () => {
  const registry =
    createCanonicalFoundationRegistry();

  assert.equal(
    registry.resolve("اللسان المنطوق")?.id,
    "semantic-entry-allisan-001",
  );

  assert.equal(
    registry.resolve("الدلالة المعتبرة")?.id,
    "semantic-entry-almaana-001",
  );

  assert.equal(
    registry.resolve("اللهجة المحلية")?.id,
    "semantic-entry-allahja-001",
  );
});

test("meaning depends on tongue and spoken expression", () => {
  const meaning =
    canonicalFoundationEntries.find(
      (entry) =>
        entry.id ===
        "semantic-entry-almaana-001",
    );

  assert.ok(meaning);

  const targets = new Set(
    meaning.relations.map(
      (relation) =>
        relation.targetEntryId,
    ),
  );

  assert.ok(
    targets.has(
      "semantic-entry-allisan-001",
    ),
  );

  assert.ok(
    targets.has(
      "semantic-entry-almantuq-001",
    ),
  );
});

test("dialect remains subordinate to tongue", () => {
  const dialect =
    canonicalFoundationEntries.find(
      (entry) =>
        entry.id ===
        "semantic-entry-allahja-001",
    );

  assert.ok(dialect);

  assert.ok(
    dialect.relations.some(
      (relation) =>
        relation.kind === "PART_OF" &&
        relation.targetEntryId ===
          "semantic-entry-allisan-001",
    ),
  );
});

test("futile expression contrasts with governed meaning", () => {
  const futile =
    canonicalFoundationEntries.find(
      (entry) =>
        entry.id ===
        "semantic-entry-allaghw-001",
    );

  assert.ok(futile);

  assert.ok(
    futile.relations.some(
      (relation) =>
        relation.kind ===
          "CONTRASTS_WITH" &&
        relation.targetEntryId ===
          "semantic-entry-almaana-001",
    ),
  );
});

test("integrity validator rejects unknown relation targets", () => {
  const entries:
    SemanticConstitutionEntry[] =
      structuredClone(
        canonicalFoundationEntries,
      );

  entries[0]?.relations.push({
    id: "relation-unknown-001",
    kind: "DEPENDS_ON",
    targetEntryId:
      "semantic-entry-missing-001",
  });

  const result =
    validateSemanticRegistryIntegrity(
      entries,
    );

  assert.equal(result.valid, false);

  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code ===
        "UNKNOWN_RELATION_TARGET",
    ),
  );
});

test("integrity validator rejects duplicate entry IDs", () => {
  const entries:
    SemanticConstitutionEntry[] = [
      ...canonicalFoundationEntries,
      structuredClone(
        canonicalFoundationEntries[0]!,
      ),
    ];

  const result =
    validateSemanticRegistryIntegrity(
      entries,
    );

  assert.equal(result.valid, false);

  assert.ok(
    result.issues.some(
      (issue) =>
        issue.code ===
        "DUPLICATE_ENTRY_ID",
    ),
  );
});

test("foundation snapshot is deterministic", () => {
  const snapshot =
    createCanonicalFoundationSnapshot(
      "2026-07-24T00:00:00Z",
    );

  assert.equal(snapshot.version, "1.1.0");
  assert.equal(snapshot.entries.length, 6);

  assert.deepEqual(
    snapshot.entries.map(
      (entry) => entry.canonicalTerm,
    ),
    [
      "المعجم",
      "اللسان",
      "المنطوق",
      "المعنى",
      "اللغو",
      "اللهجة",
    ],
  );
});
