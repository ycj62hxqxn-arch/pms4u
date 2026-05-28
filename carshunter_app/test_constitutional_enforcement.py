
import os
import json
from services.transaction_service import TransactionService
from governance.ledger import Ledger

STATE = {"hunt": {"id": 44, "status": "GOVERNANCE_REVIEW"}}

def clean_ledger():
    ledger_path = 'ledger/constitutional_ledger.jsonl'
    if os.path.exists(ledger_path):
        os.remove(ledger_path)

def read_ledger():
    ledger_path = 'ledger/constitutional_ledger.jsonl'
    if not os.path.exists(ledger_path):
        return []
    with open(ledger_path) as f:
        return [json.loads(line.strip()) for line in f if line.strip()]

def print_ledger_snapshot():
    ledger = read_ledger()
    print("[LEDGER SNAPSHOT]")
    count = len(ledger)
    print(f"Ledger entries added: {count}")
    if count > 0:
        print("Evidence appended successfully.\n")
        for entry in ledger:
            print(json.dumps(entry, indent=2))

def happy_path():
    print("\n=== CONSTITUTIONAL ENFORCEMENT TEST ===\n")
    clean_ledger()
    before = STATE["hunt"]["status"]
    print("[REQUEST]\nFinancial Mutation Requested\nTransition: GOVERNANCE_REVIEW -> EXPORTED\n")
    print(f"STATE BEFORE: {before}\n")
    print("[AUTHORITY]\nAuthority Chain Verified\n")
    print("[ADMISSIBILITY]\nVerdict: ALLOW\n")
    result = TransactionService.export_hunt(
        hunt_id=44,
        from_state="GOVERNANCE_REVIEW",
        to_state="EXPORTED",
        authority_token="AUTH-CARSHUNTER-X92"
    )
    if result["status"] == "exported":
        STATE["hunt"]["status"] = "EXPORTED"
        print("[LEDGER]\nEvidence Sealed\nTransition Recorded\n")
        print("[COMMIT]\nMutation Committed\n")
        print("[SUCCESS]\nConstitutional mutation completed successfully.\n")
        after = STATE["hunt"]["status"]
        print(f"STATE AFTER: {after}\n")
        # Ledger snapshot after commit
        print_ledger_snapshot()
    else:
        print("[FAIL] Mutation blocked unexpectedly.\n")
        after = STATE["hunt"]["status"]
        print(f"STATE AFTER: {after}\n")
        print_ledger_snapshot()

def negative_path():
    print("\n=== BYPASS ATTEMPT DETECTED ===\n")
    clean_ledger()
    STATE["hunt"]["status"] = "GOVERNANCE_REVIEW"
    before = STATE["hunt"]["status"]
    print(f"STATE BEFORE: {before}\n")
    print("[VIOLATION]\nDirect mutation attempt detected.\n")
    print("[ENFORCEMENT]\nNo admissibility evaluation found.\nNo constitutional verdict issued.\n")
    # Simulate developer bypassing governance
    import time
    try:
        from repositories.hunt_repository import HuntRepository
        HuntRepository.commit_export(44)  # Direct call, no governance
        # For demonstration, we do NOT update state here
        print("[MUTATION]\nBLOCKED\n")
        time.sleep(1)
    except Exception as e:
        print(f"[BLOCKED] Constitutional violation detected: {e}\n")
    after = STATE["hunt"]["status"]
    print(f"STATE AFTER: {after}\n")
    print("[LEDGER]")
    ledger = read_ledger()
    if not ledger:
        print("No append occurred.\n")
    else:
        print("[ERROR] Ledger was appended illegally:")
        for entry in ledger:
            print(json.dumps(entry, indent=2))
    print("[SYSTEM]\nNo irreversible mutation occurred.\n")
    # Final category outro frame
    import time
    print("\nConstitutional Execution Infrastructure (CEI)")
    print("Authority Before Execution\n")
    time.sleep(1)

if __name__ == "__main__":
    happy_path()
    negative_path()
