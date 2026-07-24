import type { ProvenanceRecord } from "./types";

const SHA256_PATTERN = /^[a-f0-9]{64}$/i;

export function validateProvenanceRecord(
  record: ProvenanceRecord,
): string[] {
  const errors: string[] = [];

  if (!record.id.trim()) {
    errors.push("Provenance record ID required.");
  }

  if (!record.objectId.trim()) {
    errors.push("Provenance object ID required.");
  }

  if (!record.actorId.trim()) {
    errors.push("Provenance actor ID required.");
  }

  if (record.version < 1 || !Number.isInteger(record.version)) {
    errors.push("Provenance version must be a positive integer.");
  }

  for (const [field, value] of [
    ["payloadHash", record.payloadHash],
    ["previousRecordHash", record.previousRecordHash],
    ["recordHash", record.recordHash],
  ] as const) {
    if (value && !SHA256_PATTERN.test(value)) {
      errors.push(`${field} must contain 64 hexadecimal characters.`);
    }
  }

  if (
    record.action === "DERIVED" &&
    record.parentObjectIds.length === 0
  ) {
    errors.push("Derived provenance requires at least one parent object.");
  }

  return errors;
}
