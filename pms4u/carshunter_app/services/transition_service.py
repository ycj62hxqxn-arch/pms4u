# transition_service.py
# Orchestrates governed state transitions using governance client and ledger


from carshunter_app.governance.governance_client import GovernanceRuntimeClient
from carshunter_app.ledger.append_ledger import append_ledger
from carshunter_app.governance.state_machine import IllegalStateJumpException

# The canonical runtime authority client (REST, not mock)
governance_client = GovernanceRuntimeClient(governance_url="http://localhost:8000")

def execute_transition(hunt_id, from_state, to_state, authority_token, actor="SYSTEM", correlation_id=None, current_state=None):
    """
    Canonical execution path:
    1. Validate contract fields
    2. Authority resolution (REST)
    3. Admissibility verdict
    4. Evidence issuance
    5. Ledger append
    6. Commit or freeze
    """
    # Step 1: Validate contract fields (no bypass possible)
    if not all([hunt_id, from_state, to_state, authority_token, actor]):
        return {"error": "Missing required canonical contract fields"}, 400

    # Step 2: Authority resolution (REST, no bypass)
    try:
        receipt = governance_client.request_transition(
            hunt_id=hunt_id,
            requested_transition=to_state,
            actor=actor,
            authority_token=authority_token,
            correlation_id=correlation_id,
            current_state=from_state
        )
    except IllegalStateJumpException as e:
        return {"error": "ILLEGAL_STATE_JUMP_REJECTED", "message": str(e)}, 422
    except Exception as e:
        return {"error": "GOVERNANCE_REJECTED", "message": str(e)}, 403

    # Step 3: Admissibility verdict & Step 4: Evidence issuance (no transition without evidence_id)
    if not getattr(receipt, "evidence_id", None):
        # Defensive: never allow commit or ledger without evidence_id
        return {"error": "NO_EVIDENCE_ID", "message": "Transition missing evidence_id"}, 500

    # Step 5: Ledger append (must succeed before commit, no bypass)
    try:
        append_ledger(receipt.model_dump())
    except Exception as e:
        return {"error": "LEDGER_APPEND_FAILED", "message": str(e)}, 500

    # Step 6: Commit or freeze (no execution after FREEZE, no bypass)
    if not getattr(receipt, "approved", False):
        # Defensive: freeze means no further execution possible
        return {
            "status": "FREEZE",
            "verdict": "DENIED",
            "evidence_id": receipt.evidence_id,
            "authority_signature": getattr(receipt, "authority_signature", None),
            "timestamp": receipt.timestamp,
            "correlation_id": getattr(receipt, "correlation_id", None),
            "message": "Transition frozen by constitutional authority"
        }, 403

    # Canonical response contract (replay lineage must reproduce all fields)
    return {
        "status": "ALLOW",
        "verdict": "APPROVED",
        "transition": receipt.transition,
        "evidence_id": receipt.evidence_id,
        "authority_signature": getattr(receipt, "authority_signature", None),
        "event_hash": getattr(receipt, "event_hash", None),
        "correlation_id": getattr(receipt, "correlation_id", None),
        "timestamp": receipt.timestamp,
        "projection_version": getattr(receipt, "projection_version", None)
        # All fields above must be replayable from the ledger for integrity
    }, 200
