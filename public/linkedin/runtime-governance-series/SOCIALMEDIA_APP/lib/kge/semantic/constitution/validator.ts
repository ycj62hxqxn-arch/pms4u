import type {
  SemanticConstitutionEntry,
  SemanticValidationIssue,
  SemanticValidationResult,
} from "./types";

const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;
const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

function pushRequiredIssue(
  issues: SemanticValidationIssue[],
  field: string,
  value: string | undefined,
): void {
  if (!value?.trim()) {
    issues.push({
      field,
      code: "REQUIRED",
      message: `${field} is required.`,
    });
  }
}

function hasDuplicateNormalizedValues(values: string[]): boolean {
  const normalized = values.map((value) =>
    value.trim().toLocaleLowerCase(),
  );

  return new Set(normalized).size !== normalized.length;
}

export function validateSemanticConstitutionEntry(
  entry: SemanticConstitutionEntry,
): SemanticValidationResult {
  const issues: SemanticValidationIssue[] = [];

  pushRequiredIssue(issues, "id", entry.id);
  pushRequiredIssue(
    issues,
    "canonicalTerm",
    entry.canonicalTerm,
  );
  pushRequiredIssue(issues, "definition", entry.definition);
  pushRequiredIssue(issues, "tongue", entry.tongue);
  pushRequiredIssue(issues, "version", entry.version);
  pushRequiredIssue(
    issues,
    "provenance.sourceId",
    entry.provenance.sourceId,
  );
  pushRequiredIssue(
    issues,
    "provenance.author",
    entry.provenance.author,
  );

  if (
    entry.version &&
    !VERSION_PATTERN.test(entry.version)
  ) {
    issues.push({
      field: "version",
      code: "INVALID_VERSION",
      message:
        "Version must use semantic versioning, for example 1.0.0.",
    });
  }

  if (
    entry.createdAt &&
    !ISO_DATE_PATTERN.test(entry.createdAt)
  ) {
    issues.push({
      field: "createdAt",
      code: "INVALID_TIMESTAMP",
      message:
        "createdAt must be an ISO-8601 UTC timestamp.",
    });
  }

  if (
    entry.provenance.recordedAt &&
    !ISO_DATE_PATTERN.test(entry.provenance.recordedAt)
  ) {
    issues.push({
      field: "provenance.recordedAt",
      code: "INVALID_TIMESTAMP",
      message:
        "provenance.recordedAt must be an ISO-8601 UTC timestamp.",
    });
  }

  if (entry.acceptanceCriteria.length === 0) {
    issues.push({
      field: "acceptanceCriteria",
      code: "MISSING_ACCEPTANCE_CRITERIA",
      message:
        "A governed semantic entry requires at least one acceptance criterion.",
    });
  }

  if (entry.rejectionCriteria.length === 0) {
    issues.push({
      field: "rejectionCriteria",
      code: "MISSING_REJECTION_CRITERIA",
      message:
        "A governed semantic entry requires at least one rejection criterion.",
    });
  }

  if (entry.boundaries.length === 0) {
    issues.push({
      field: "boundaries",
      code: "MISSING_BOUNDARIES",
      message:
        "A governed semantic entry requires at least one semantic boundary.",
    });
  }

  if (
    entry.governanceStatus === "RATIFIED" &&
    entry.provenance.sourceType === "AUTHORIAL_ENTRY" &&
    !entry.provenance.sourceLocation
  ) {
    issues.push({
      field: "provenance.sourceLocation",
      code: "RATIFIED_SOURCE_LOCATION_REQUIRED",
      message:
        "A ratified authorial entry requires a source location.",
    });
  }

  if (hasDuplicateNormalizedValues(entry.aliases)) {
    issues.push({
      field: "aliases",
      code: "DUPLICATE_ALIAS",
      message:
        "Aliases must be unique after normalization.",
    });
  }

  const relationIds = entry.relations.map(
    (relation) => relation.id,
  );

  if (new Set(relationIds).size !== relationIds.length) {
    issues.push({
      field: "relations",
      code: "DUPLICATE_RELATION_ID",
      message: "Semantic relation IDs must be unique.",
    });
  }

  const boundaryIds = entry.boundaries.map(
    (boundary) => boundary.id,
  );

  if (new Set(boundaryIds).size !== boundaryIds.length) {
    issues.push({
      field: "boundaries",
      code: "DUPLICATE_BOUNDARY_ID",
      message: "Semantic boundary IDs must be unique.",
    });
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
