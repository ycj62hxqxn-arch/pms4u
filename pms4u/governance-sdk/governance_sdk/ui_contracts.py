from typing import List, Optional
from pydantic import BaseModel

class GovernanceEventUI(BaseModel):
    event_id: str
    event_name: str
    previous_state: str
    next_state: str
    actor_id: str
    authority_level: str
    evidence_id: str
    transition_id: str
    event_hash: str
    previous_event_hash: str
    signature: Optional[str]
    timestamp: str
    status: str

class ExecutionTraceViewerProps(BaseModel):
    entity_id: str
    entity_type: str
    current_state: str
    lineage: List[GovernanceEventUI]

class ConstitutionalEventBusMessage(BaseModel):
    action: str
    payload: dict
