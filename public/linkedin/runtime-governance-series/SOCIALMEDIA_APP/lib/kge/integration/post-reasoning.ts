import {
  createHash,
  randomUUID,
} from "node:crypto";

import type {
  KnowledgeGraph,
  KnowledgeNode,
  KnowledgeRelation,
} from "../graph";
import {
  reasonAboutClaim,
  type ReasoningDecision,
  type ReasoningResult,
} from "../reasoning";

const STOP_WORDS = new Set([
  "about", "after", "again", "against", "being", "between", "could",
  "every", "from", "have", "into", "just", "more", "other", "should",
  "some", "such", "than", "that", "their", "there", "these", "they",
  "this", "through", "under", "very", "what", "when", "where", "which",
  "while", "with", "would", "your",
]);

export type PostReasoningTrace = {
  traceId: string;
  claimId: string;
  claimNodeId: string;
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
};

export type BuildPostReasoningInput = {
  postId: string;
  actorId: string;
  actorName: string;
  text: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  createdAt: string;
};

function stableId(prefix: string, value: string): string {
  const digest = createHash("sha256")
    .update(value)
    .digest("hex")
    .slice(0, 20);
  return `${prefix}:${digest}`;
}

function extractConcepts(text: string): string[] {
  const matches =
    text.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}-]{3,}/gu) ?? [];
  const concepts: string[] = [];
  const seen = new Set<string>();

  for (const token of matches) {
    if (STOP_WORDS.has(token) || seen.has(token)) continue;
    seen.add(token);
    concepts.push(token);
    if (concepts.length >= 8) break;
  }
  return concepts;
}

function relation(
  type: KnowledgeRelation["type"],
  sourceNodeId: string,
  targetNodeId: string,
  createdBy: string,
  createdAt: string,
  metadata: Record<string, unknown> = {},
  confidence?: number,
): KnowledgeRelation {
  return {
    id: randomUUID(),
    type,
    sourceNodeId,
    targetNodeId,
    createdBy,
    createdAt,
    confidence,
    metadata,
  };
}

export function buildPostReasoning(
  input: BuildPostReasoningInput,
): PostReasoningTrace {
  const claimId = `post-claim:${input.postId}`;
  const actorNodeId = `actor:${input.actorId}`;
  const contributionNodeId = `contribution:${input.postId}`;
  const claimNodeId = `claim:${input.postId}`;
  const concepts = extractConcepts(input.text);

  const nodes: KnowledgeNode[] = [
    {
      id: actorNodeId,
      type: "ACTOR",
      label: input.actorName,
      objectId: input.actorId,
      metadata: { source: "authenticated-session" },
    },
    {
      id: contributionNodeId,
      type: "CONTRIBUTION",
      label: input.text.trim().slice(0, 80) || "Media contribution",
      objectId: input.postId,
      metadata: {
        mediaType: input.mediaType ?? null,
        createdAt: input.createdAt,
      },
    },
    {
      id: claimNodeId,
      type: "CLAIM",
      label: input.text.trim().slice(0, 160) || "Media-only contribution",
      objectId: claimId,
      metadata: { sourcePostId: input.postId },
    },
  ];

  const relations: KnowledgeRelation[] = [
    relation("CREATED_BY", contributionNodeId, actorNodeId, input.actorId, input.createdAt),
    relation("ORIGINATED_FROM", claimNodeId, contributionNodeId, input.actorId, input.createdAt),
  ];

  for (const concept of concepts) {
    const conceptNodeId = stableId("concept", concept);
    nodes.push({
      id: conceptNodeId,
      type: "CONCEPT",
      label: concept,
      objectId: concept,
      metadata: { extraction: "deterministic-token" },
    });
    relations.push(
      relation(
        "RELATES_TO",
        claimNodeId,
        conceptNodeId,
        input.actorId,
        input.createdAt,
        { extraction: "deterministic-token" },
        0.7,
      ),
    );
  }

  let supportingEvidenceCount = 0;

  if (input.mediaUrl && input.mediaType) {
    supportingEvidenceCount = 1;
    const evidenceNodeId = `evidence:${input.postId}:media`;
    nodes.push({
      id: evidenceNodeId,
      type: "EVIDENCE",
      label: `${input.mediaType} attached to contribution`,
      objectId: evidenceNodeId,
      metadata: {
        mediaType: input.mediaType,
        digest: createHash("sha256").update(input.mediaUrl).digest("hex"),
      },
    });
    relations.push(
      relation(
        "SUPPORTS",
        evidenceNodeId,
        claimNodeId,
        input.actorId,
        input.createdAt,
        { basis: "attached-media" },
        0.75,
      ),
    );
  }

  const reasoningResult = reasonAboutClaim({
    claimId,
    supportingEvidenceCount,
    contradictingEvidenceCount: 0,
    completedVerificationCount: supportingEvidenceCount,
    averageVerificationConfidence:
      supportingEvidenceCount > 0 ? 0.75 : undefined,
  });

  const summary =
    reasoningResult.decision === "SUPPORTED"
      ? `The contribution produced a governed claim with ${concepts.length} extracted concept(s) and ${supportingEvidenceCount} supporting evidence object(s).`
      : `The contribution produced a governed claim with ${concepts.length} extracted concept(s), but no governed supporting evidence was attached.`;

  return {
    traceId: randomUUID(),
    claimId,
    claimNodeId,
    decision: reasoningResult.decision,
    score: reasoningResult.score,
    explanation: reasoningResult.explanation,
    summary,
    concepts,
    nodeCount: nodes.length,
    relationCount: relations.length,
    evidenceCount: supportingEvidenceCount,
    graph: { nodes, relations },
    reasoningResult,
    generatedAt: input.createdAt,
  };
}
