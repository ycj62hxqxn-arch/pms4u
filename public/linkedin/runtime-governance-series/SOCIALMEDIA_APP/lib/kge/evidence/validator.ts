import type { Evidence } from "./types";

const SHA256_PATTERN = /^[a-f0-9]{64}$/i;

export function validateEvidence(evidence: Evidence): string[] {
  const errors: string[] = [];

  if (!evidence.id.trim()) {
    errors.push("Evidence ID required.");
  }

  if (!evidence.title.trim()) {
    errors.push("Evidence title required.");
  }

  if (!evidence.authorId.trim()) {
    errors.push("Evidence author required.");
  }

  if (
    evidence.supportsClaimIds.length === 0 &&
    evidence.contradictsClaimIds.length === 0
  ) {
    errors.push("Evidence must support or contradict at least one claim.");
  }

  const overlap = evidence.supportsClaimIds.filter((claimId) =>
    evidence.contradictsClaimIds.includes(claimId),
  );

  if (overlap.length > 0) {
    errors.push(
      "Evidence cannot support and contradict the same claim simultaneously.",
    );
  }

  if (evidence.sha256 && !SHA256_PATTERN.test(evidence.sha256)) {
    errors.push("Evidence SHA256 must contain 64 hexadecimal characters.");
  }

  return errors;
}
