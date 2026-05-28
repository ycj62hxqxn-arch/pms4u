"""
Canonical Execution Proof Demo
This script demonstrates the full constitutional execution flow:
- Request
- Admissibility evaluation
- Context change
- Admissibility reevaluation
- Execution (allow/deny/hold/escalate)
- Ledger append
- Evidence chain
- Failure handling
"""




from admissibility.admissibility_engine import evaluate_admissibility, AdmissibilityDecision
import uuid
from ledger.evidence import record_evidence
from failure.failure_constitution import handle_failure, FailureType
from governance_schema import load_constitution_schema, validate_execution_request
from boundary.enforcement import enforce_execution_boundary, BoundaryViolation
from constitutional_verdict import new_constitutional_verdict



# Step 1: Define execution request
execution_request = {
    "authority_origin": "AA",
    "intent_class": "update_record",
    "risk_class": "medium",
    "admissibility_state": "pending",
    "signer_chain": ["AA", "YAI", "AI"],
    "consequence_domain": "finance"
}

# Step 1.0: Validate execution request against constitutional schema
try:
    schema = load_constitution_schema()
    validate_execution_request(execution_request, schema)
    print("[Constitutional Contract] Execution request is valid.")
except Exception as e:
    print(f"[Constitutional Contract] INVALID EXECUTION REQUEST: {e}")
    exit(1)

# Step 1.1: Generate correlation ID
correlation_id = f"TRACE-{uuid.uuid4().hex[:8].upper()}"
print(f"X-Correlation-ID: {correlation_id}")

# Step 2: Initial admissibility evaluation
context = {}
authority = execution_request["authority_origin"]
risk = execution_request["risk_class"]
state = execution_request["admissibility_state"]
dependencies = []
constraints = {}
consequence_domain = execution_request["consequence_domain"]


# Step 2: Initial admissibility evaluation
decision, corr_id = evaluate_admissibility(
    context, authority, risk, state, dependencies, constraints, consequence_domain, correlation_id=correlation_id
)
print(f"Admissibility Decision: {decision.value} (Correlation-ID: {corr_id})")

# Step 3: Context change (simulate)
context["updated"] = True


# Step 4: Admissibility reevaluation
new_decision, corr_id2 = evaluate_admissibility(
    context, authority, risk, state, dependencies, constraints, consequence_domain, correlation_id=correlation_id
)
print(f"Admissibility Decision after context change: {new_decision.value} (Correlation-ID: {corr_id2})")

 # Step 5: Execution
if new_decision == AdmissibilityDecision.ALLOW:
    # Step 5.1: Enforce execution boundary before mutation
    try:
        enforce_execution_boundary(execution_request, new_decision.value)
        print("[Boundary Enforcement] Execution boundary check PASSED.")
    except BoundaryViolation as bv:
        print(f"[Boundary Enforcement] VIOLATION: {bv}")
        handle_failure(FailureType.CONTEXT_INVALIDATED, context)
        exit(1)
    # Step 6: Ledger append (evidence)
    evidence_id = f"evid-{uuid.uuid4().hex[:6]}"
    authority_chain = execution_request["signer_chain"]
    runtime_hash = "hash-abc"
    execution_trace = ["request", "evaluation", "context_change", "allow"]
    # Produce constitutional verdict artifact
    verdict_obj = new_constitutional_verdict(
        verdict="ALLOW",
        correlation_id=correlation_id,
        execution_id=evidence_id,
        request_id=correlation_id,
        authority_chain=authority_chain,
        authority_state="VALID",
        signer_threshold_met=True,
        escalation_required=False,
        context_hash="ctx-hash-1",
        context_version="v1.0",
        context_integrity="STABLE",
        drift_detected=False,
        admissible=True,
        mutation_state="COMMITTED",
        irreversible=True,
        target_domain="FINANCIAL",
        evidence_id=evidence_id,
        lineage_state="VALID",
        runtime_hash=runtime_hash,
        prev_hash=None,
        ledger_position=0,
        seal_state="SEALED",
        severity="MEDIUM",
        blast_radius="LOCAL",
        human_impact=False,
        financial_impact=True,
        regulatory_impact=False,
        boundary_triggered=False,
        freeze_activated=False,
        escalation_target=None,
        operator_intervention_required=False,
        replayable=True,
        replay_id=None,
        execution_trace=execution_trace,
        lineage_graph_ref=None,
        summary="Execution allowed. All constitutional checks passed.",
        blocking_reasons=[],
        admissibility_basis=["All checks passed"],
        constitutional_rules_applied=["ConstitutionalBoundary", "AdmissibilityEngine"]
    )
    print("[Constitutional Verdict Artifact]")
    import json
    print(json.dumps(verdict_obj, indent=2))
    record_evidence(
        evidence_id,
        authority_chain,
        runtime_hash,
        execution_trace,
        correlation_id=correlation_id,
        verdict="ALLOW",
        reason="All checks passed.",
        mutation_status="committed",
        consequence_domain=consequence_domain,
        seal_state="sealed"
    )
    print(f"Execution allowed and evidence recorded. (Correlation-ID: {correlation_id})")
elif new_decision == AdmissibilityDecision.DENY:
    record_evidence(
        f"evid-{uuid.uuid4().hex[:6]}",
        execution_request["signer_chain"],
        "hash-abc",
        ["request", "evaluation", "context_change", "deny"],
        correlation_id=correlation_id,
        verdict="DENY",
        reason="Authority or policy denied admissibility.",
        mutation_status="intercepted",
        consequence_domain=consequence_domain,
        seal_state="open"
    )
    print(f"Execution denied. (Correlation-ID: {correlation_id})")
elif new_decision == AdmissibilityDecision.HOLD:
    record_evidence(
        f"evid-{uuid.uuid4().hex[:6]}",
        execution_request["signer_chain"],
        "hash-abc",
        ["request", "evaluation", "context_change", "hold"],
        correlation_id=correlation_id,
        verdict="HOLD",
        reason="Context or dependencies incomplete.",
        mutation_status="frozen",
        consequence_domain=consequence_domain,
        seal_state="open"
    )
    print(f"Execution on hold. (Correlation-ID: {correlation_id})")
elif new_decision == AdmissibilityDecision.ESCALATE:
    record_evidence(
        f"evid-{uuid.uuid4().hex[:6]}",
        execution_request["signer_chain"],
        "hash-abc",
        ["request", "evaluation", "context_change", "escalate"],
        correlation_id=correlation_id,
        verdict="ESCALATE",
        reason="Risk or consequence domain requires escalation.",
        mutation_status="sealed",
        consequence_domain=consequence_domain,
        seal_state="open"
    )
    print(f"Execution escalated to operator. (Correlation-ID: {correlation_id})")
else:
    handle_failure(FailureType.ORCHESTRATION_FAILURE, context)
    print("Failure handled.")
    print("Failure handled.")
