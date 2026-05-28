from governance.client import GovernanceClient
from repositories.hunt_repository import HuntRepository

class TransactionService:
    @staticmethod
    def export_hunt(hunt_id, from_state, to_state, authority_token):
        # Request transition from governance
        verdict = GovernanceClient.request_transition(
            hunt_id=hunt_id,
            from_state=from_state,
            to_state=to_state,
            authority_token=authority_token
        )
        if getattr(verdict, "allowed", False):
            # Only commit if governance allows
            HuntRepository.commit_export(hunt_id)
            # Append to ledger
            from governance.ledger import Ledger
            event = {
                "transition_id": getattr(verdict, "transition_id", None),
                "evidence_id": getattr(verdict, "evidence_id", None),
                "hunt_id": hunt_id,
                "from": from_state,
                "to": to_state,
                "verdict": "ALLOW",
                "mutation_committed": True
            }
            Ledger.append_event(event)
            return {
                "status": "exported",
                "transition_id": getattr(verdict, "transition_id", None),
                "evidence_id": getattr(verdict, "evidence_id", None)
            }
        else:
            return {
                "status": "blocked",
                "reason": getattr(verdict, "reason", "Not allowed")
            }
