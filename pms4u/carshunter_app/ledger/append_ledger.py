# append_ledger.py
# Append-only event ledger for all execution transitions

import json
from pathlib import Path

LEDGER_PATH = Path(__file__).parent / "execution-ledger.jsonl"

def append_ledger(event_record):
    with open(LEDGER_PATH, "a") as f:
        f.write(json.dumps(event_record) + "\n")
