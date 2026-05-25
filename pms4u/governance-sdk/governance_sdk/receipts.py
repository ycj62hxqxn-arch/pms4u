from pydantic import BaseModel
from typing import Optional

class ExecutionReceipt(BaseModel):
    approved: bool
    transition: str
    evidence_id: str
    authority_signature: str
    event_hash: str
    correlation_id: str
    timestamp: str
    projection_version: Optional[int] = None
