import type { Verifier } from "./types";

export function validateVerifier(verifier: Verifier): string[] {
  const errors: string[] = [];

  if (!verifier.id.trim()) {
    errors.push("Verifier ID required.");
  }

  if (!verifier.name.trim()) {
    errors.push("Verifier name required.");
  }

  if (verifier.authorityScope.length === 0) {
    errors.push("Verifier requires at least one authority scope.");
  }

  if (verifier.authorityScope.some((scope) => !scope.trim())) {
    errors.push("Verifier authority scope cannot contain empty values.");
  }

  return errors;
}
