export type KnowledgeNodeType =
  | "ACTOR"
  | "CONCEPT"
  | "DISCUSSION"
  | "CONTRIBUTION"
  | "CLAIM"
  | "EVIDENCE"
  | "VERIFIER"
  | "VERIFICATION";

export type KnowledgeRelationType =
  | "CREATED_BY"
  | "ORIGINATED_FROM"
  | "DERIVED_FROM"
  | "SUPPORTS"
  | "CONTRADICTS"
  | "EXTENDS"
  | "REFINES"
  | "CHALLENGES"
  | "DEPENDS_ON"
  | "IMPLEMENTS"
  | "VERIFIED_BY"
  | "SUPERSEDES"
  | "RELATES_TO";

export interface KnowledgeNode {
  id: string;
  type: KnowledgeNodeType;
  label: string;
  objectId: string;
  metadata: Record<string, unknown>;
}

export interface KnowledgeRelation {
  id: string;
  type: KnowledgeRelationType;
  sourceNodeId: string;
  targetNodeId: string;
  createdBy: string;
  confidence?: number;
  provenanceRecordId?: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  relations: KnowledgeRelation[];
}
