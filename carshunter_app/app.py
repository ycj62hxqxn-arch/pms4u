from flask import Flask, request, jsonify, g
import uuid
import logging
from governance.governance_client import GovernanceRuntimeClient
from governance.projection_adapter import ProjectionUpdater
from governance.state_machine import IllegalStateJumpException

app = Flask(__name__)
gov_client = GovernanceRuntimeClient(governance_url="http://localhost:8000")
projection_adapter = ProjectionUpdater(db_path="carshunter.db")

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
    Orchestration Route.
    NO AUTHORITY RULES OR COMPLIANCE LOGIC HERE.
    """
    data = request.json
    requested_transition = data.get("transition")
    actor = data.get("actor", "SYSTEM")
    authority_token = data.get("authority_token", "default")
    
    # Get dumb state for local quick-fail validation
    current_state = projection_adapter.get_current_state(hunt_id)
    
    logger.info(f"[{g.correlation_id}] Actor {actor} attempting transition {current_state} -> {requested_transition} on {hunt_id}")

    try:
        # Ask Authority for execution receipt
        receipt = gov_client.request_transition(
            hunt_id=hunt_id,
            requested_transition=requested_transition,
            actor=actor,
            authority_token=authority_token,
            correlation_id=g.correlation_id,
            current_state=current_state
        )
    except IllegalStateJumpException as e:
        logger.warning(f"[{g.correlation_id}] Local DAG Reject: {str(e)}")
        return jsonify({"error": "ILLEGAL_STATE_JUMP_REJECTED", "message": str(e)}), 422
    except Exception as e:
        logger.error(f"[{g.correlation_id}] Governance Core Reject/Error: {str(e)}")
        return jsonify({"error": "GOVERNANCE_REJECTED", "message": str(e)}), 403

    # If we got a valid signed receipt, merely update the read-model projection.
    if receipt.approved:
        success = projection_adapter.commit_receipt(hunt_id, receipt)
        if success:
            logger.info(f"[{g.correlation_id}] Projected safely. EVID: {receipt.evidence_id}")
            return jsonify({
                "status": "success",
                "message": "Institutional Transaction Executed",
                "receipt": receipt.model_dump()
            }), 200
            
    return jsonify({"error": "Transition failed commitment"}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
