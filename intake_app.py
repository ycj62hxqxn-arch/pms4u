from flask import Flask, request, jsonify, g
import uuid
import os
from governance_sdk.client import GovernanceClient
from governance_sdk.exceptions import IllegalStateJump, AuthorityViolation, GovernanceError

app = Flask(__name__)
gov_client = GovernanceClient(governance_url="http://localhost:8000")

# Local Projection Storage (Dumb Synchronization Layer)
# In reality this connects to the projection SQLite DB
PROJECTION_DB = {
    "HUNT-44": {"id": "HUNT-44", "status": "VERIFIED", "details": "Porche GT3 RS"}
}

@app.before_request
def ensure_correlation_id():
    # Setup correlation ID across runtime
    g.correlation_id = request.headers.get("X-Correlation-ID", f"TRACE-{uuid.uuid4().hex[:8].upper()}")

@app.after_request
def append_correlation_id(response):
    response.headers["X-Correlation-ID"] = g.correlation_id
    return response

@app.route("/api/hunt/<hunt_id>/transition", methods=["POST"])
def transition_hunt(hunt_id):
    """
    Operational Intake Surface
    NO BUSINESS LOGIC OR STATUS MUTATION IN HERE.
    """
    data = request.json
    requested_transition = data.get("transition")
    actor = data.get("actor", "OPERATOR_1")
    authority_token = data.get("authority_token", "standard_auth")
    
    # 1. Fetch from dumb projection layer
    hunt = PROJECTION_DB.get(hunt_id)
    if not hunt:
        return jsonify({"error": "Hunt not found"}), 404

    # 2. Request Authority Transition via Governance SDK
    try:
        receipt = gov_client.request_transition(
            hunt_id=hunt_id,
            requested_transition=requested_transition,
            actor=actor,
            authority_token=authority_token,
            current_state=hunt["status"]
        )
    except IllegalStateJump as e:
        return jsonify({"error": "ILLEGAL_STATE_JUMP_REJECTED", "message": str(e)}), 422
    except AuthorityViolation as e:
        return jsonify({"error": "AUTHORITY_VIOLATION", "message": str(e)}), 403
    except GovernanceError as e:
        return jsonify({"error": "GOVERNANCE_ERROR", "message": str(e)}), 500

    # 3. Apply Receipt (Projection Commit)
    if receipt.approved:
        # dumb projection synchronization
        PROJECTION_DB[hunt_id]["status"] = receipt.next_state
        PROJECTION_DB[hunt_id]["last_evidence"] = receipt.evidence_id
        
        return jsonify({
            "message": "Transition Committed to Projection",
            "receipt": receipt.dict(),
            "projection_state": PROJECTION_DB[hunt_id]
        }), 200
        
    return jsonify({"error": "Transition not approved by Authority"}), 400

if __name__ == "__main__":
    app.run(port=5000, debug=True)
