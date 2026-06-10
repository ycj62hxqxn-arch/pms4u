# transition.py
# Defines the /transition endpoint for governed state changes

bp = Blueprint("transition", __name__)
from flask import Blueprint, request, jsonify
from services.transition_service import execute_transition

bp = Blueprint("transition", __name__)

@bp.route("/transition", methods=["POST"])
def transition_route():
    data = request.json
    required = ["hunt_id", "from_state", "to_state", "authority_token"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    # Canonical contract fields
    actor = data.get("actor", "SYSTEM")
    correlation_id = request.headers.get("X-Correlation-ID")
    current_state = data.get("from_state")

    result, status = execute_transition(
        hunt_id=data["hunt_id"],
        from_state=data["from_state"],
        to_state=data["to_state"],
        authority_token=data["authority_token"],
        actor=actor,
        correlation_id=correlation_id,
        current_state=current_state
    )
    return jsonify(result), status
