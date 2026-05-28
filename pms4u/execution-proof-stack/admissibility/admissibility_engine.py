"""
Admissibility Engine: Evaluates execution requests for admissibility.
Outputs: ALLOW, HOLD, DENY, ESCALATE
"""

from enum import Enum

class AdmissibilityDecision(Enum):
    ALLOW = "allow"
    HOLD = "hold"
    DENY = "deny"
    ESCALATE = "escalate"


def evaluate_admissibility(context, authority, risk, state, dependencies, constraints, consequence_domain, correlation_id=None):
    """
    Realistic admissibility logic with correlation tracing.
    Returns: ALLOW, HOLD, DENY, ESCALATE
    """
    # Example logic (replace with real policy as needed)
    # - If risk is 'high', escalate
    # - If authority is missing, deny
    # - If context is missing required keys, hold
    # - If all checks pass, allow

    if not authority:
        return AdmissibilityDecision.DENY, correlation_id
    if risk == "high":
        return AdmissibilityDecision.ESCALATE, correlation_id
    if not context or not isinstance(context, dict) or "updated" not in context:
        return AdmissibilityDecision.HOLD, correlation_id
    # Example: if dependencies are unresolved, hold
    if dependencies and any(dep.get("status") != "ok" for dep in dependencies if isinstance(dep, dict)):
        return AdmissibilityDecision.HOLD, correlation_id
    # If admissibility state is inadmissible, deny
    if state == "inadmissible":
        return AdmissibilityDecision.DENY, correlation_id
    # If consequence domain is critical, escalate
    if consequence_domain == "critical":
        return AdmissibilityDecision.ESCALATE, correlation_id
    # Otherwise, allow
    return AdmissibilityDecision.ALLOW, correlation_id
