from dataclasses import dataclass
from typing import Optional

@dataclass
class TransitionRequest:
    hunt_id: int
    from_state: str
    to_state: str
    authority_token: str

@dataclass
class TransitionVerdict:
    allowed: bool
    evidence_id: Optional[str]
    reason: Optional[str]
