import type {
  KnowledgeRelation,
} from "../graph";

import type {
  TraversalDirection,
  TraversalOptions,
  TraversalResult,
  TraversableKnowledgeGraph,
  TraversalStep,
} from "./types";

type QueueEntry = {
  nodeId: string;
  depth: number;
  viaRelation?: KnowledgeRelation;
  parentNodeId?: string;
};

function relationAllowed(
  relation: KnowledgeRelation,
  options: TraversalOptions,
): boolean {
  return (
    !options.relationTypes?.length ||
    options.relationTypes.includes(relation.type)
  );
}

function getAdjacentEntries(
  graph: TraversableKnowledgeGraph,
  nodeId: string,
  direction: TraversalDirection,
  options: TraversalOptions,
  depth: number,
): QueueEntry[] {
  const entries: QueueEntry[] = [];

  for (const relation of graph.relations) {
    if (!relationAllowed(relation, options)) {
      continue;
    }

    if (
      (direction === "OUTBOUND" || direction === "BOTH") &&
      relation.sourceNodeId === nodeId
    ) {
      entries.push({
        nodeId: relation.targetNodeId,
        depth,
        viaRelation: relation,
        parentNodeId: nodeId,
      });
    }

    if (
      (direction === "INBOUND" || direction === "BOTH") &&
      relation.targetNodeId === nodeId
    ) {
      entries.push({
        nodeId: relation.sourceNodeId,
        depth,
        viaRelation: relation,
        parentNodeId: nodeId,
      });
    }
  }

  return entries;
}

export function traverseKnowledgeGraph(
  graph: TraversableKnowledgeGraph,
  startNodeId: string,
  options: TraversalOptions = {},
): TraversalResult {
  const startNode = graph.nodes.find(
    (node) => node.id === startNodeId,
  );

  if (!startNode) {
    return {
      startNodeId,
      steps: [],
      visitedNodeIds: [],
      truncated: false,
    };
  }

  const direction = options.direction ?? "BOTH";
  const maxDepth = Math.max(0, options.maxDepth ?? 3);
  const includeStartNode = options.includeStartNode ?? true;

  const visited = new Set<string>();
  const steps: TraversalStep[] = [];
  const queue: QueueEntry[] = [
    {
      nodeId: startNodeId,
      depth: 0,
    },
  ];

  let truncated = false;

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current || visited.has(current.nodeId)) {
      continue;
    }

    const node = graph.nodes.find(
      (candidate) => candidate.id === current.nodeId,
    );

    if (!node) {
      continue;
    }

    visited.add(current.nodeId);

    if (includeStartNode || current.depth > 0) {
      steps.push({
        depth: current.depth,
        node,
        viaRelation: current.viaRelation,
        parentNodeId: current.parentNodeId,
      });
    }

    if (current.depth >= maxDepth) {
      const hasFurtherRelations =
        getAdjacentEntries(
          graph,
          current.nodeId,
          direction,
          options,
          current.depth + 1,
        ).length > 0;

      if (hasFurtherRelations) {
        truncated = true;
      }

      continue;
    }

    queue.push(
      ...getAdjacentEntries(
        graph,
        current.nodeId,
        direction,
        options,
        current.depth + 1,
      ),
    );
  }

  return {
    startNodeId,
    steps,
    visitedNodeIds: [...visited],
    truncated,
  };
}

export function findKnowledgePath(
  graph: TraversableKnowledgeGraph,
  startNodeId: string,
  targetNodeId: string,
  options: TraversalOptions = {},
): TraversalStep[] {
  const direction = options.direction ?? "BOTH";
  const maxDepth = Math.max(0, options.maxDepth ?? 5);

  const visited = new Set<string>();
  const queue: Array<{
    nodeId: string;
    depth: number;
    path: TraversalStep[];
  }> = [
    {
      nodeId: startNodeId,
      depth: 0,
      path: [],
    },
  ];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current || visited.has(current.nodeId)) {
      continue;
    }

    visited.add(current.nodeId);

    const node = graph.nodes.find(
      (candidate) => candidate.id === current.nodeId,
    );

    if (!node) {
      continue;
    }

    const currentPath: TraversalStep[] = [
      ...current.path,
      {
        depth: current.depth,
        node,
      },
    ];

    if (current.nodeId === targetNodeId) {
      return currentPath;
    }

    if (current.depth >= maxDepth) {
      continue;
    }

    const adjacent = getAdjacentEntries(
      graph,
      current.nodeId,
      direction,
      options,
      current.depth + 1,
    );

    for (const entry of adjacent) {
      const adjacentNode = graph.nodes.find(
        (candidate) => candidate.id === entry.nodeId,
      );

      if (!adjacentNode || visited.has(entry.nodeId)) {
        continue;
      }

      queue.push({
        nodeId: entry.nodeId,
        depth: entry.depth,
        path: [
          ...currentPath.slice(0, -1),
          {
            depth: current.depth,
            node,
          },
          {
            depth: entry.depth,
            node: adjacentNode,
            viaRelation: entry.viaRelation,
            parentNodeId: current.nodeId,
          },
        ],
      });
    }
  }

  return [];
}
