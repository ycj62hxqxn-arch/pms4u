import type {
  ReasoningInput,
  ReasoningResult,
} from "./types";

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function reasonAboutClaim(
  input: ReasoningInput,
): ReasoningResult {
  const conflicts = input.conflicts ?? [];
  const conflictIds = conflicts.map((conflict) => conflict.id);

  if (conflicts.length > 0) {
    return {
      claimId: input.claimId,
      decision: "CONTESTED",
      score: 0.5,
      explanation:
        "The claim remains contested because governance conflicts were detected.",
      conflictIds,
    };
  }

  if (
    input.supportingEvidenceCount === 0 &&
    input.contradictingEvidenceCount === 0
  ) {
    return {
      claimId: input.claimId,
      decision: "INSUFFICIENT_EVIDENCE",
      score: 0,
      explanation:
        "No supporting or contradicting evidence is attached to the claim.",
      conflictIds,
    };
  }

  const totalEvidence =
    input.supportingEvidenceCount +
    input.contradictingEvidenceCount;

  const evidenceBalance =
    (input.supportingEvidenceCount -
      input.contradictingEvidenceCount) /
    totalEvidence;

  const confidence =
    input.averageVerificationConfidence ??
    (input.completedVerificationCount > 0 ? 0.5 : 0);

  const score = clamp((evidenceBalance + 1) / 2 * confidence);

  if (
    input.supportingEvidenceCount >
    input.contradictingEvidenceCount
  ) {
    return {
      claimId: input.claimId,
      decision: "SUPPORTED",
      score,
      explanation:
        "Supporting evidence outweighs contradicting evidence.",
      conflictIds,
    };
  }

  if (
    input.contradictingEvidenceCount >
    input.supportingEvidenceCount
  ) {
    return {
      claimId: input.claimId,
      decision: "CONTRADICTED",
      score: clamp(1 - score),
      explanation:
        "Contradicting evidence outweighs supporting evidence.",
      conflictIds,
    };
  }

  return {
    claimId: input.claimId,
    decision: "CONTESTED",
    score: 0.5,
    explanation:
      "Supporting and contradicting evidence are balanced.",
    conflictIds,
  };
}
