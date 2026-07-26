import type { KnowledgeGraph, ReasoningDecision, ReasoningResult } from "@/lib/kge";

export interface PersistedReasoningTrace {
  traceId: string;
  traceHash: string;
  postId: string;
  claimId: string;
  claimNodeId: string;
  constitutionalReceiptId: string;
  constitutionalReceiptHash?: string;
  actorId: string;
  actorName: string;
  decision: ReasoningDecision;
  score: number;
  explanation: string;
  summary: string;
  concepts: string[];
  nodeCount: number;
  relationCount: number;
  evidenceCount: number;
  graph: KnowledgeGraph;
  reasoningResult: ReasoningResult;
  generatedAt: string;
  persistedAt: string;
}

export type PersistReasoningTraceInput = Omit<PersistedReasoningTrace, "traceHash" | "persistedAt">;
