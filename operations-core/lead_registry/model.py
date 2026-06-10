from datetime import datetime
from enum import Enum
from typing import Optional

class LeadState(str, Enum):
    NEW = "NEW"
    CONTACTED = "CONTACTED"
    QUALIFIED = "QUALIFIED"
    QUOTE_SENT = "QUOTE_SENT"
    BOOKING_PENDING = "BOOKING_PENDING"
    BOOKING_CONFIRMED = "BOOKING_CONFIRMED"
    COMPLETED = "COMPLETED"

class Lead:
    def __init__(self, lead_id: str, customer_name: str, source: str, state: LeadState = LeadState.NEW, evidence_id: Optional[str] = None, created_at: Optional[datetime] = None):
        self.lead_id = lead_id
        self.customer_name = customer_name
        self.source = source
        self.state = state
        self.evidence_id = evidence_id
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "lead_id": self.lead_id,
            "customer_name": self.customer_name,
            "source": self.source,
            "state": self.state,
            "evidence_id": self.evidence_id,
            "created_at": self.created_at.isoformat(),
        }
