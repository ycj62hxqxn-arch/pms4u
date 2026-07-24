export type ConstitutionalDecision =
  | "ALLOW"
  | "DENY"
  | "REQUIRE_REVIEW";

export type ConstitutionalAuthority = {
  actor: string;
  roles: string[];
};

export type ConstitutionalEvidence = {
  id?: string;
  digest?: string;
  type?: string;
};

export type ConstitutionalEvaluationRequest = {
  intent: string;
  authority: ConstitutionalAuthority;
  context?: Record<string, unknown>;
  evidence?: ConstitutionalEvidence[];
};

export type ConstitutionalReceipt = {
  receiptId: string;
  decision: ConstitutionalDecision;
  reason: string;
  constitutionalRules: string[];
  intent: string;
  actor: string;
  context: Record<string, unknown>;
  evidence: ConstitutionalEvidence[];
  timestamp: string;
  hash: string;
  signature: string;
  publicKey: string;
  previousReceiptHash?: string;
  runtimeVersion: string;
};

export type CKERNELHealth = {
  service: string;
  status: string;
};

export type ConstitutionalVerificationResult = {
  valid: boolean;
  reason: string;
};

