import type { VerificationResult } from "./types";

export function validateVerificationResult(
  result: VerificationResult,
): string[] {
  const errors: string[] = [];

  if (!result.id.trim()) {
    errors.push("Verification result ID required.");
  }

  if (!result.claimId.trim()) {
    errors.push("Verification claim ID required.");
  }

  if (!result.verifierId.trim()) {
    errors.push("Verification verifier ID required.");
  }

  if (result.evidenceIds.length === 0) {
    errors.push("Verification requires at least one evidence object.");
  }

  if (result.confidence < 0 || result.confidence > 1) {
    errors.push("Verification confidence must be between 0 and 1.");
  }

  if (!result.rationale.trim()) {
    errors.push("Verification rationale required.");
  }

  return errors;
}
