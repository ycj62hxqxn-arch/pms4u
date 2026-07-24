import type {
  KnowledgeNode,
  KnowledgeRelation,
} from "../graph";

import type {
  ClaimExplanation,
  ClaimExplanationInput,
  ExplanationFactor,
} from "./types";

function findNode(
  nodes: KnowledgeNode[],
  nodeId: string,
): KnowledgeNode | undefined {
  return nodes.find((node) => node.id === nodeId);
}

function relationObjectId(
  relation: KnowledgeRelation,
  nodes: KnowledgeNode[],
  claimNodeId: string,
): string | undefined {
  const relatedNodeId =
    relation.sourceNodeId === claimNodeId
      ? relation.targetNodeId
      : relation.sourceNodeId;

  return findNode(nodes, relatedNodeId)?.objectId;
}

function buildSummary(
  input: ClaimExplanationInput,
  supportingCount: number,
  contradictingCount: number,
  verificationCount: number,
): string {
  const decision = input.reasoningResult.decision;
  const score = input.reasoningResult.score.toFixed(2);

  switch (decision) {
    case "SUPPORTED":
      return (
        `Claim ${input.reasoningResult.claimId} is supported ` +
        `with score ${score}. ` +
        `${supportingCount} supporting evidence object(s), ` +
        `${contradictingCount} contradicting evidence object(s), and ` +
        `${verificationCount} verification object(s) were identified.`
      );

    case "CONTRADICTED":
      return (
        `Claim ${input.reasoningResult.claimId} is contradicted ` +
        `with score ${score}. ` +
        `${contradictingCount} contradicting evidence object(s) outweigh ` +
        `${supportingCount} supporting evidence object(s).`
      );

    case "CONTESTED":
      return (
        `Claim ${input.reasoningResult.claimId} remains contested. ` +
        `${supportingCount} supporting evidence object(s), ` +
        `${contradictingCount} contradicting evidence object(s), and ` +
        `${input.reasoningResult.conflictIds.length} governance conflict(s) ` +
        `require resolution.`
      );

    case "INSUFFICIENT_EVIDENCE":
      return (
        `Claim ${input.reasoningResult.claimId} has insufficient evidence. ` +
        `No adequate governed evidence path currently supports a decision.`
      );
  }
}

export function explainClaim(
  input: ClaimExplanationInput,
): ClaimExplanation {
  const factors: ExplanationFactor[] = [];
  const supportingEvidenceIds = new Set<string>();
  const contradictingEvidenceIds = new Set<string>();
  const verificationIds = new Set<string>();

  for (const relation of input.graphRelations) {
    const touchesClaim =
      relation.sourceNodeId === input.claimNodeId ||
      relation.targetNodeId === input.claimNodeId;

    if (!touchesClaim) {
      continue;
    }

    const objectId = relationObjectId(
      relation,
      input.graphNodes,
      input.claimNodeId,
    );

    if (!objectId) {
      continue;
    }

    const relatedNodeId =
      relation.sourceNodeId === input.claimNodeId
        ? relation.targetNodeId
        : relation.sourceNodeId;

    const relatedNode = findNode(
      input.graphNodes,
      relatedNodeId,
    );

    if (!relatedNode) {
      continue;
    }

    if (relation.type === "SUPPORTS") {
      supportingEvidenceIds.add(objectId);

      factors.push({
        type: "SUPPORTING_EVIDENCE",
        objectId,
        label: relatedNode.label,
        relation,
        weight: relation.confidence,
      });
    } else if (relation.type === "CONTRADICTS") {
      contradictingEvidenceIds.add(objectId);

      factors.push({
        type: "CONTRADICTING_EVIDENCE",
        objectId,
        label: relatedNode.label,
        relation,
        weight: relation.confidence,
      });
    } else if (relation.type === "VERIFIED_BY") {
      verificationIds.add(objectId);

      factors.push({
        type: "VERIFICATION",
        objectId,
        label: relatedNode.label,
        relation,
        weight: relation.confidence,
      });
    } else {
      factors.push({
        type: "GRAPH_RELATION",
        objectId,
        label: relatedNode.label,
        relation,
        weight: relation.confidence,
      });
    }
  }

  for (const conflictId of input.reasoningResult.conflictIds) {
    factors.push({
      type: "CONFLICT",
      objectId: conflictId,
      label: `Governance conflict ${conflictId}`,
    });
  }

  return {
    claimNodeId: input.claimNodeId,
    claimId: input.reasoningResult.claimId,
    decision: input.reasoningResult.decision,
    score: input.reasoningResult.score,
    summary: buildSummary(
      input,
      supportingEvidenceIds.size,
      contradictingEvidenceIds.size,
      verificationIds.size,
    ),
    factors,
    supportingEvidenceIds: [...supportingEvidenceIds],
    contradictingEvidenceIds: [...contradictingEvidenceIds],
    verificationIds: [...verificationIds],
    conflictIds: input.reasoningResult.conflictIds,
  };
}
