from enum import Enum
from typing import Dict, List

class HuntState(str, Enum):
    INTAKE = "INTAKE"
    VERIFIED = "VERIFIED"
    COMPLIANCE_PENDING = "COMPLIANCE_PENDING"
    PAYMENT_CONFIRMED = "PAYMENT_CONFIRMED"
    GOVERNANCE_REVIEW = "GOVERNANCE_REVIEW"
    EXPORT_APPROVED = "EXPORT_APPROVED"
    EXPORTED = "EXPORTED"
    ARCHIVED = "ARCHIVED"

ALLOWED_TRANSITIONS: Dict[HuntState, List[HuntState]] = {
    HuntState.INTAKE: [HuntState.VERIFIED],
    HuntState.VERIFIED: [HuntState.COMPLIANCE_PENDING],
    HuntState.COMPLIANCE_PENDING: [HuntState.PAYMENT_CONFIRMED, HuntState.GOVERNANCE_REVIEW],
    HuntState.PAYMENT_CONFIRMED: [HuntState.GOVERNANCE_REVIEW],
    HuntState.GOVERNANCE_REVIEW: [HuntState.EXPORT_APPROVED],
    HuntState.EXPORT_APPROVED: [HuntState.EXPORTED],
    HuntState.EXPORTED: [HuntState.ARCHIVED]
}

class IllegalStateJumpException(Exception):
    pass

def validate_local_transition(current_state: str, requested_state: str):
    try:
        current_enum = HuntState(current_state)
        next_enum = HuntState(requested_state)
    except ValueError:
        raise IllegalStateJumpException(f"Invalid state requested: {requested_state}")

    if next_enum not in ALLOWED_TRANSITIONS.get(current_enum, []):
        raise IllegalStateJumpException(f"ILLEGAL_STATE_JUMP_REJECTED: {current_state} -> {requested_state}")
