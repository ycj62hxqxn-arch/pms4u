import type { KnowledgeGraph } from "../graph";
import type {
  KnowledgeConflict,
  VerificationSnapshot,
} from "./types";

function conflictId(prefix: string, values: string[]): string {
  return `${prefix}:${[...values].sort().join(":")}`;
}

export function detectRelationConflicts(
  graph: KnowledgeGraph,
  detectedAt: string,
): KnowledgeConflict[] {
  const conflicts: KnowledgeConflict[] = [];
  const relationIndex = new Map<string, Set<string>>();

  for (const relation of graph.relations) {
    const key = `${relation.sourceNodeId}->${relation.targetNodeId}`;

    if (!relationIndex.has(key)) {
      relationIndex.set(key, new Set());
    }

    relationIndex.get(key)?.add(relation.type);
  }

  for (const [subjectId, types] of relationIndex) {
    if (types.has("SUPPORTS") && types.has("CONTRADICTS")) {
      conflicts.push({
        id: conflictId("relation-conflict", [subjectId]),
        type: "RELATION_CONFLICT",
        severity: "HIGH",
        subjectId,
        relatedIds: [],
        explanation:
          "The same source-target pair both supports and contradicts.",
        detectedAt,
      });
    }
  }

  return conflicts;
}

export function detectVerificationConflicts(
  verifications: VerificationSnapshot[],
  detectedAt: string,
): KnowledgeConflict[] {
  const conflicts: KnowledgeConflict[] = [];
  const grouped = new Map<string, VerificationSnapshot[]>();

  for (const verification of verifications) {
    const existing = grouped.get(verification.claimId) ?? [];
    existing.push(verification);
    grouped.set(verification.claimId, existing);
  }

  for (const [claimId, items] of grouped) {
    const supported = items.filter(
      (item) =>
        item.decision === "SUPPORTED" ||
        item.decision === "PARTIALLY_SUPPORTED",
    );

    const contradicted = items.filter(
      (item) =>
        item.decision === "CONTRADICTED" ||
        item.decision === "REJECTED",
    );

    if (supported.length > 0 && contradicted.length > 0) {
      const relatedIds = items.map((item) => item.verificationId);

      conflicts.push({
        id: conflictId("verification-conflict", [
          claimId,
          ...relatedIds,
        ]),
        type: "VERIFICATION_DISAGREEMENT",
        severity: "HIGH",
        subjectId: claimId,
        relatedIds,
        explanation:
          "The claim has both supporting and contradicting verification results.",
        detectedAt,
      });
    }
  }

  return conflicts;
}
