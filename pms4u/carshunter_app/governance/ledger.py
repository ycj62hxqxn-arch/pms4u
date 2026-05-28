import json
import os

class ImmutableEventLogger:
    """
    Optional locally observable event trace so the operational layer has 
    a localized paper-trail of receipts independent of the database.
    """
    def __init__(self, log_path="ledger.jsonl"):
        self.log_path = log_path

    def append_receipt(self, receipt_dict: dict):
        with open(self.log_path, "a") as f:
            f.write(json.dumps(receipt_dict) + "\n")
class Ledger:
    @staticmethod
    def append_event(event):
        # Require transition_id for every event
        assert 'transition_id' in event, "Every ledger event must have a transition_id."
        with open('ledger/constitutional_ledger.jsonl', 'a') as f:
            f.write(json.dumps(event) + '\n')

