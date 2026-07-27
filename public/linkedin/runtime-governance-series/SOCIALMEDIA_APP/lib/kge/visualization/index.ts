import type { KnowledgeGraph } from "@/lib/kge";

export type GraphPoint = { x: number; y: number };
export type GraphLayout = Record<string, GraphPoint>;

export function buildDeterministicLayout(
  graph: KnowledgeGraph,
  width = 1200,
  height = 760,
): GraphLayout {
  const nodes = [...graph.nodes].sort((a, b) => a.id.localeCompare(b.id));
  const layout: GraphLayout = {};
  const radius = Math.min(width, height) * 0.36;

  nodes.forEach((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(1, nodes.length);
    layout[node.id] = {
      x: width / 2 + Math.cos(angle) * radius,
      y: height / 2 + Math.sin(angle) * radius,
    };
  });

  return layout;
}

export function findShortestKnowledgePath(
  graph: KnowledgeGraph,
  source: string,
  target: string,
): { nodeIds: string[]; relationIds: string[] } | null {
  if (source === target) return { nodeIds: [source], relationIds: [] };

  const adjacency = new Map<string, Array<{ node: string; relation: string }>>();
  for (const relation of graph.relations) {
    const a = adjacency.get(relation.sourceNodeId) ?? [];
    a.push({ node: relation.targetNodeId, relation: relation.id });
    adjacency.set(relation.sourceNodeId, a);

    const b = adjacency.get(relation.targetNodeId) ?? [];
    b.push({ node: relation.sourceNodeId, relation: relation.id });
    adjacency.set(relation.targetNodeId, b);
  }

  const queue = [source];
  const visited = new Set([source]);
  const parent = new Map<string, { node: string; relation: string }>();

  while (queue.length) {
    const current = queue.shift()!;
    for (const next of adjacency.get(current) ?? []) {
      if (visited.has(next.node)) continue;
      visited.add(next.node);
      parent.set(next.node, { node: current, relation: next.relation });

      if (next.node === target) {
        const nodeIds = [target];
        const relationIds: string[] = [];
        let cursor = target;
        while (cursor !== source) {
          const previous = parent.get(cursor);
          if (!previous) return null;
          nodeIds.unshift(previous.node);
          relationIds.unshift(previous.relation);
          cursor = previous.node;
        }
        return { nodeIds, relationIds };
      }
      queue.push(next.node);
    }
  }

  return null;
}

const xml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export function graphToMermaid(graph: KnowledgeGraph): string {
  const id = (value: string) => `n_${value.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  return [
    "flowchart LR",
    ...graph.nodes.map((node) => `  ${id(node.id)}["${node.label.replaceAll('"', "'")}"]`),
    ...graph.relations.map(
      (relation) =>
        `  ${id(relation.sourceNodeId)} -->|${relation.type}| ${id(relation.targetNodeId)}`,
    ),
  ].join("\n");
}

export function graphToGraphML(graph: KnowledgeGraph): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">',
    '  <graph id="KGE" edgedefault="directed">',
    ...graph.nodes.map(
      (node) =>
        `    <node id="${xml(node.id)}"><data key="type">${xml(node.type)}</data><data key="label">${xml(node.label)}</data></node>`,
    ),
    ...graph.relations.map(
      (relation) =>
        `    <edge id="${xml(relation.id)}" source="${xml(relation.sourceNodeId)}" target="${xml(relation.targetNodeId)}"><data key="type">${xml(relation.type)}</data></edge>`,
    ),
    "  </graph>",
    "</graphml>",
  ].join("\n");
}
