from flask import Flask, request, jsonify, g
import uuid
import logging
from governance.governance_client import GovernanceRuntimeClient
from governance.projection_adapter import ProjectionUpdater
from governance.state_machine import IllegalStateJumpException
from governance.ledger import ImmutableEventLogger

app = Flask(__name__)
# The Operational App now connects to the internal Execution Layer via its dedicated network routing
gov_client = GovernanceRuntimeClient(governance_url="http://governance.gtcs4u.local")
projection_adapter = ProjectionUpdater(db_path="carshunter.db")
local_ledger = ImmutableEventLogger(log_path="local_operations_ledger.jsonl")

# Setup Logging to easily trace correlation IDs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CARSHUNTER_INTAKE")

@app.before_request
def ensure_correlation_id():
    g.correlation_id = request.headers.get("X-Correlation-ID", f"TRACE-{uuid.uuid4().hex[:8].upper()}")

@app.after_request
def append_correlation_id(response):
    response.headers["X-Correlation-ID"] = g.correlation_id
    return response

@app.route("/api/hunts/<hunt_id>/execute", methods=["POST"])
def execute_transition(hunt_id):
    """
    Pure Orchestration Lineage API.
    DOES NOT CONTAIN BUSINESS LOGIC.
    """
    data = request.json
    requested_transition = data.get("transition")
    actor = data.get("actor", "SYSTEM")
    authority_token = data.get("authority_token", "default")
    
    # 1. Fetch DUMB Projection state
    current_state = projection_adapter.get_current_state(hunt_id)
    
    logger.info(f"[{g.correlation_id}] Request: {current_state} -> {requested_transition} on {hunt_id}")

    try:
        # 2. Local State Machine Guard (Fail Fast)
        # Prevents hitting core with useless transitions
        # 3. Call Governance Engine
        receipt = gov_client.request_transition(
            hunt_id=hunt_id,
            requested_transition=requested_transition,
            actor=actor,
            authority_token=authority_token,
            correlation_id=g.correlation_id,
            current_state=current_state
        )
    except IllegalStateJumpException as e:
        logger.warning(f"[{g.correlation_id}] Local Validator Reject: {str(e)}")
        return jsonify({"error": "ILLEGAL_STATE_JUMP_REJECTED", "message": str(e)}), 422
    except Exception as e:
        logger.error(f"[{g.correlation_id}] Gov Core Reject: {str(e)}")
        return jsonify({"error": "GOVERNANCE_REJECTED", "message": str(e)}), 403

    # 4. Projection Synchronization layer
    if receipt.approved:
        # Write down local proof in JSONL
        local_ledger.append_receipt(receipt.model_dump())
        
        # Dumb commit to local database
        success = projection_adapter.commit_receipt(hunt_id, receipt)
        if success:
            logger.info(f"[{g.correlation_id}] Transaction Projected. EVID: {receipt.evidence_id}")
            return jsonify({
                "status": "success",
                "message": "Institutional Transaction Executed",
                "receipt": receipt.model_dump()
            }), 200
            
    return jsonify({"error": "Transition failed local commitment"}), 500

