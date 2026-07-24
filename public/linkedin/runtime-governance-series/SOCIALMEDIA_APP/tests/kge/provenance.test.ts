import test from "node:test";
import assert from "node:assert/strict";

import {
  validateProvenanceRecord,
  type ProvenanceRecord,
} from "../../lib/kge/provenance";

function provenance(
  overrides: Partial<ProvenanceRecord> = {},
): ProvenanceRecord {
  return {
    id: "provenance-001",
    objectId: "claim-001",
    objectType: "CLAIM",
    action: "CREATED",
    actorId: "actor-001",
    parentObjectIds: [],
    version: 1,
    timestamp: "2026-07-24T00:00:00Z",
    metadata: {},
    ...overrides,
  };
}

test("valid provenance passes validation", () => {
  assert.deepEqual(validateProvenanceRecord(provenance()), []);
});

test("derived provenance requires a parent", () => {
  const errors = validateProvenanceRecord(
    provenance({
      action: "DERIVED",
      parentObjectIds: [],
    }),
  );

  assert.ok(errors.some((error) => error.includes("parent")));
});

test("provenance version must be positive", () => {
  const errors = validateProvenanceRecord(provenance({ version: 0 }));

  assert.ok(errors.some((error) => error.includes("version")));
});
