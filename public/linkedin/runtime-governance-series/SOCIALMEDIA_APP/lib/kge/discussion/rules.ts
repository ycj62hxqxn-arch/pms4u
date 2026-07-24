import type {
  Contribution,
  ContributionType,
} from "./types";

export const CONTRIBUTION_TYPES: readonly ContributionType[] = [
  "ORIGINATES",
  "SUPPORTS",
  "EXTENDS",
  "REFINES",
  "CHALLENGES",
  "QUESTIONS",
  "CONTRADICTS",
  "EVIDENCES",
  "IMPLEMENTS",
  "VERIFIES",
  "MERGES",
  "DEPRECATES",
] as const;

export function isContributionType(
  value: string,
): value is ContributionType {
  return CONTRIBUTION_TYPES.includes(
    value as ContributionType,
  );
}

export function validateContribution(
  contribution: Contribution,
): string[] {
  const errors: string[] = [];

  if (!contribution.id.trim()) {
    errors.push("Contribution ID is required.");
  }

  if (!contribution.discussionId.trim()) {
    errors.push("Discussion ID is required.");
  }

  if (!contribution.statement.trim()) {
    errors.push("Contribution statement is required.");
  }

  if (
    contribution.confidence !== undefined &&
    (
      contribution.confidence < 0 ||
      contribution.confidence > 1
    )
  ) {
    errors.push(
      "Contribution confidence must be between 0 and 1.",
    );
  }

  if (
    contribution.contributionType !== "QUESTIONS" &&
    !contribution.conceptId &&
    !contribution.claimId
  ) {
    errors.push(
      "A non-question contribution must reference a concept or claim.",
    );
  }

  return errors;
}
