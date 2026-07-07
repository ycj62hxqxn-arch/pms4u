# PMS4U Platform Overview

## 1. Executive summary

PMS4U is a validation-phase **Runtime Governance Platform** for consequence-bearing execution.

Its purpose is to ensure that execution requests are evaluated **before** irreversible consequence occurs. Instead of treating governance as an after-the-fact reporting layer, PMS4U positions governance as a runtime boundary that determines whether execution is admissible, who has authority to request it, what evidence is required, and how the decision is sealed for later verification and replay.

Within this repository, PMS4U should be understood as an architecture-first reference implementation of:

- runtime authority resolution,
- admissibility evaluation,
- execution gating,
- evidence issuance and continuity,
- replayable governance lineage,
- and governed messaging-driven workflows.

A practical expression of this model is **Governed Execution over Messaging**: inbound messages are not treated as instructions to execute directly. They are treated as candidate execution events that must pass through authority, admissibility, evidence, and release controls before any downstream workflow proceeds.

This repository is therefore not only a web application or a collection of product surfaces. It is a governed runtime reference implementation designed to validate how operational messaging, workflow requests, and AI-assisted systems can be brought under a constitutional execution boundary.

---

## 2. Core governance stack

### Runtime Authority

The Runtime Authority layer determines **who** is requesting an action, **under what role**, and **with what standing**.

Its function is to prevent systems, users, or agentic workflows from assuming unrestricted execution rights by default. Instead, authority must be resolved explicitly at runtime and attached to the request context.

Representative responsibilities:

- actor identification,
- role resolution,
- request provenance,
- authority traceability,
- authority mismatch detection.

The core principle is simple: **no consequential execution should proceed without runtime authority context**.

### Admissibility Engine

The Admissibility Engine determines whether a requested execution is constitutionally allowed within the current context.

This goes beyond validation of syntax or business rules. It asks whether the request is admissible under the declared runtime conditions, available evidence, authority posture, and consequence boundary.

Representative responsibilities:

- classify the requested action,
- evaluate runtime policy conditions,
- assess evidence sufficiency,
- distinguish safe planning from irreversible mutation,
- block inadmissible execution before consequence.

The Admissibility Engine is where governance moves from passive observation to active runtime decisioning.

### Execution Gate

The Execution Gate is the operational boundary that either releases or blocks execution after authority and admissibility checks are complete.

It exists to ensure that downstream systems do not act solely because a message arrived, an API was called, or an agent produced a plausible instruction. Execution must be gated.

Representative responsibilities:

- hold or release execution,
- enforce mutation boundaries,
- prevent bypass of runtime governance,
- preserve blocked decisions as evidence-bearing events,
- attach runtime outcomes to downstream workflows.

In practical terms, this is the point where a request becomes:

- allowed,
- deferred,
- blocked,
- or escalated for human release authority.

### Evidence Spine

The Evidence Spine preserves what was requested, what was evaluated, what was allowed or denied, and what proof material was produced during runtime handling.

It is not limited to logging. It is intended to preserve governance-relevant state so that decisions can be verified, replayed, and reasoned about later.

Representative responsibilities:

- evidence object creation,
- hash continuity,
- media attachment handling,
- receipt issuance,
- ledger append and continuity,
- correlation across request, decision, and outcome.

In the messaging use case, each inbound message can become an evidence-bearing governance event.

### Constitutional Layer

The Constitutional Layer defines the doctrine and release discipline under which the platform operates.

It is the layer that preserves the difference between a feature implementation and a governance system. It establishes that runtime interception, evidence issuance, replayability, and authority traceability are architectural obligations rather than optional product features.

Representative responsibilities:

- define execution doctrine,
- preserve claim discipline,
- constrain release behavior,
- separate public surfaces from runtime infrastructure,
- enforce architecture-level boundaries across projects and domains.

This layer is what keeps PMS4U aligned as a governance platform rather than a collection of disconnected automations.

### Reference Implementations

The repository also contains reference implementations that demonstrate how the governance model can be applied across different surfaces and domains.

Examples include:

- GTCS4U public surface,
- CARSHUNTER governed automotive workflow surfaces,
- investor and technical reporting routes,
- YAI and operator-oriented interfaces,
- governed inbound messaging and webhook flows.

These references are not the platform itself. They are applied demonstrations of the platform model.

---

## 3. Governed Execution over Messaging flow

The messaging pattern should not be described as “AI connected to WhatsApp” or “a chatbot with a webhook.”

The more accurate architecture framing is:

**Governed Execution over Messaging**

```text
Messaging Surface
        │
        ▼
Identity & Authority
        │
        ▼
Admissibility Engine
        │
        ▼
Execution Gate
        │
        ▼
Evidence Receipt
        │
        ▼
Business Workflow / Agent Runtime
```

Under this model:

1. a message arrives from an external surface,
2. the sender and request context are resolved,
3. the request is evaluated for admissibility,
4. execution is gated,
5. evidence is issued,
6. only then may a downstream workflow or agent receive a released execution context.

This pattern is especially useful for demonstrating PMS4U in operational settings where messages often appear authoritative but should not be trusted as execution rights by default.

---

## 4. Repository-by-role map

This repository contains multiple layers of the PMS4U reference implementation. The clearest way to read it is by role rather than by file list.

### Runtime and governance

- `governance-core/`  
  Constitutional runtime services, authority handling, replay paths, verification logic, and governance-facing APIs.

