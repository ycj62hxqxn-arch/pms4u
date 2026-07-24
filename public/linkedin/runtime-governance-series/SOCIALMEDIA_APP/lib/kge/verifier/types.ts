export type VerifierType =
  | "HUMAN"
  | "AI"
  | "ORGANIZATION"
  | "GOVERNANCE_ENGINE"
  | "EXTERNAL_AUTHORITY"
  | "AUTOMATED_PROCESS";

export type VerifierStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "REVOKED"
  | "ARCHIVED";

export interface Verifier {
  id: string;
  name: string;
  type: VerifierType;
  status: VerifierStatus;
  authorityScope: string[];
  organizationId?: string;
  publicKey?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
