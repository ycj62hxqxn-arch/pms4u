import type { VerificationDecision } from "../verification";

export type ConflictType =
  | "EVIDENCE_CONTRADICTION"
  | "VERIFICATION_DISAGREEMENT"
  | "RELATION_CONFLICT";

export type ConflictSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface VerificationSnapshot {
  verificationId: string;
  claimId: string;
  verifierId: string;
  decision: VerificationDecision;
  confidence: number;
}

export interface KnowledgeConflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  subjectId: string;
  relatedIds: string[];
  explanation: string;
  detectedAt: string;
}
