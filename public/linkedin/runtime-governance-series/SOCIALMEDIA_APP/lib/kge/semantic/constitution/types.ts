export type SemanticEntryCategory =
  | "FOUNDATIONAL"
  | "CONCEPTUAL"
  | "GOVERNANCE"
  | "PROCEDURAL"
  | "BOUNDARY"
  | "NEGATIVE";

export type SemanticGovernanceStatus =
  | "DRAFT"
  | "PROPOSED"
  | "RATIFIED"
  | "SUPERSEDED"
  | "REJECTED"
  | "LEGACY";

export type SemanticBoundaryKind =
  | "INCLUDES"
  | "EXCLUDES"
  | "REQUIRES"
  | "FORBIDS"
  | "DISTINGUISHES_FROM"
  | "LIMITS_TO_CONTEXT";

export type SemanticRelationKind =
  | "IS_A"
  | "PART_OF"
  | "DEPENDS_ON"
  | "REQUIRES"
  | "EXCLUDES"
  | "CONTRASTS_WITH"
  | "DERIVED_FROM"
  | "EQUIVALENT_TO"
  | "NEAR_EQUIVALENT_TO"
  | "BROADER_THAN"
  | "NARROWER_THAN"
  | "GOVERNS"
  | "LIMITS";

export interface SemanticBoundary {
  id: string;
  kind: SemanticBoundaryKind;
  statement: string;
  relatedEntryId?: string;
}

export interface SemanticRelation {
  id: string;
  kind: SemanticRelationKind;
  targetEntryId: string;
  explanation?: string;
}

export interface SemanticProvenance {
  sourceId: string;
  sourceType:
    | "BOOK"
    | "DOCUMENT"
    | "DOCTRINE"
    | "RESEARCH"
    | "DECISION"
    | "AUTHORIAL_ENTRY";
  author: string;
  recordedAt: string;
  sourceLocation?: string;
  sourceHash?: string;
}

export interface SemanticConstitutionEntry {
  id: string;
  canonicalTerm: string;
  root?: string;

  category: SemanticEntryCategory;
  definition: string;

  acceptanceCriteria: string[];
  rejectionCriteria: string[];

  boundaries: SemanticBoundary[];
  relations: SemanticRelation[];

  allowedContexts: string[];
  forbiddenContexts: string[];
  aliases: string[];

  tongue: string;
  version: string;
  governanceStatus: SemanticGovernanceStatus;

  provenance: SemanticProvenance;
  createdAt: string;
  updatedAt?: string;
}

export interface SemanticConstitution {
  id: string;
  title: string;
  version: string;
  entries: SemanticConstitutionEntry[];
  ratifiedAt?: string;
}

export interface SemanticValidationIssue {
  field: string;
  code: string;
  message: string;
}

export interface SemanticValidationResult {
  valid: boolean;
  issues: SemanticValidationIssue[];
}

export interface SemanticAdmissionDecision {
  admitted: boolean;
  entryId: string;
  status:
    | "ADMITTED"
    | "REJECTED"
    | "HELD";
  reasons: string[];
}
