import requests
import json
from .receipts import ExecutionReceipt
from .state_machine import validate_local_transition

class GovernanceRuntimeClient:
    def __init__(self, governance_url="http://localhost:8000"):
        self.governance_url = governance_url

    def request_transition(self, hunt_id: str, requested_transition: str, actor: str, authority_token: str, correlation_id: str = None, current_state: str = None) -> ExecutionReceipt:
        # Pre-validate locally to fail fast before network hop
        if current_state:
            validate_local_transition(current_state, requested_transition)

        payload = {
            "entity_id": hunt_id,
            "requested_transition": requested_transition,
            "actor": actor,
            "authority_token": authority_token,
            "reason": "Operational UI requested standard transition"
        }
        headers = {}
        if correlation_id:
            headers["X-Correlation-ID"] = correlation_id

        # Async Queue can be dropped in here later
        response = requests.post(
            f"{self.governance_url}/execution-request",
            json=payload,
            headers=headers,
            timeout=5.0
        )
        
        response.raise_for_status()
        data = response.json()
        
        # Adding timestamp safely mapping from receipt schema
        if "timestamp" not in data:
            import datetime
            data["timestamp"] = datetime.datetime.utcnow().isoformat() + "Z"
            
        return ExecutionReceipt(**data)
