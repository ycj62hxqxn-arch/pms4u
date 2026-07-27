"use client";

import { useMemo, useRef, useState } from "react";
import type { KnowledgeGraph } from "@/lib/kge";
import {
  buildDeterministicLayout,
  findShortestKnowledgePath,
  graphToGraphML,
  graphToMermaid,
  type GraphLayout,
} from "@/lib/kge/visualization";

type Props = {
  graph: KnowledgeGraph;
  traceId: string;
  decision: string;
  score: number;
};

const WIDTH = 1200;
const HEIGHT = 760;

function download(filename: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function InteractiveGraph({ graph, traceId, decision, score }: Props) {
  const initial = useMemo(() => buildDeterministicLayout(graph, WIDTH, HEIGHT), [graph]);
  const [layout, setLayout] = useState<GraphLayout>(initial);
  const [selected, setSelected] = useState(graph.nodes[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [highlightNodes, setHighlightNodes] = useState<string[]>([]);
  const [highlightRelations, setHighlightRelations] = useState<string[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [panning, setPanning] = useState(false);
  const pointer = useRef({ x: 0, y: 0 });
  const svg = useRef<SVGSVGElement | null>(null);

  const selectedNode = graph.nodes.find((node) => node.id === selected);
  const relations = graph.relations.filter(
    (relation) =>
      relation.sourceNodeId === selected || relation.targetNodeId === selected,
  );
  const visible = new Set(
    graph.nodes
      .filter((node) => {
        const value = query.toLowerCase();
        return (
          !value ||
          node.label.toLowerCase().includes(value) ||
          node.type.toLowerCase().includes(value)
        );
      })
      .map((node) => node.id),
  );

  function point(clientX: number, clientY: number) {
    const rect = svg.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - view.x) / view.scale,
      y: (clientY - rect.top - view.y) / view.scale,
    };
  }

  function exportSvg() {
    if (!svg.current) return;
    download(
      `kge-${traceId}.svg`,
      new XMLSerializer().serializeToString(svg.current),
      "image/svg+xml",
    );
  }

  function showPath() {
    const result = findShortestKnowledgePath(graph, start, end);
    setHighlightNodes(result?.nodeIds ?? []);
    setHighlightRelations(result?.relationIds ?? []);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Decision", decision],
            ["Score", score.toFixed(2)],
            ["Nodes", String(graph.nodes.length)],
            ["Relations", String(graph.relations.length)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-[#17171b] p-3">
              <p className="text-[10px] uppercase text-zinc-600">{label}</p>
              <p className="mt-1 font-mono text-sm">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-[#17171b] p-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search nodes"
            className="min-w-56 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
          />
          <button onClick={() => { setLayout(initial); setView({ x: 0, y: 0, scale: 1 }); }} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Reset</button>
          <button onClick={exportSvg} className="rounded-lg border border-white/10 px-3 py-2 text-xs">SVG</button>
          <button onClick={() => download(`kge-${traceId}.json`, JSON.stringify(graph, null, 2), "application/json")} className="rounded-lg border border-white/10 px-3 py-2 text-xs">JSON</button>
          <button onClick={() => download(`kge-${traceId}.graphml`, graphToGraphML(graph), "application/graphml+xml")} className="rounded-lg border border-white/10 px-3 py-2 text-xs">GraphML</button>
          <button onClick={() => download(`kge-${traceId}.mmd`, graphToMermaid(graph), "text/plain")} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Mermaid</button>
        </div>

        <svg
          ref={svg}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-[68vh] min-h-[560px] w-full touch-none rounded-2xl border border-white/10 bg-[#101013]"
          onWheel={(event) => {
            event.preventDefault();
            const factor = event.deltaY > 0 ? 0.9 : 1.1;
            setView((current) => ({ ...current, scale: Math.max(0.35, Math.min(2.8, current.scale * factor)) }));
          }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              setPanning(true);
              pointer.current = { x: event.clientX, y: event.clientY };
            }
          }}
          onPointerMove={(event) => {
            if (dragging) {
              const next = point(event.clientX, event.clientY);
              setLayout((current) => ({ ...current, [dragging]: next }));
            } else if (panning) {
              const dx = event.clientX - pointer.current.x;
              const dy = event.clientY - pointer.current.y;
              pointer.current = { x: event.clientX, y: event.clientY };
              setView((current) => ({ ...current, x: current.x + dx, y: current.y + dy }));
            }
          }}
          onPointerUp={() => { setDragging(null); setPanning(false); }}
          onPointerLeave={() => { setDragging(null); setPanning(false); }}
        >
          <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
            {graph.relations.map((relation) => {
              const source = layout[relation.sourceNodeId];
              const target = layout[relation.targetNodeId];
              if (!source || !target) return null;
              const active = highlightRelations.includes(relation.id);
              return (
                <g key={relation.id}>
                  <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={active ? "#fde68a" : "#3f3f46"} strokeWidth={active ? 4 : 1.5} />
                  <text x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 5} textAnchor="middle" className="fill-zinc-600 text-[10px]">{relation.type}</text>
                </g>
              );
            })}

            {graph.nodes.map((node) => {
              const p = layout[node.id];
              if (!p) return null;
              const active = highlightNodes.includes(node.id);
              return (
                <g
                  key={node.id}
                  transform={`translate(${p.x} ${p.y})`}
                  opacity={visible.has(node.id) ? 1 : 0.12}
                  className="cursor-grab"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    setDragging(node.id);
                    setSelected(node.id);
                  }}
                  onClick={() => setSelected(node.id)}
                >
                  <circle r="34" fill={node.type === "CLAIM" ? "#0ea5e9" : node.type === "EVIDENCE" ? "#10b981" : node.type === "ACTOR" ? "#8b5cf6" : "#71717a"} stroke={active ? "#fde68a" : selected === node.id ? "#fff" : "#52525b"} strokeWidth={active ? 5 : selected === node.id ? 3 : 1} />
                  <text y="4" textAnchor="middle" className="pointer-events-none fill-white text-[9px] font-semibold">{node.type.slice(0, 12)}</text>
                  <text y="52" textAnchor="middle" className="pointer-events-none fill-zinc-300 text-[10px]">{node.label.length > 24 ? `${node.label.slice(0, 22)}…` : node.label}</text>
                </g>
              );
            })}
          </g>
        </svg>

        <div className="grid gap-2 rounded-xl border border-white/10 bg-[#17171b] p-4 md:grid-cols-[1fr_1fr_auto]">
          <select value={start} onChange={(event) => setStart(event.target.value)} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs">
            <option value="">Start node</option>
            {graph.nodes.map((node) => <option key={node.id} value={node.id}>{node.type}: {node.label}</option>)}
          </select>
          <select value={end} onChange={(event) => setEnd(event.target.value)} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs">
            <option value="">End node</option>
            {graph.nodes.map((node) => <option key={node.id} value={node.id}>{node.type}: {node.label}</option>)}
          </select>
          <button disabled={!start || !end} onClick={showPath} className="rounded-lg bg-amber-300 px-4 py-2 text-xs font-bold text-black disabled:opacity-30">Highlight path</button>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-[#17171b] p-4">
          <h2 className="text-sm font-semibold text-sky-300">Node inspector</h2>
          {selectedNode ? (
            <div className="mt-4 space-y-3 text-xs">
              <p><span className="text-zinc-600">Type:</span> {selectedNode.type}</p>
              <p className="leading-relaxed text-zinc-300">{selectedNode.label}</p>
              <p className="break-all font-mono text-zinc-600">{selectedNode.id}</p>
              <div className="space-y-2">
                {relations.map((relation) => (
                  <div key={relation.id} className="rounded-lg border border-white/5 bg-black/20 p-2">
                    <p className="text-sky-300">{relation.type}</p>
                    <p className="mt-1 break-all font-mono text-[10px] text-zinc-600">{relation.sourceNodeId} → {relation.targetNodeId}</p>
                  </div>
                ))}
              </div>
              <details>
                <summary className="cursor-pointer text-zinc-400">Metadata</summary>
                <pre className="mt-2 overflow-auto rounded-lg bg-black/30 p-3 text-[10px] text-zinc-500">{JSON.stringify(selectedNode, null, 2)}</pre>
              </details>
            </div>
          ) : <p className="mt-3 text-xs text-zinc-600">Select a node.</p>}
        </div>

        <div className="rounded-xl border border-white/10 bg-[#17171b] p-4">
          <h2 className="text-sm font-semibold text-emerald-300">Governance timeline</h2>
          <ol className="mt-4 space-y-3 text-xs text-zinc-400">
            {["Contribution received", "Claim generated", "Evidence evaluated", "Reasoning executed", "Trace persisted", "Receipt linked"].map((item, index) => (
              <li key={item} className="flex gap-3"><span className="font-mono text-emerald-400">{String(index + 1).padStart(2, "0")}</span>{item}</li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}
