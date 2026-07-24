import type {
  KnowledgeNode,
  KnowledgeRelation,
} from "../graph";

import type {
  ReasoningDecision,
  ReasoningResult,
} from "../reasoning";

export type ExplanationFactorType =
  | "SUPPORTING_EVIDENCE"
  | "CONTRADICTING_EVIDENCE"
  | "VERIFICATION"
  | "CONFLICT"
  | "PROVENANCE"
  | "GRAPH_RELATION";

export interface ExplanationFactor {
  type: ExplanationFactorType;
  objectId: string;
  label: string;
  relation?: KnowledgeRelation;
  weight?: number;
}

export interface ClaimExplanationInput {
  claimNodeId: string;
  reasoningResult: ReasoningResult;
  graphNodes: KnowledgeNode[];
  graphRelations: KnowledgeRelation[];
}

export interface ClaimExplanation {
  claimNodeId: string;
  claimId: string;
  decision: ReasoningDecision;
  score: number;
  summary: string;
  factors: ExplanationFactor[];
  supportingEvidenceIds: string[];
  contradictingEvidenceIds: string[];
  verificationIds: string[];
  conflictIds: string[];
}
