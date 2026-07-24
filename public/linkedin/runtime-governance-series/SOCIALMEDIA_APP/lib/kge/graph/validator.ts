import type {
  KnowledgeGraph,
  KnowledgeNode,
  KnowledgeRelation,
} from "./types";

export function validateKnowledgeNode(node: KnowledgeNode): string[] {
  const errors: string[] = [];

  if (!node.id.trim()) errors.push("Knowledge node ID required.");
  if (!node.label.trim()) errors.push("Knowledge node label required.");
  if (!node.objectId.trim()) errors.push("Knowledge node object ID required.");

  return errors;
}

export function validateKnowledgeRelation(
  relation: KnowledgeRelation,
): string[] {
  const errors: string[] = [];

  if (!relation.id.trim()) {
    errors.push("Knowledge relation ID required.");
  }

  if (!relation.sourceNodeId.trim()) {
    errors.push("Knowledge relation source node required.");
  }

  if (!relation.targetNodeId.trim()) {
    errors.push("Knowledge relation target node required.");
  }

  if (relation.sourceNodeId === relation.targetNodeId) {
    errors.push("Knowledge relation cannot reference itself.");
  }

  if (
    relation.confidence !== undefined &&
    (relation.confidence < 0 || relation.confidence > 1)
  ) {
    errors.push("Knowledge relation confidence must be between 0 and 1.");
  }

  return errors;
}

export function validateKnowledgeGraph(graph: KnowledgeGraph): string[] {
  const errors: string[] = [];
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const relationIds = new Set<string>();

  if (nodeIds.size !== graph.nodes.length) {
    errors.push("Knowledge graph contains duplicate node IDs.");
  }

  for (const relation of graph.relations) {
    if (relationIds.has(relation.id)) {
      errors.push(`Duplicate relation ID: ${relation.id}.`);
    }

    relationIds.add(relation.id);

    if (!nodeIds.has(relation.sourceNodeId)) {
      errors.push(
        `Missing source node for relation ${relation.id}.`,
      );
    }

    if (!nodeIds.has(relation.targetNodeId)) {
      errors.push(
        `Missing target node for relation ${relation.id}.`,
      );
    }
  }

  return errors;
}
