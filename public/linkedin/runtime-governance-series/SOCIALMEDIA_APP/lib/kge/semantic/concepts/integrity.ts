import type {
  SemanticConstitutionEntry,
} from "../constitution";

export interface SemanticIntegrityIssue {
  code:
    | "DUPLICATE_ENTRY_ID"
    | "DUPLICATE_CANONICAL_TERM"
    | "UNKNOWN_RELATION_TARGET"
    | "UNKNOWN_BOUNDARY_TARGET"
    | "SELF_RELATION"
    | "EMPTY_REGISTRY";
  entryId?: string;
  referenceId?: string;
  message: string;
}

export interface SemanticIntegrityResult {
  valid: boolean;
  issues: SemanticIntegrityIssue[];
}

function normalize(value: string): string {
  return value
    .trim()
    .normalize("NFKC")
    .toLocaleLowerCase();
}

export function validateSemanticRegistryIntegrity(
  entries: SemanticConstitutionEntry[],
): SemanticIntegrityResult {
  const issues: SemanticIntegrityIssue[] = [];

  if (entries.length === 0) {
    return {
      valid: false,
      issues: [
        {
          code: "EMPTY_REGISTRY",
          message:
            "Semantic registry must contain at least one entry.",
        },
      ],
    };
  }

  const entryIds = new Set<string>();
  const canonicalTerms = new Map<string, string>();

  for (const entry of entries) {
    if (entryIds.has(entry.id)) {
      issues.push({
        code: "DUPLICATE_ENTRY_ID",
        entryId: entry.id,
        message:
          `Duplicate semantic entry ID: ${entry.id}`,
      });
    }

    entryIds.add(entry.id);

    const normalizedTerm = normalize(
      entry.canonicalTerm,
    );

    const existingEntryId =
      canonicalTerms.get(normalizedTerm);

    if (existingEntryId) {
      issues.push({
        code: "DUPLICATE_CANONICAL_TERM",
        entryId: entry.id,
        referenceId: existingEntryId,
        message:
          `Canonical term "${entry.canonicalTerm}" is assigned to multiple entries.`,
      });
    } else {
      canonicalTerms.set(
        normalizedTerm,
        entry.id,
      );
    }
  }

  for (const entry of entries) {
    for (const relation of entry.relations) {
      if (
        relation.targetEntryId === entry.id
      ) {
        issues.push({
          code: "SELF_RELATION",
          entryId: entry.id,
          referenceId: relation.id,
          message:
            `Entry ${entry.id} contains a self-relation.`,
        });
      }

      if (
        !entryIds.has(relation.targetEntryId)
      ) {
        issues.push({
          code: "UNKNOWN_RELATION_TARGET",
          entryId: entry.id,
          referenceId:
            relation.targetEntryId,
          message:
            `Relation ${relation.id} references unknown entry ${relation.targetEntryId}.`,
        });
      }
    }

    for (const boundary of entry.boundaries) {
      if (
        boundary.relatedEntryId &&
        !entryIds.has(boundary.relatedEntryId)
      ) {
        issues.push({
          code: "UNKNOWN_BOUNDARY_TARGET",
          entryId: entry.id,
          referenceId:
            boundary.relatedEntryId,
          message:
            `Boundary ${boundary.id} references unknown entry ${boundary.relatedEntryId}.`,
        });
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
