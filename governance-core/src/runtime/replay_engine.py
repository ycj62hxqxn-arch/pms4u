import json
import os
from typing import Dict, Any, List
from src.runtime.integrity_validator import IntegrityValidator
from src.api.crypto_verification import verifier
from governance_sdk.states import ALLOWED_TRANSITIONS

class ReplayEngine:
    def __init__(self, ledger_path: str = "authoritative_ledger.jsonl"):
        self.ledger_path = ledger_path
        # We parse the enum keys into strings to make the dictionary check simpler
        self.allowed_transitions = {
            k.value: [v.value for v in vals] 
            for k, vals in ALLOWED_TRANSITIONS.items()
        }
        self.validator = IntegrityValidator(verifier)

    def replay_all(self) -> Dict[str, Any]:
        """
        Re-execute all signed transitions sequentially from the JSONL ledger.
        This represents the absolute Constitutional Truth, isolated from the DB cache.
        Returns the reconstructed state dictionary.
        """
        reconstructed_state: Dict[str, Any] = {}
        entity_hashes: Dict[str, str] = {}

        if not os.path.exists(self.ledger_path):
            return reconstructed_state

        with open(self.ledger_path, "r") as f:
            for line_no, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue
                try:
                    event = json.loads(line)
                    entity_id = event["entity_id"]
                    
                    # Assume initial state (INTAKE usually, but here we expect the 'from' state to match)
                    current_state = reconstructed_state.get(entity_id, {}).get("state", event.get("from"))
                    prev_hash = entity_hashes.get(entity_id, event.get("previous_hash"))
                    
                    # Validate Integrity
                    self.validator.validate_transition(
                        event=event, 
                        current_state=current_state, 
                        allowed_transitions=self.allowed_transitions,
                        expected_previous_hash=prev_hash
                    )
                    
                    # Apply State Morph
                    reconstructed_state[entity_id] = {
                        "state": event["to"],
                        "version": reconstructed_state.get(entity_id, {}).get("version", 0) + 1,
                        "last_updated": event["timestamp"],
                        "last_hash": event["hash"],
                        "correlation_id": event["correlation_id"]
                    }
                    
                    # Update hash chain tracking for the next event for this entity
                    entity_hashes[entity_id] = event["hash"]
                    
                except ValueError as ve:
                    raise RuntimeError(f"Replay Integrity Failure at line {line_no} for entity {entity_id}: {ve}")
                except Exception as e:
                    raise RuntimeError(f"Unexpected Replay Error at line {line_no}: {e}")

        return reconstructed_state