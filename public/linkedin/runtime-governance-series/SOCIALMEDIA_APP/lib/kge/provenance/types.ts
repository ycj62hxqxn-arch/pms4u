export type ProvenanceObjectType =
  | "CONCEPT"
  | "DISCUSSION"
  | "CONTRIBUTION"
  | "CLAIM"
  | "EVIDENCE"
  | "VERIFIER"
  | "VERIFICATION"
  | "GRAPH_RELATION";

export type ProvenanceAction =
  | "CREATED"
  | "DERIVED"
  | "IMPORTED"
  | "UPDATED"
  | "VERIFIED"
  | "CHALLENGED"
  | "SUPERSEDED"
  | "ARCHIVED";

export interface ProvenanceRecord {
  id: string;
  objectId: string;
  objectType: ProvenanceObjectType;
  action: ProvenanceAction;
  actorId: string;
  parentObjectIds: string[];
  sourceUri?: string;
  payloadHash?: string;
  previousRecordHash?: string;
  recordHash?: string;
  version: number;
  timestamp: string;
  metadata: Record<string, unknown>;
}
