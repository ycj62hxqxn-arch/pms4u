"""
Evidence-bound Execution Logic
Every consequential execution must have:
- evidence_id
- authority_chain
- runtime_hash
- execution_trace
- immutable_append
"""


import json
import os
import hashlib
from datetime import datetime

LEDGER_FILE = os.path.join(os.path.dirname(__file__), "evidence_ledger.jsonl")

def compute_hash(entry):
    return hashlib.sha256(json.dumps(entry, sort_keys=True).encode()).hexdigest()

def get_last_entry():
    if not os.path.exists(LEDGER_FILE):
        return None, None, 0
    with open(LEDGER_FILE, "r") as f:
        lines = f.readlines()
        if not lines:
            return None, None, 0
        last = json.loads(lines[-1])
        return last, last.get("current_hash"), len(lines)

def record_evidence(
    evidence_id,
    authority_chain,
    runtime_hash,
    execution_trace,
    correlation_id=None,
    verdict=None,
    reason=None,
    mutation_status=None,
    consequence_domain=None,
    seal_state=None
):
    """
    Append evidence to a local immutable ledger file (JSONL).
    Each entry includes correlation_id, verdict, reason, mutation_status, consequence_domain, prev_hash, current_hash, ledger_position, seal_state.
    """
    prev_entry, prev_hash, position = get_last_entry()
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "evidence_id": evidence_id,
        "authority_chain": authority_chain,
        "runtime_hash": runtime_hash,
        "execution_trace": execution_trace,
        "correlation_id": correlation_id,
        "verdict": verdict,
        "reason": reason,
        "mutation_status": mutation_status,
        "consequence_domain": consequence_domain,
        "prev_hash": prev_hash,
        "ledger_position": position + 1,
        "seal_state": seal_state or ("sealed" if verdict == "ALLOW" else "open")
    }
    entry["current_hash"] = compute_hash(entry)
    with open(LEDGER_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")
    # For demonstration, print the entry
    print(f"Evidence recorded: {json.dumps(entry, indent=2)}")
