import { createHash } from "crypto";

export type ComparisonStatus =
  | "DRAFT"
  | "RUNNING"
  | "COMPLETED"
  | "PARTIAL"
  | "FAILED"
  | "INVALID_LOCATION";

export interface EvidenceRecord {
  comparisonId: string;
  status: ComparisonStatus;
  searchRequest: Record<string, unknown>;
  selectedLocations: string[];
  effectiveIpVerification: Record<string, unknown>[];
  providerResponseMetadata: Record<string, unknown>[];
  currencyRates: Record<string, unknown>[];
  normalizationLogicVersion: string;
  offerMatchingVersion: string;
  requestTimestamps: {
    started: string;
    completed?: string;
  };
  errors: Array<{
    location: string;
    code: string;
    message: string;
  }>;
  finalDecisionSummary: Record<string, unknown>;
  evidenceHash?: string;
  createdAt: string;
}

export function generateEvidenceHash(record: Omit<EvidenceRecord, 'evidenceHash'>): string {
  const normalized = JSON.stringify(record, Object.keys(record).sort());
  return createHash("sha256").update(normalized).digest("hex");
}

export function createEvidenceRecord(
  comparisonId: string,
  status: ComparisonStatus,
  searchRequest: Record<string, unknown>,
  selectedLocations: string[]
): EvidenceRecord {
  return {
    comparisonId,
    status,
    searchRequest,
    selectedLocations,
    effectiveIpVerification: [],
    providerResponseMetadata: [],
    currencyRates: [],
    normalizationLogicVersion: "1.0",
    offerMatchingVersion: "1.0",
    requestTimestamps: {
      started: new Date().toISOString(),
    },
    errors: [],
    finalDecisionSummary: {},
    createdAt: new Date().toISOString(),
  };
}
