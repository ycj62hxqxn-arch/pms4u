export interface GovernanceEvent {
  eventId: string;
  eventName: string; // e.g. INTAKE, VERIFIED, AUTHORITY_GRANTED
  previousState: string | null;
  nextState: string;
  actorId: string;
  authorityLevel?: string | null;
  evidenceId?: string;
  transitionId: string;
  eventHash: string;
  previousEventHash?: string;
  signature?: string;
  timestamp: string;
  status: 'PENDING' | 'VERIFIED' | 'AUTHORITY_GRANTED' | 'EXECUTED' | 'REJECTED';
}

export interface ExecutionReceipt {
  allowed: boolean;
  decisionId: string;
  timestamp: string;
  evidenceId: string;
  policyUsed: string;
  authorityGranted: string;
  failureReason?: string;
  failureCode?: string;
}

export interface ExecutionTraceData {
  entityId: string;
  entityType: string;
  currentState: string;
  lineage: GovernanceEvent[];
  latestReceipt?: ExecutionReceipt;
}
