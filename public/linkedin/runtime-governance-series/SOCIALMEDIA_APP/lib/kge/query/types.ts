import type {
  KnowledgeGraph,
  KnowledgeNode,
  KnowledgeNodeType,
  KnowledgeRelation,
  KnowledgeRelationType,
} from "../graph";

export type QueryMatchMode = "ALL" | "ANY";

export interface KnowledgeQuery {
  nodeTypes?: KnowledgeNodeType[];
  relationTypes?: KnowledgeRelationType[];
  labels?: string[];
  objectIds?: string[];
  matchMode?: QueryMatchMode;
}

export interface KnowledgeQueryResult {
  nodes: KnowledgeNode[];
  relations: KnowledgeRelation[];
  totalNodes: number;
  totalRelations: number;
}

export type QueryableKnowledgeGraph = KnowledgeGraph;
