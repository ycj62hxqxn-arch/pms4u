import type { GovernanceStatus } from "../ontology";

export type EvidenceType =
  | "DOCUMENT"
  | "IMAGE"
  | "VIDEO"
  | "AUDIO"
  | "URL"
  | "DATASET"
  | "SOURCE_CODE"
  | "EXECUTION_LOG"
  | "HASH"
  | "RESEARCH";

export interface Evidence {
  id: string;
  type: EvidenceType;
  title: string;
  description?: string;
  uri?: string;
  sha256?: string;
  authorId: string;
  supportsClaimIds: string[];
  contradictsClaimIds: string[];
  metadata: Record<string, unknown>;
  status: GovernanceStatus;
  createdAt: string;
  updatedAt: string;
}
