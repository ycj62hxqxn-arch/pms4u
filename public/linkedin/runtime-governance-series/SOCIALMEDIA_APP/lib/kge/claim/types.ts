import type { GovernanceStatus } from "../ontology";

export type ClaimType =
  | "FACT"
  | "HYPOTHESIS"
  | "OPINION"
  | "DEFINITION"
  | "METHOD"
  | "PRINCIPLE"
  | "DOCTRINE";

export interface Claim {

  id: string;

  conceptId: string;

  discussionId: string;

  statement: string;

  type: ClaimType;

  authorId: string;

  evidenceIds: string[];

  confidence: number;

  verificationScore: number;

  status: GovernanceStatus;

  createdAt: string;

  updatedAt: string;

}