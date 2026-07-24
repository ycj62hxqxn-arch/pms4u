import type {
  KnowledgeGraph,
  KnowledgeNode,
} from "../graph";

import {
  findKnowledgePath,
} from "../traversal";

export interface ExplanationPath {
  found: boolean;
  startNodeId: string;
  targetNodeId: string;
  nodeIds: string[];
  labels: string[];
  relationTypes: string[];
}

export function explainKnowledgePath(
  graph: KnowledgeGraph,
  startNodeId: string,
  targetNodeId: string,
  maxDepth = 6,
): ExplanationPath {
  const steps = findKnowledgePath(
    graph,
    startNodeId,
    targetNodeId,
    {
      direction: "BOTH",
      maxDepth,
    },
  );

  if (steps.length === 0) {
    return {
      found: false,
      startNodeId,
      targetNodeId,
      nodeIds: [],
      labels: [],
      relationTypes: [],
    };
  }

  const nodes: KnowledgeNode[] = steps.map(
    (step) => step.node,
  );

  return {
    found: true,
    startNodeId,
    targetNodeId,
    nodeIds: nodes.map((node) => node.id),
    labels: nodes.map((node) => node.label),
    relationTypes: steps.flatMap((step) =>
      step.viaRelation ? [step.viaRelation.type] : [],
    ),
  };
}
