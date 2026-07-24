import type {
  SemanticAdmissionDecision,
  SemanticConstitutionEntry,
} from "./types";

import {
  validateSemanticConstitutionEntry,
} from "./validator";

export function decideSemanticAdmission(
  entry: SemanticConstitutionEntry,
): SemanticAdmissionDecision {
  const validation =
    validateSemanticConstitutionEntry(entry);

  if (!validation.valid) {
    return {
      admitted: false,
      entryId: entry.id,
      status: "REJECTED",
      reasons: validation.issues.map(
        (issue) => `${issue.code}: ${issue.message}`,
      ),
    };
  }

  if (
    entry.governanceStatus === "DRAFT" ||
    entry.governanceStatus === "PROPOSED"
  ) {
    return {
      admitted: false,
      entryId: entry.id,
      status: "HELD",
      reasons: [
        `Entry governance status is ${entry.governanceStatus}.`,
        "Only ratified entries may govern runtime meaning.",
      ],
    };
  }

  if (
    entry.governanceStatus === "REJECTED" ||
    entry.governanceStatus === "SUPERSEDED" ||
    entry.governanceStatus === "LEGACY"
  ) {
    return {
      admitted: false,
      entryId: entry.id,
      status: "REJECTED",
      reasons: [
        `Entry governance status is ${entry.governanceStatus}.`,
      ],
    };
  }

  return {
    admitted: true,
    entryId: entry.id,
    status: "ADMITTED",
    reasons: [
      "Entry passed structural validation.",
      "Entry is ratified for governed semantic use.",
    ],
  };
}
