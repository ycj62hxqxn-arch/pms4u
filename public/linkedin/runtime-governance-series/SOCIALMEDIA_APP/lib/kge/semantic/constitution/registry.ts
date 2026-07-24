import type {
  SemanticConstitution,
  SemanticConstitutionEntry,
} from "./types";

import {
  decideSemanticAdmission,
} from "./admission";

function normalizeTerm(value: string): string {
  return value
    .trim()
    .normalize("NFKC")
    .toLocaleLowerCase();
}

export class SemanticConstitutionRegistry {
  private readonly entries =
    new Map<string, SemanticConstitutionEntry>();

  private readonly termIndex =
    new Map<string, string>();

  constructor(
    private readonly constitutionId: string,
    private readonly title: string,
    private readonly version: string,
  ) {}

  register(entry: SemanticConstitutionEntry): void {
    const decision = decideSemanticAdmission(entry);

    if (!decision.admitted) {
      throw new Error(
        `Semantic entry ${entry.id} was not admitted: ` +
          decision.reasons.join(" | "),
      );
    }

    if (this.entries.has(entry.id)) {
      throw new Error(
        `Semantic entry ID already exists: ${entry.id}`,
      );
    }

    const indexedTerms = [
      entry.canonicalTerm,
      ...entry.aliases,
    ];

    for (const term of indexedTerms) {
      const normalized = normalizeTerm(term);
      const existingEntryId =
        this.termIndex.get(normalized);

      if (existingEntryId) {
        throw new Error(
          `Semantic term "${term}" is already assigned to ${existingEntryId}.`,
        );
      }
    }

    this.entries.set(entry.id, entry);

    for (const term of indexedTerms) {
      this.termIndex.set(
        normalizeTerm(term),
        entry.id,
      );
    }
  }

  getById(
    entryId: string,
  ): SemanticConstitutionEntry | undefined {
    return this.entries.get(entryId);
  }

  resolve(
    term: string,
  ): SemanticConstitutionEntry | undefined {
    const entryId = this.termIndex.get(
      normalizeTerm(term),
    );

    return entryId
      ? this.entries.get(entryId)
      : undefined;
  }

  list(): SemanticConstitutionEntry[] {
    return [...this.entries.values()];
  }

  snapshot(ratifiedAt?: string): SemanticConstitution {
    return {
      id: this.constitutionId,
      title: this.title,
      version: this.version,
      entries: this.list(),
      ratifiedAt,
    };
  }
}
