export type VerificationDecision =
  | "SUPPORTED"
  | "PARTIALLY_SUPPORTED"
  | "CONTRADICTED"
  | "INCONCLUSIVE"
  | "REJECTED";

export type VerificationStatus =
  | "PENDING"
  | "COMPLETED"
  | "CHALLENGED"
  | "SUPERSEDED"
  | "REVOKED";

export interface VerificationResult {
  id: string;
  claimId: string;
  evidenceIds: string[];
  verifierId: string;
  decision: VerificationDecision;
  confidence: number;
  rationale: string;
  status: VerificationStatus;
  previousVerificationId?: string;
  createdAt: string;
}
