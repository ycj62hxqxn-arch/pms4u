import json
from datetime import datetime

class Ledger:
    @staticmethod
    def append_event(event):
        # Append-only ledger
        with open('ledger/constitutional_ledger.jsonl', 'a') as f:
            f.write(json.dumps(event) + '\n')

# Example event structure:
# {
#   "event_type": "STATE_TRANSITION",
#   "entity": "hunt",
#   "entity_id": 44,
#   "from": "VERIFIED",
#   "to": "EXPORTED",
#   "verdict": "ALLOW",
#   "evidence_id": "EVID-8841",
#   "authority": "AUTH-CARSHUNTER-X92",
#   "timestamp": "2026-05-22T21:14:00Z",
#   "runtime_hash": "sha3..."
# }
