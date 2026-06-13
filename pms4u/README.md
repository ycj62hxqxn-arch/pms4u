# Constitutional Execution Infrastructure (CEI)

**Category:** Constitutional Execution Infrastructure (CEI)  
**Standard:** Sovereign Execution Triad (SET)  
**Implementation:** PMS4U

**Runtime governance architecture for consequential autonomous execution.**

---

## Authority Before Execution

**No irreversible mutation may occur outside the constitutional execution boundary.**

---

![Runtime Constitutional Proof](/assets/demo_enforcement.gif)

[▶ Runtime Proof](/assets/demo_enforcement.mov)

---

## What This System Does

This repository is the canonical reference for **Constitutional Execution Infrastructure (CEI)**:  
All consequential execution requests are intercepted at runtime. The system enforces:

- **Admissibility** (is this execution constitutionally allowed?)
- **Authority integrity**
- **Contextual validity**
- **Consequence classification**
- **Execution boundary conditions**

If admissibility fails:

- Execution FREEZES (mutation is blocked)
- Evidence is SEALED
- Lineage is replayable
- Irreversible consequence is prevented

---

## Why This Is Different

Traditional governance = after-the-fact, audit, or observability.  
**CEI = runtime admissibility, before consequence.**

> **The application itself no longer possesses unrestricted mutation sovereignty.**

---

## What This Is NOT

PMS4U is **NOT**:

- an audit platform
- an observability layer
- a compliance dashboard
- a policy engine
- or retrospective governance software

**PMS4U governs execution itself.**  
It determines whether validated actions are constitutionally admissible before consequence becomes real.

---

## Canonical Proofs

- Governed mutation success
- Append-only evidence recording
- Controlled state transition
- Direct bypass rejection
- Immutable enforcement boundaries

---

## Core Doctrine

**Execution is admissible.**  
**Proof before power.**  
**Evidence before consequence.**  
**Authority before execution.**

---

## Architecture Snapshot

```
/app
/execution-proof-stack
/governance-core
/governance-sdk
/public/assets
/docs
README.md
WHITEPAPER.md
SOVEREIGN_STACK.md
```

---

## YAI Local Demo

YAI Local is available at `/yai`. It uses the integrated Next route at `/api/yai` by default, so the demo works with one local server.

### One-server setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://127.0.0.1:3000/yai`.

For a demo without an OpenAI key, leave `OPENAI_API_KEY=` empty. The route returns a local MCV fallback with a trace ID, mode-specific guidance, and a safe next step. No external model call is made.

For live OpenAI-backed answers:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1
```

Then restart `npm run dev`.

### Optional standalone YAI server

Use this only when you want the UI to call a separate local OpenAI bridge.

```bash
npm run dev:yai
npm run dev
```

Set this in `.env.local` before starting Next:

```bash
NEXT_PUBLIC_YAI_API_BASE=http://127.0.0.1:3001
YAI_ALLOWED_ORIGIN=http://127.0.0.1:3000
```

Health check:

```bash
curl -s http://127.0.0.1:3001/health
```

Operator demo flow:

1. Open `/yai`.
2. Select `Governance`, `Operator`, or `Technical`.
3. Use one of the starter prompts.
4. Confirm the response includes `source`, `model`, and a `YAI-...` trace ID.
5. If fallback mode is active, treat it as simulation only and do not execute external mutations.

---

## Public Deployment

Production: [pms4u.vercel.app](https://pms4u.vercel.app)

---

## Category Declaration

**This repository establishes the canonical reference for Constitutional Execution Infrastructure (CEI):**

> “No consequential execution may occur without runtime constitutional admissibility.”

---

For technical details, see [docs/DOCTRINE.md](/docs/DOCTRINE.md).
