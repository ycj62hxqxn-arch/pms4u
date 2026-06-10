import hashlib
from datetime import datetime
import uuid
import json
from src.db.models import ExecutionEvent
from src.api.crypto_verification import verifier
from sqlalchemy.orm import Session

class EventSourcedLedger:
    def __init__(self, db_session: Session):
        self.db = db_session

    def append_event(self, entity_id: str, previous_state: str, next_state: str, actor_id: str, authority_level: str, evidence_id: str, transition_id: str):
        # 1. Fetch previous hash
        prev_event = self.db.query(ExecutionEvent).filter_by(entity_id=entity_id).order_by(ExecutionEvent.created_at.desc()).first()
        prev_hash = prev_event.event_hash if prev_event else "GENESIS"

        # 2. Compute canonical Payload
        timestamp = datetime.utcnow().isoformat()
        payload = {
            "entity_id": entity_id,
            "previous_state": previous_state,
            "next_state": next_state,
            "actor_id": actor_id,
            "authority_level": authority_level,
            "evidence_id": evidence_id,
            "transition_id": transition_id,
            "previous_event_hash": prev_hash,
            "timestamp": timestamp
        }

        # 3. Hash Event Data
        canonical_str = json.dumps(payload, sort_keys=True)
        event_hash = hashlib.sha256(canonical_str.encode()).hexdigest()

        # 4. Sign Event 
        # (Assuming the runtime itself has signing keys to act as execution authority)
        signature = verifier.sign_payload(event_hash)

        # 5. Create Event Record
        new_event = ExecutionEvent(
            event_id=str(uuid.uuid4()),
            entity_type="governed_asset", # Generic fallback
            entity_id=entity_id,
            previous_state=previous_state,
            next_state=next_state,
            actor_id=actor_id,
            authority_level=authority_level,
            evidence_id=evidence_id,
            transition_id=transition_id,
            event_hash=event_hash,
            previous_event_hash=prev_hash,
            event_signature=signature
        )

        self.db.add(new_event)
        self.db.commit()
        self.db.refresh(new_event)
        
        return new_event
