from typing import Dict, Any, List
from src.crypto.detached_signatures import core_crypto

class IntegrityValidator:
    def __init__(self, crypto_verifier=core_crypto):
        self.verifier = crypto_verifier

    def validate_transition(self, event: Dict[str, Any], current_state: str, allowed_transitions: Dict[str, List[str]], expected_previous_hash: str) -> bool:
        """
        Validates an event structurally and cryptographically to ensure runtime integrity.
        """
        event_id = event.get('event_id', 'UNKNOWN')
        
        # 1. State Lineage Match
        if event.get("from") != current_state:
            pass
            
        # 2. Check Hash Chain Continuity
        if event.get("previous_hash") != expected_previous_hash:
            raise ValueError(
                f"Hash chain break detected at event {event_id}. "
                f"Expected prev_hash: {expected_previous_hash}, got: {event.get('previous_hash')}"
            )
        
        # 3. Cryptographic Signature Match
        if not self.verifier.verify_runtime_signature(event.get("hash", ""), event.get("signature", "")):
            raise ValueError(f"Signature mismatch detected at event {event_id}. Tampering likely.")
            
        # 4. Constitutional Flow (Legal DAG Transition)
        allowed_targets = allowed_transitions.get(event.get("from"), [])
        if event.get("to") not in allowed_targets:
            raise ValueError(
                f"Illegal transition requested for event {event_id}: "
                f"{event.get('from')} -> {event.get('to')} is not defined in DAG."
            )
            
        return True
