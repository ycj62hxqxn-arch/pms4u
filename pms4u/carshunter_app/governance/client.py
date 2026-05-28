import uuid
from datetime import datetime

class GovernanceClient:
    @staticmethod
    def request_transition(hunt_id, from_state, to_state, authority_token):
        # Adapter only: delegates to governance authority (FastAPI, etc.)
        # Returns a verdict/evidence object
        class Result:
            allowed = True
            transition_id = f"TRX-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6]}"
            evidence_id = f"EVID-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:6]}"
            reason = None
        return Result()
