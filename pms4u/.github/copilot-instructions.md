# PMS4U AI Coding Agent Instructions

## Core Doctrine
- This repo implements Constitutional Execution Infrastructure (CEI) and the Sovereign Execution Triad (SET): runtime admissibility before irreversible consequence.
- Preserve the category distinction in `README.md`, `WHITEPAPER.md`, and `SOVEREIGN_STACK.md`: this is not audit/observability/compliance UI; it governs execution boundaries.
- The execution rule is: validate authority, evaluate admissibility, issue evidence, append ledger, then commit or freeze. Do not add mutation paths that bypass that order.

## Architecture Map
- `app/` is the Next.js 16 / React 19 public surface: landing, authority, doctrine, proof surface, trace, console, Shab report, and workspace report routes.
- `governance-core/` is the FastAPI constitutional runtime on port `8000`; key APIs include `/execution-request`, `/entities/{id}/lineage`, `/runtime/status`, `/runtime/verify-ledger`, and projection rebuild endpoints.
- `governance-sdk/` holds shared contracts: `states.py` defines `HuntState` and `ALLOWED_TRANSITIONS`; `receipts.py` defines `ExecutionReceipt`; `ui_contracts.py` defines event/trace payloads consumed by the UI.
- `execution-proof-stack/` is the minimal proof gateway: admissibility decisions (`ALLOW`, `HOLD`, `DENY`, `ESCALATE`), constitutional verdict objects, boundary enforcement, and JSONL evidence.
- `carshunter_app/` applies the governance flow to automotive transitions; `services/transition_service.py` is the canonical commit path through the runtime client and ledger.
- `operations-core/` owns operational intake and social automation; all lead creation should go through `operations-core/lead_registry/openapi.md`, not direct DB writes.

## Runtime State Primitives
- Keep visible doctrine aligned with `app/console/page.tsx`: `EXECUTE`, `DENY`, `DEFER`, `INTERRUPT`, and `OBSERVE` are governance primitives, not cosmetic statuses.
- State transitions must follow the SDK graph (`INTAKE -> VERIFIED -> COMPLIANCE_PENDING -> PAYMENT_CONFIRMED/GOVERNANCE_REVIEW -> EXPORT_APPROVED -> EXPORTED`).
- Illegal jumps should fail with `ILLEGAL_STATE_JUMP_REJECTED`; do not silently coerce invalid states.

## Evidence, Ledger, Replay
- Every governed execution needs `evidence_id`, `transition_id`, correlation ID, event hash, previous hash, signature, timestamp, and replayable lineage.
- `authoritative_ledger.jsonl` and `execution-proof-stack/ledger/evidence_ledger.jsonl` are append-only evidence streams; projections are disposable read models rebuilt by `ReplayEngine` and `ProjectionRebuilder`.
- When adding backend features, preserve hash-chain continuity and signature verification paths in `governance-core/src/api/main.py` and `governance-core/src/runtime/*`.

## Frontend Patterns
- Before editing Next.js code, read the relevant guide in `node_modules/next/dist/docs/`; this repo uses Next.js 16 with changed conventions.
- Governance UI components live in `app/components/governance/` and normalize backend snake_case payloads to frontend camelCase in `LiveExecutionTrace.tsx`.
- Trace UI expects FastAPI at `http://localhost:8000` and websocket trace sessions at `ws://localhost:8000/ws/trace/{session_id}`.
- The workspace report source of truth is `app/workspace-technical-report/report-data.mjs`; `npm run report:html` regenerates `WORKSPACE_TECHNICAL_REPORT.html`.

## Developer Workflows
- Run the frontend with `npm run dev`; `start_dev.sh` starts both `governance-core` via `uvicorn src.api.main:app --host 0.0.0.0 --port 8000` and Next.
- `npm run build` runs `prebuild`, which regenerates the standalone workspace report before `next build`.
- `npm run lint` runs ESLint. Current `next.config.ts` contains an unsupported Next 16 `eslint` key, so expect a build warning until config is updated.
- Use `python execution-proof-stack/demo.py` for the minimal CEI proof flow and `python carshunter_app/test_constitutional_enforcement.py` for happy-path vs bypass demonstration.

## Safety Rules For Changes
- Do not introduce direct commit/export/update paths around `GovernanceRuntimeClient`, `execute_transition`, evidence issuance, or ledger append.
- Treat `governance-sdk` models as cross-service contracts; update frontend normalizers and FastAPI response models together when fields change.
- Keep generated/static artifacts synchronized with their sources; do not hand-edit `WORKSPACE_TECHNICAL_REPORT.html` without updating `report-data.mjs` or the generator.
