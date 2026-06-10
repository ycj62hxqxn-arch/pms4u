"""
Batch test for Replay Reliability:
- Runs 10 transitions
- Checks evidence_id in ledger
- Runs replay for each evidence_id
- Prints summary (success/fail)
"""


# Ensure project root is in sys.path for imports
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from carshunter_app.services.transition_service import execute_transition
import json
import subprocess

LEDGER_PATH = Path(__file__).parent / "../carshunter_app/ledger/execution-ledger.jsonl"
REPLAY_PATH = Path(__file__).parent / "../carshunter_app/ledger/replay_lineage.py"

success = 0
fail = 0
results = []

for i in range(10):
    eid = f"TEST-{1000+i}"
    result, status = execute_transition(
        hunt_id=eid,
        from_state="INTAKE",
        to_state="VERIFIED",
        authority_token="TEST-AUTH",
        actor="TESTER"
    )
    evidence_id = result.get("evidence_id")
    print(f"Transition {i+1}: evidence_id={evidence_id}, status={status}")
    # Check in ledger
    found = False
    with open(LEDGER_PATH) as f:
        for line in f:
            if evidence_id and evidence_id in line:
                found = True
                break
    if not found:
        print(f"  ❌ Evidence {evidence_id} NOT found in ledger!")
        fail += 1
        continue
    # Run replay
    proc = subprocess.run([
        "python3", str(REPLAY_PATH), evidence_id
    ], capture_output=True, text=True)
    if proc.returncode == 0 and 'Replay failed' not in proc.stdout:
        print(f"  ✅ Replay succeeded for {evidence_id}")
        success += 1
    else:
        print(f"  ❌ Replay failed for {evidence_id}: {proc.stdout.strip()}")
        fail += 1
    results.append({"evidence_id": evidence_id, "replay": proc.stdout.strip()})

print("\n=== SUMMARY ===")
print(f"Success: {success}/10, Fail: {fail}/10")
for r in results:
    print(f"evidence_id: {r['evidence_id']}\nReplay: {r['replay']}\n")
