import type {
  ConstitutionalEvaluationRequest,
} from "./types";

export type ValidationResult =
  | {
      valid: true;
      value: ConstitutionalEvaluationRequest;
    }
  | {
      valid: false;
      error: string;
    };

export function validateEvaluationRequest(
  value: unknown,
): ValidationResult {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return {
      valid: false,
      error: "Request body must be an object.",
    };
  }

  const candidate =
    value as Partial<ConstitutionalEvaluationRequest>;

  if (
    typeof candidate.intent !== "string" ||
    candidate.intent.trim().length === 0
  ) {
    return {
      valid: false,
      error: "intent is required.",
    };
  }

  if (
    typeof candidate.authority !== "object" ||
    candidate.authority === null
  ) {
    return {
      valid: false,
      error: "authority is required.",
    };
  }

  if (
    typeof candidate.authority.actor !== "string" ||
    candidate.authority.actor.trim().length === 0
  ) {
    return {
      valid: false,
      error: "authority.actor is required.",
    };
  }

  if (
    !Array.isArray(candidate.authority.roles) ||
    !candidate.authority.roles.every(
      (role) => typeof role === "string",
    )
  ) {
    return {
      valid: false,
      error: "authority.roles must be an array of strings.",
    };
  }

  if (
    candidate.context !== undefined &&
    (
      typeof candidate.context !== "object" ||
      candidate.context === null ||
      Array.isArray(candidate.context)
    )
  ) {
    return {
      valid: false,
      error: "context must be an object.",
    };
  }

  if (
    candidate.evidence !== undefined &&
    !Array.isArray(candidate.evidence)
  ) {
    return {
      valid: false,
      error: "evidence must be an array.",
    };
  }

  return {
    valid: true,
    value: {
      intent: candidate.intent.trim(),
      authority: {
        actor: candidate.authority.actor.trim(),
        roles: candidate.authority.roles,
      },
      context: candidate.context ?? {},
      evidence: candidate.evidence ?? [],
    },
  };
}
