import type {
  Actor,
  GovernanceStatus,
} from "../ontology";

export type ContributionType =
  | "ORIGINATES"
  | "SUPPORTS"
  | "EXTENDS"
  | "REFINES"
  | "CHALLENGES"
  | "QUESTIONS"
  | "CONTRADICTS"
  | "EVIDENCES"
  | "IMPLEMENTS"
  | "VERIFIES"
  | "MERGES"
  | "DEPRECATES";

export type SourceObjectType =
  | "POST"
  | "COMMENT"
  | "ARTICLE"
  | "DOCUMENT"
  | "MESSAGE"
  | "RESEARCH"
  | "RUNTIME_EVENT";

export interface SourceReference {
  sourceType: SourceObjectType;
  sourceId: string;
  sourceUrl?: string;
  excerpt?: string;
  capturedAt: string;
}

export interface Contribution {
  id: string;

  discussionId: string;
  conceptId?: string;
  claimId?: string;

  contributor: Actor;
  contributionType: ContributionType;

  statement: string;
  source: SourceReference;

  confidence?: number;
  previousContributionId?: string;

  status: GovernanceStatus;
  createdAt: string;
}

export interface Discussion {
  id: string;
  title: string;

  sourcePostId?: string;
  participantIds: string[];

  conceptIds: string[];
  claimIds: string[];
  contributionIds: string[];

  summary?: string;
  status: GovernanceStatus;

  createdAt: string;
  updatedAt: string;
}
