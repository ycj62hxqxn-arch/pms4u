from carshunter_app.governance.governance_client import GovernanceRuntimeClient

class HuntService:
    @staticmethod
    def export():
        # Example: get hunt info, authority, etc.
        # ...
        # Call governance client for transition
        # Canonical runtime path: use GovernanceRuntimeClient only
        governance_client = GovernanceRuntimeClient(governance_url="http://localhost:8000")
        result = governance_client.request_transition(
            hunt_id=44,
            from_state="VERIFIED",
            to_state="EXPORTED",
            authority_token="..."
        )
        if result.allowed:
            # Commit via repository only if allowed
            from repositories.hunt_repository import HuntRepository
            HuntRepository.commit_export(44)
            return {"status": "exported", "evidence_id": result.evidence_id}
        else:
            return {"status": "blocked", "reason": result.reason}
