"""
Constitutional Execution Gateway (MVP)
A minimal, product-ready gateway for intercepting and adjudicating consequential execution requests.

API:
- evaluate_request(...): returns ConstitutionalVerdict object
- freeze_execution(...): triggers constitutional freeze event
- get_evidence_lineage(...): returns lineage graph for a given execution/event
"""
import uuid
from constitutional_verdict import new_constitutional_verdict
from admissibility.admissibility_engine import evaluate_admissibility, AdmissibilityDecision
from boundary.enforcement import enforce_execution_boundary, BoundaryViolation
from ledger.evidence import record_evidence
from failure.failure_constitution import handle_failure, FailureType
from datetime import datetime

class ConstitutionalExecutionGateway:
    def __init__(self, domain="FINANCIAL"):
        self.domain = domain

    def evaluate_request(self, execution_request, context=None, dependencies=None, constraints=None):
        context = context or {}
        dependencies = dependencies or []
        constraints = constraints or {}
        correlation_id = f"TRACE-{uuid.uuid4().hex[:8].upper()}"
        execution_id = f"exec-{uuid.uuid4().hex[:8]}"
        request_id = correlation_id
        # Step 1: Admissibility
        authority = execution_request.get("authority_origin")
        risk = execution_request.get("risk_class")
        state = execution_request.get("admissibility_state")
        consequence_domain = execution_request.get("consequence_domain", self.domain)
        signer_chain = execution_request.get("signer_chain", [])
        decision, _ = evaluate_admissibility(
            context, authority, risk, state, dependencies, constraints, consequence_domain, correlation_id=correlation_id
        )
        # Step 2: Boundary enforcement
        bv = None
        try:
            enforce_execution_boundary(execution_request, decision.value)
            boundary_ok = True
        except BoundaryViolation as err:
            boundary_ok = False
            bv = err
        # Step 3: Verdict object
        verdict_obj = new_constitutional_verdict(
            verdict=decision.value.upper() if boundary_ok else "FREEZE",
            correlation_id=correlation_id,
            execution_id=execution_id,
            request_id=request_id,
            authority_chain=signer_chain,
            authority_state="VALID" if authority else "MISSING",
            signer_threshold_met=len(signer_chain) >= 2,
            escalation_required=decision == AdmissibilityDecision.ESCALATE,
            context_hash="ctx-hash-1",
            context_version="v1.0",
            context_integrity="STABLE",
            drift_detected=not boundary_ok,
            drift_reason=[str(bv)] if (not boundary_ok and bv) else [],
            admissible=decision == AdmissibilityDecision.ALLOW and boundary_ok,
            mutation_state="COMMITTED" if decision == AdmissibilityDecision.ALLOW and boundary_ok else "FROZEN",
            irreversible=decision == AdmissibilityDecision.ALLOW and boundary_ok,
            target_domain=consequence_domain.upper(),
            evidence_id=execution_id,
            lineage_state="VALID",
            runtime_hash="hash-abc",
            prev_hash=None,
            ledger_position=0,
            seal_state="SEALED" if decision == AdmissibilityDecision.ALLOW and boundary_ok else "PENDING",
            severity="MEDIUM",
            blast_radius="LOCAL",
            human_impact=False,
            financial_impact=consequence_domain.upper() == "FINANCIAL",
            regulatory_impact=False,
            boundary_triggered=not boundary_ok,
            freeze_activated=not boundary_ok,
            escalation_target=None,
            operator_intervention_required=decision == AdmissibilityDecision.ESCALATE or not boundary_ok,
            replayable=True,
            replay_id=None,
            execution_trace=["request", "evaluation", "boundary", decision.value.lower()],
            lineage_graph_ref=None,
            summary=f"Execution {decision.value.upper()} (boundary_ok={boundary_ok})",
            blocking_reasons=[str(bv)] if (not boundary_ok and bv) else [],
            admissibility_basis=["All checks passed" if decision == AdmissibilityDecision.ALLOW else "Policy restriction"],
            constitutional_rules_applied=["ConstitutionalBoundary", "AdmissibilityEngine"]
        )
        # Step 4: Evidence
        record_evidence(
            execution_id,
            signer_chain,
            "hash-abc",
            ["request", "evaluation", "boundary", decision.value.lower()],
            correlation_id=correlation_id,
            verdict=verdict_obj["verdict"],
            reason=verdict_obj["constitutional_reasoning"]["summary"],
            mutation_status=verdict_obj["mutation"]["mutation_state"],
            consequence_domain=consequence_domain,
            seal_state=verdict_obj["evidence"]["seal_state"]
        )
        return verdict_obj

    def freeze_execution(self, reason, context=None):
        context = context or {}
        context["frozen"] = True
        handle_failure(FailureType.CONTEXT_INVALIDATED, context)
        return {
            "event": "FREEZE",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "reason": reason,
            "context": context
        }

    def get_evidence_lineage(self, execution_id):
        # Placeholder: In a real system, this would traverse the immutable ledger and build a graph
        return {
            "execution_id": execution_id,
            "lineage": [
                {"stage": "request", "hash": "..."},
                {"stage": "admissibility", "hash": "..."},
                {"stage": "boundary", "hash": "..."},
                {"stage": "mutation", "hash": "..."},
                {"stage": "evidence", "hash": "..."}
            ]
        }
