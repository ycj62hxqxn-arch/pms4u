import type { Claim } from "./types";

export function validateClaim(
    claim: Claim,
): string[] {

    const errors: string[] = [];

    if (!claim.statement.trim())
        errors.push("Statement required.");

    if (claim.confidence < 0 || claim.confidence > 1)
        errors.push("Confidence must be between 0 and 1.");

    if (claim.verificationScore < 0 || claim.verificationScore > 1)
        errors.push("Verification score must be between 0 and 1.");

    return errors;
}