"""
Execution Boundary Enforcement
No irreversible mutation may occur outside the Constitutional Execution Boundary.
This module enforces the constitutional boundary for all execution events.
"""

class BoundaryViolation(Exception):
    pass

def enforce_execution_boundary(execution_request, admissibility_decision):
    """
    Enforces that no mutation or execution occurs outside the constitutional boundary.
    Only ALLOW decisions with valid authority, intent, and signer_chain may proceed.
    Raises BoundaryViolation if enforcement fails.
    """
    # Check admissibility
    if admissibility_decision != "allow":
        raise BoundaryViolation(f"Execution not admissible: {admissibility_decision}")
    # Check authority
    if not execution_request.get("authority_origin"):
        raise BoundaryViolation("Missing authority_origin in execution request.")
    # Check intent
    if not execution_request.get("intent_class"):
        raise BoundaryViolation("Missing intent_class in execution request.")
    # Check signer chain
    signer_chain = execution_request.get("signer_chain", [])
    if not signer_chain or not isinstance(signer_chain, list) or len(signer_chain) < 2:
        raise BoundaryViolation("Signer chain must have at least two signers.")
    # Passed all checks
    return True
