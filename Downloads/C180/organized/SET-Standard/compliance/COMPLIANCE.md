# SET Compliance Certification

This document defines what qualifies as SET-compliant.

## Certification Rule

A system is compliant only if:

- Execution authority exclusively governs all transitions.
- No bypass mechanisms exist.
- Verification cannot trigger execution.
- Invariance cannot be violated.

## Certification Levels

### Level 0 - Non-Compliant

System allows execution outside authority.

### Level 1 - Partial

Authority exists but is not enforced universally.

### Level 2 - Compliant

All transitions pass through execution authority.

### Level 3 - Strict

- Immutable logs
- Reject-by-default execution
- Full audit traceability

## Invalid Systems

Any system that:

- Executes without authority
- Treats validation as execution

is non-SET.

## Certification Statement

"SET-compliant" is a claim of execution integrity, not architecture style.
