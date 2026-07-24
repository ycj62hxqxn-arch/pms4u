import {
  lexiconConstitutionEntry,
  SemanticConstitutionRegistry,
  type SemanticConstitution,
  type SemanticConstitutionEntry,
} from "../constitution";

import {
  foundationalSemanticEntries,
} from "./foundational";

import {
  validateSemanticRegistryIntegrity,
} from "./integrity";

export const canonicalFoundationEntries:
  SemanticConstitutionEntry[] = [
    lexiconConstitutionEntry,
    ...foundationalSemanticEntries,
  ];

export function createCanonicalFoundationRegistry():
  SemanticConstitutionRegistry {
  const integrity =
    validateSemanticRegistryIntegrity(
      canonicalFoundationEntries,
    );

  if (!integrity.valid) {
    throw new Error(
      "Canonical semantic foundation failed integrity validation: " +
        integrity.issues
          .map((issue) => issue.message)
          .join(" | "),
    );
  }

  const registry =
    new SemanticConstitutionRegistry(
      "semantic-constitution-core-001",
      "المعجم اللساني المفاهيمي المعتمد",
      "1.1.0",
    );

  for (
    const entry of canonicalFoundationEntries
  ) {
    registry.register(entry);
  }

  return registry;
}

export function createCanonicalFoundationSnapshot(
  ratifiedAt?: string,
): SemanticConstitution {
  return createCanonicalFoundationRegistry()
    .snapshot(ratifiedAt);
}
