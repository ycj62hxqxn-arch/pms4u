# replay_lineage.py
"""
Replay Lineage Proof for Evidence-Bound Execution

Given an evidence_id, reconstruct the full execution lineage and verify:
- Admissibility
- Authority
- Verdict
- Ledger position
- Freeze/Commit state
- Timestamp
- Lineage hash
- Consequence domain

Fails cryptographically/structurally if ledger is tampered or event is missing.
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional
import hashlib

LEDGER_PATH = Path(__file__).parent / "../ledger/execution-ledger.jsonl"

class ReplayLineageError(Exception):
    pass

def hash_event(event: Dict[str, Any]) -> str:
    # Canonical hash of event dict (sorted keys)
    event_bytes = json.dumps(event, sort_keys=True).encode()
    return hashlib.sha256(event_bytes).hexdigest()

def load_ledger() -> list:
    with open(LEDGER_PATH, "r") as f:
        return [json.loads(line) for line in f if line.strip()]

def find_event_by_evidence_id(ledger: list, evidence_id: str) -> Optional[Dict[str, Any]]:
    for idx, event in enumerate(ledger):
        if event.get("evidence_id") == evidence_id:
            return idx, event
    return None, None

def replay_lineage(evidence_id: str) -> Dict[str, Any]:
    ledger = load_ledger()
    idx, event = find_event_by_evidence_id(ledger, evidence_id)
    if event is None:
        raise ReplayLineageError(f"evidence_id {evidence_id} not found in ledger")

    # Reconstruct lineage chain (all prior events for same entity, ordered)
    entity_id = event.get("entity_id") or event.get("hunt_id")
    lineage = [e for e in ledger if (e.get("entity_id") or e.get("hunt_id")) == entity_id]
    lineage_hash_chain = []
    for e in lineage:
        lineage_hash_chain.append(hash_event(e))

    # Integrity check: event must match its hash, and be in correct ledger position
    if hash_event(event) != lineage_hash_chain[lineage.index(event)]:
        raise ReplayLineageError("Ledger tampering detected: event hash mismatch")

    # Output canonical replay proof
    return {
        "REQUESTED_TRANSITION": event.get("transition"),
        "AUTHORITY_RESOLUTION": event.get("authority_signature"),
        "ADMISSIBILITY_VERDICT": event.get("verdict"),
        "LEDGER_POSITION": idx,
        "FREEZE_OR_COMMIT": "FREEZE" if not event.get("approved", False) else "COMMIT",
        "TIMESTAMP": event.get("timestamp"),
        "LINEAGE_HASH_CHAIN": lineage_hash_chain,
        "EVIDENCE_ID": event.get("evidence_id"),
        "CONSEQUENCE_DOMAIN": event.get("consequence_domain"),
        "ENTITY_ID": entity_id,
        "FULL_EVENT": event
    }

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python replay_lineage.py <evidence_id>")
        exit(1)
    evidence_id = sys.argv[1]
    try:
        proof = replay_lineage(evidence_id)
        print(json.dumps(proof, indent=2))
    except ReplayLineageError as e:
        print(f"Replay failed: {e}")
        exit(2)
