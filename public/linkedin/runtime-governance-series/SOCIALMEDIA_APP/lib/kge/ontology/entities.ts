export type ActorType =
  | "USER"
  | "AGENT"
  | "ADMIN"
  | "ORGANIZATION"
  | "SYSTEM";

export type GovernanceStatus =
  | "DRAFT"
  | "PROPOSED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "DISPUTED"
  | "MERGED"
  | "DEPRECATED"
  | "REJECTED";

export interface Actor {
  id: string;
  type: ActorType;
  displayName: string;
  createdAt: string;
}

export interface Concept {
  id: string;
  slug: string;
  name: string;
  definition: string;

  originatorId: string;
  originatedAt: string;

  parentConceptIds: string[];
  relatedConceptIds: string[];

  currentVersion: number;
  status: GovernanceStatus;

  createdAt: string;
  updatedAt: string;
}
