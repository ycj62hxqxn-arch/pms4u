# evidence.py
# Evidence and lineage generation for governed transitions

import uuid

def generate_evidence_id(hunt_id, from_state, to_state):
    return f"EVID-{datetime.utcnow().strftime('%Y%m%d')}-{hunt_id}-{from_state[:3]}-{to_state[:3]}-{uuid.uuid4().hex[:6]}"