- `governance-sdk/`  
  Shared contracts, receipt models, UI normalization surfaces, and cross-service governance state definitions.

- `execution-proof-stack/`  
  Minimal proof gateway and evidence flow components used to demonstrate proof issuance and lineage.

### Public and operator-facing application surfaces

- `app/`  
  Next.js application routes for public pages, investor surfaces, GTCS4U, YAI, console experiences, and messaging-adjacent runtime interfaces.

- `public/`  
  Static public assets, one-off campaign artifacts, and presentation material required by the web surfaces.

### Reference business implementations

- `carshunter_app/`  
  Governed automotive workflow implementation used to demonstrate runtime governance in sourcing and transition contexts.

- `operations-core/`  
  Operational service components and supporting systems that remain distinct from the primary PMS4U public app.

### Architecture and doctrine artifacts

- root-level doctrine and report documents  
  Whitepapers, release-control rules, architecture maps, evidence examples, investor-safe technical framing, and boundary-setting material.

This split helps evaluators understand that the repository contains both the constitutional runtime and the surfaces that exercise it.

---

## 5. Example governed message lifecycle

A representative message lifecycle for CARSHUNTER-style inbound messaging looks like this:

1. **Inbound message received**  
   A message arrives from a messaging surface with listing-style content, media, or operational instruction.

2. **Identity and source context captured**  
   The system captures sender information, channel metadata, timestamp, correlation identifiers, and raw request context.

3. **Authority posture resolved**  
   The runtime determines whether the sender is recognized, what role is asserted, and whether the request has any standing to advance beyond intake.

4. **Admissibility evaluation performed**  
   The message is classified. If it is only planning-safe, it may be allowed into a non-mutating path. If it implies real-world action, it may be held or blocked unless evidence and release conditions are met.

5. **Execution gate applied**  
   The runtime either blocks, defers, or releases the request. No downstream execution should occur solely because a message was received.

6. **Evidence object issued**  
   Text, media, hashes, verification status, and runtime decision context are preserved as a governance event.

7. **Receipt and trace material produced**  
   The decision outcome is linked to a receipt, trace hashes, and replayable proof context.

8. **Released workflow continues only if allowed**  
   If the gate releases the request, the downstream business workflow or agent receives a bounded execution context rather than an unrestricted command.

This lifecycle is central to the PMS4U messaging demonstration because it shows governance operating before consequence.

---

## 6. Evidence receipt model

The evidence receipt model is intended to make runtime decisions inspectable and replayable.

A typical evidence-bearing event may include:

- evidence identifier,
- correlation identifier,
- sender or actor reference,
- timestamp,
- normalized request text,
- attached media references,
- SHA-256 or equivalent content hash,
- verification status,
- runtime decision,
- policy or admissibility pack reference,
- gate hash,
- evidence hash,
- final receipt hash,
- issuance timestamp,
- lineage or ledger location.

This model supports several outcomes at once:

- governance decisions become attributable,
- blocked actions still become valuable proof events,
- replay can verify the decision path,
- enterprise reviewers can see that the system is preserving runtime integrity rather than only user-facing outcomes.

The evidence receipt is therefore not just a debug artifact. It is a proof object within the execution architecture.

---

## 7. Enterprise use cases

PMS4U, as represented here, can be evaluated against several enterprise-oriented use cases.

### Governed AI-assisted operations

Requests originating from AI-assisted systems can be forced through authority, admissibility, and evidence checks before external consequence is allowed.

### Messaging-driven workflow intake

Operational requests arriving from messaging surfaces can be transformed from untrusted conversational input into governed runtime events.

### Sensitive execution environments

Where the cost of unauthorized or irreversible mutation is high, execution gating can separate planning from commitment.

### Replayable governance and auditability

Teams can reconstruct what happened, why it happened, and what evidence supported the runtime decision.

### Multi-surface governance consistency

The same constitutional posture can be exercised across public sites, operator consoles, AI surfaces, and workflow-specific reference implementations.

This repository should not be presented as finished production infrastructure. It is better described as a **validation-phase reference implementation** showing how runtime governance concepts can be made operational in real software surfaces.

---

## 8. Roadmap

The most useful next steps are those that make the runtime model easier to observe, easier to demonstrate, and easier to evaluate.

### Admin dashboard

A dashboard should expose inbound governance events, verification status, forwarding status, evidence IDs, receipts, and runtime outcomes. This would make the messaging flow legible for operators, investors, and technical reviewers.

### Telegram bridge

A Telegram bridge provides the fastest governed messaging demo path with relatively low setup friction. It is a strong candidate for near-term demonstration value.

### Meta WhatsApp bridge

A Meta WhatsApp path is the more serious production-facing messaging option. It is appropriate once the operator-facing visibility and evidence handling patterns are settled.

### Load benchmarks

Benchmarking should measure validation-phase runtime characteristics such as webhook throughput, evidence issuance latency, replay cost, and bounded execution decision time.

### Intervention-rich scenarios

The strongest validation scenarios are those where the runtime blocks, defers, or escalates requests rather than only allowing them. Intervention-rich examples better demonstrate the architectural value of runtime governance.

---

## Closing note

PMS4U should be read as a runtime governance architecture with reference implementations attached to it.

The operative idea is not merely that AI or messaging can trigger workflows. The operative idea is that workflows, agentic systems, and inbound requests can be brought under a constitutional execution boundary where authority, admissibility, evidence, and release control are resolved before consequence becomes real.

That is the basis on which PMS4U should be evaluated during this validation phase.
