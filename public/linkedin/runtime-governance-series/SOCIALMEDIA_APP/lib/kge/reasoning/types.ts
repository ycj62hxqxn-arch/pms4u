import type { KnowledgeConflict } from "../conflict";

export type ReasoningDecision =
  | "SUPPORTED"
  | "CONTRADICTED"
  | "CONTESTED"
  | "INSUFFICIENT_EVIDENCE";

export interface ReasoningInput {
  claimId: string;
  supportingEvidenceCount: number;
  contradictingEvidenceCount: number;
  completedVerificationCount: number;
  averageVerificationConfidence?: number;
  conflicts?: KnowledgeConflict[];
}

export interface ReasoningResult {
  claimId: string;
  decision: ReasoningDecision;
  score: number;
  explanation: string;
  conflictIds: string[];
}
