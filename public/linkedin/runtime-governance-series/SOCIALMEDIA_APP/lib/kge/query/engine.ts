import type {
  KnowledgeQuery,
  KnowledgeQueryResult,
  QueryableKnowledgeGraph,
} from "./types";

function includesNormalized(values: string[], candidate: string): boolean {
  const normalizedCandidate = candidate.trim().toLowerCase();

  return values.some(
    (value) => value.trim().toLowerCase() === normalizedCandidate,
  );
}

export function queryKnowledgeGraph(
  graph: QueryableKnowledgeGraph,
  query: KnowledgeQuery,
): KnowledgeQueryResult {
  const matchMode = query.matchMode ?? "ALL";

  const nodes = graph.nodes.filter((node) => {
    const checks: boolean[] = [];

    if (query.nodeTypes?.length) {
      checks.push(query.nodeTypes.includes(node.type));
    }

    if (query.labels?.length) {
      checks.push(includesNormalized(query.labels, node.label));
    }

    if (query.objectIds?.length) {
      checks.push(query.objectIds.includes(node.objectId));
    }

    if (checks.length === 0) {
      return true;
    }

    return matchMode === "ANY"
      ? checks.some(Boolean)
      : checks.every(Boolean);
  });

  const matchingNodeIds = new Set(nodes.map((node) => node.id));

  const relations = graph.relations.filter((relation) => {
    const typeMatches =
      !query.relationTypes?.length ||
      query.relationTypes.includes(relation.type);

    const connectedToMatchedNode =
      matchingNodeIds.size === 0 ||
      matchingNodeIds.has(relation.sourceNodeId) ||
      matchingNodeIds.has(relation.targetNodeId);

    return typeMatches && connectedToMatchedNode;
  });

  return {
    nodes,
    relations,
    totalNodes: nodes.length,
    totalRelations: relations.length,
  };
}
