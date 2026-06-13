# PMS4U Banking Demo

**Demo Objective:** Show how PMS4U prevents unauthorized financial workflow execution before consequence.  
**Audience:** Bank CTO, risk executive, compliance leader, innovation team, enterprise partner.  
**Demo Duration:** 3 to 5 minutes.

---

## Demo Scenario

A bank is deploying AI-assisted workflow automation for corporate account operations.

The AI assistant can prepare actions such as:

- Account review escalation.
- Payment hold recommendation.
- Credit file update.
- Compliance case routing.
- High-risk transaction approval request.

The risk: a correct-looking action may still be inadmissible because the actor lacks authority, the workflow is in the wrong state, or required evidence has not been sealed.

---

## Workflow Example

```text
CASE_OPENED
  -> KYC_REVIEWED
  -> RISK_FLAGGED
  -> COMPLIANCE_REVIEW
  -> SENIOR_APPROVAL_REQUIRED
  -> ACTION_APPROVED
  -> ACTION_EXECUTED
```

PMS4U governs the transition boundary. The AI or application may request a transition, but PMS4U decides whether it is admissible.

---

## Demo Act 1: Normal Governed Execution

**Request:** Move a corporate case from `RISK_FLAGGED` to `COMPLIANCE_REVIEW`.

**PMS4U checks:**

- Is the current state correct?
- Is the requested transition allowed?
- Does the actor have the required authority?
- Can evidence be sealed?

**Result:** Execution approved.

**Proof shown:**

- Execution receipt.
- Event hash.
- Evidence ID.
- State transition lineage.
- Replayable event trail.

---

## Demo Act 2: Unauthorized Jump Blocked

**Request:** Move directly from `RISK_FLAGGED` to `ACTION_EXECUTED`.

This skips compliance review and senior approval.

**PMS4U checks:**

- Current state: `RISK_FLAGGED`.
- Requested next state: `ACTION_EXECUTED`.
- Allowed transition: no.

**Result:** Execution blocked before mutation.

**Executive message:**

> PMS4U does not merely detect the violation. It prevents the unauthorized consequence.

---

## Demo Act 3: Authority Escalation Required

**Request:** Move from `SENIOR_APPROVAL_REQUIRED` to `ACTION_APPROVED`.

**Actor:** Standard operations user.

**PMS4U checks:**

- Transition is structurally allowed.
- Actor authority is insufficient.

**Result:** Execution frozen pending elevated authority.

**Executive message:**

> Access to the system is not the same as authority to execute this transition.

---

## Demo Act 4: Audit and Replay

After governed activity, PMS4U shows:

- What was requested.
- Who requested it.
- What state the case was in.
- Whether the transition was admissible.
- What evidence was sealed.
- Whether the final projection matches ledger truth.

**Executive message:**

> The bank can reconstruct execution authority in minutes instead of days.

---

## Buyer Value

Without PMS4U:

- AI agent overreach risk.
- Manual audit reconstruction.
- Approval bypass exposure.
- Weak confidence in autonomous workflow deployment.

With PMS4U:

- Runtime authority enforcement.
- Preventive execution control.
- Replayable evidence lineage.
- Faster audit readiness.
- Safer AI workflow deployment.

---

## Success Metrics for Pilot

| Metric | Target |
| --- | --- |
| Unauthorized transition prevention | 100% for governed paths |
| Evidence retrieval | Under 5 minutes |
| Replay accuracy | 100% for sealed events |
| Audit preparation | 50% to 80% reduction |
| AI workflow deployment confidence | Material increase after controlled pilot |

---

## Closing Line

PMS4U lets a bank deploy AI-assisted operations without giving AI unrestricted execution authority.
