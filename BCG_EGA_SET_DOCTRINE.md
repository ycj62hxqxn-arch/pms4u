# BCG → EGA → SET Doctrine Pack

## Purpose
Formalize the upstream-to-runtime governance stack so behavioural coherence and execution legitimacy are treated as connected but distinct layers.

---

## 1) `BCG` Definition and Invariants

`BCG` (Behavioural Continuity Governance) governs the pre-signal layer:

- incentive coherence
- commitment continuity
- actor identity stability
- intent traceability
- trust formation continuity

`BCG` does not approve execution. It shapes whether an arriving request should be considered behaviourally coherent before entering admissibility governance.

### `BCG` invariants

1. `Identity Continuity`: the requesting actor remains materially the same authority-bearing identity over time.
2. `Intent Continuity`: the declared objective has not drifted into a materially different objective.
3. `Context Continuity`: the contextual assumptions under which intent formed are still valid.
4. `Commitment Continuity`: previously declared obligations and constraints still bind the actor/request.
5. `Transparency Continuity`: enough provenance exists to explain how intent was formed.

If any invariant breaks, `BCG` emits a continuity fault before the request is admitted to downstream governance.

---

## 2) `BCG` → `EGA` Interface Contract

`EGA` remains the execution-governance sequence:

Signal → Authority → Admissibility → Execution → Impact

`BCG` sits upstream and emits a normalized pre-signal packet into `EGA`.

### Required handoff fields

- `bcg_status`: `COHERENT` | `DRIFTED` | `UNKNOWN`
- `continuity_score`: 0-100
- `identity_stability`: boolean
- `semantic_continuity`: boolean
- `context_consistency`: boolean
- `drift_reasons`: list[string]
- `bcg_evidence_ref`: id
- `bcg_timestamp`: ISO-8601

### Handoff rule

- `COHERENT` → continue into `EGA` authority and admissibility checks.
- `DRIFTED` → route to `DEFER` or `INTERRUPT` policy before execution eligibility.
- `UNKNOWN` → fail closed for high-consequence domains.

---

## 3) Continuity Failure Modes

### `Meaning Drift`
Authorized semantic target has changed without renewed authorization.

- Symptom: same request label, different operational meaning.
- Control: semantic continuity check + re-authorization trigger.

### `Identity Drift`
Actor continuity breaks (delegation swap, key/person mismatch, untracked role shift).

- Symptom: authority appears valid but identity provenance is unstable.
- Control: identity stability checks + signer lineage binding.

### `Context Drift`
Environmental assumptions changed after intent formation.

- Symptom: a previously admissible action now creates inadmissible risk.
- Control: runtime context consistency gate before commit.

### `Commitment Drift`
Previously accepted obligations are no longer honored at execution time.

- Symptom: request bypasses constraints declared earlier.
- Control: commitment re-validation against current policy graph.

---

## 4) Pilot Metric Set (Investor Proof)

Use one controlled high-consequence workflow.

### Upstream continuity metrics (`BCG`)

- `continuity_fault_rate` = continuity faults / total incoming intents
- `identity_drift_detection_rate`
- `semantic_drift_detection_rate`
- `context_drift_detection_rate`
- `mean_time_to_reconcile_continuity_fault`

### Execution governance metrics (`EGA` + `SET`)

- `pre-commit_intercept_count` (`DENY` + `FREEZE`)
- `unauthorized_execution_rate` (target: near-zero)
- `admissibility_recheck_hit_rate`
- `mean_approval_latency`
- `replay_verification_success_rate`

### Commercial proof metrics

- prevented exposure (currency, audited)
- evidence retrieval time (minutes vs days baseline)
- incident reconstruction time reduction
- audit preparation time reduction

---

## Canonical Stack Statement

`BCG` explains whether intent arrives coherently.

`EGA` and `SET` explain whether coherent intent may become operational consequence.

Replay and ledger evidence prove what was allowed, denied, or frozen, and why.

---

## Category Positioning

PMS4U is not only execution governance. It is a governance stack spanning:

Behaviour → Signal → Authority → Admissibility → Execution → Consequence → Evidence

This preserves the constitutional execution core while adding a formal upstream continuity layer.