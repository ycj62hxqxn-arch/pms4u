import type {
  KnowledgeGraph,
  KnowledgeNode,
  KnowledgeRelation,
  KnowledgeRelationType,
} from "../graph";

export type TraversalDirection =
  | "OUTBOUND"
  | "INBOUND"
  | "BOTH";

export interface TraversalOptions {
  direction?: TraversalDirection;
  maxDepth?: number;
  relationTypes?: KnowledgeRelationType[];
  includeStartNode?: boolean;
}

export interface TraversalStep {
  depth: number;
  node: KnowledgeNode;
  viaRelation?: KnowledgeRelation;
  parentNodeId?: string;
}

export interface TraversalResult {
  startNodeId: string;
  steps: TraversalStep[];
  visitedNodeIds: string[];
  truncated: boolean;
}

export type TraversableKnowledgeGraph = KnowledgeGraph;
