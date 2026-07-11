<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# PMS4U — Full Agent Context

> **Read this before executing any task.**
> This file is the single source of truth for every AI agent, coding assistant, and automated tool working in this repository.

---

## 1. What This Project Is

**PMS4U** is runtime governance infrastructure. Its core claim: authority and admissibility are resolved *before* execution becomes consequence. It is not a consultancy website, a dashboard template, or a generic SaaS app.

The system enforces a constitutional authority chain at the execution boundary:

```
User Request
  ↓
Application Layer  (Next.js, Flask, FastAPI)
  ↓
Governance Gate    (QGED — authority must return ALLOW)
  ↓
Evidence Generation (signed receipts, SHA-256 hash chain)
  ↓
Ledger Append      (immutable JSONL ledger)
  ↓
Commit / Freeze
  ↓
Replay & Audit
```

**Never bypass the governance gate.** Any code path that skips evidence creation, ledger append, or authority resolution is a violation, not a shortcut.

---

## 2. Domain & Surface Map

| Surface | Route / Domain | Source in repo | Notes |
|---|---|---|---|
| PMS4U runtime | `pms.bpbsolutionsltd.com`, `pms4u.vercel.app` | `app/page.tsx` + governance routes | Primary surface. Build + deploy from repo root only. |
| Investor brief | `/investor`, `/investor-technical-report` | `app/investor/page.tsx`, `app/investor-technical-report/page.tsx` | Preserve claim discipline — no ROI/loss claims without signed validation. |
| GTCS4U public | `gtcs4u.com`, `www.gtcs4u.com` | `app/gtcs4u/page.tsx`; host-based rewrite in `middleware.ts` | Pilot/start-offer root. Do not replace unless explicitly approved. |
| CARSHUNTER drops | `/carshunter-drops`, `/bpbsolutionsltd/carshunter-drops` | `public/CARSHUNTER_BMW_BIG_DAY_DROPS_2026-06-17.html` | Campaign page only. Do not expose supplier/source names. |
| BPB Solutions | `/bpbsolutionsltd`, `/bpbsolutionsltd/yai` | `app/bpbsolutionsltd/*` | Corporate entry, YAI Local, governance console. |
| AegyptenHautnah | `aegyptenhautnah.com` (ALL-INKL) | `aegyptenhautnah-platform/`, `operations-core/` | Separate project. Do not deploy via PMS4U deploy. |
| Carshunter | `carshunter.de` (ALL-INKL) | `carshunter_app/` | Automotive operations. Flask + SQLite. |

**Routing rule for `app/page.tsx`:** renders GTCS4U page only when host is `gtcs4u.com` or `www.gtcs4u.com`. All other hosts → PMS4U root.

---

## 3. Repository Folder Responsibilities

```
pms4u/
├── app/                    Next.js app router — UI surfaces only
│   ├── page.tsx            Root entry (host-aware routing)
│   ├── investor/           Investor brief — claim-disciplined
│   ├── gtcs4u/             GTCS4U public surface
│   ├── bpbsolutionsltd/    BPB corporate + YAI
│   ├── carshunter-drops/   Campaign redirect
│   └── api/                Next.js API routes (thin adapters only)
│
├── governance-core/        FastAPI constitutional runtime
│   ├── main.py             QGED authority bind — execution boundary
│   ├── gcc_engine.py       GovernEngine, AuthorityEngine, SigningPolicy
│   ├── stopgo/command.py   Frozen Command envelope schema
│   └── config/             Rules_roles.yaml — policy and role definitions
│
├── governance-sdk/         Cross-service contracts, states, receipts
│   └── (update UI normalizers and API responses together when fields change)
│
├── execution-proof-stack/  Minimal proof gateway + JSONL evidence flow
│
├── carshunter_app/         Automotive governance application (Flask)
│
├── operations-core/        AegyptenHautnah FastAPI backend
│
├── public/                 Static HTML exports (reports, investor pages)
│
├── lib/                    Shared TypeScript utilities
│
└── config/                 Global configuration (tsconfig, eslint, etc.)
```

---

## 4. Authority Chain — Signers and Roles

Defined in `governance-core/config/Rules_roles.yaml`.

| Signer ID | Role | Type |
|---|---|---|
| `sig_pms_director` | `PMS` | SYSTEM |
| `sig_ops` | `CARSHUNTER` | BUSINESS_UNIT |
| `sig_legal` | `AA` | HUMAN_AUTHORITY |
| `sig_carshunter_ops` | `CARSHUNTER` | BUSINESS_UNIT |
| `sig_aa` | `AA` | HUMAN_AUTHORITY |

**Active signing policies:**
- High-complexity GO (≥5): requires `AA` role + minimum 2 signers.
- Automotive GO: requires `CARSHUNTER` role.
- Complexity must be 1–10. Values outside this range are rejected.

---

## 5. Commands — Development

```bash
# Start local development
npm run dev

# Build before any deployment
npm run build

# Start governance-core (FastAPI)
cd governance-core && uvicorn main:app --reload

# Combined local launcher (when available)
./start_dev.sh
```

**Verify after any deploy:**
- `/` — root (PMS4U)
- `/investor`
- `/gtcs4u`
- `/carshunter-drops`
- `/bpbsolutionsltd`
- `/bpbsolutionsltd/yai`

---

## 6. Coding Rules

### General
- Work from `/Users/alaaatia/pms4u`, never from `/Users/alaaatia/Downloads`.
- Do not deploy from a copied folder, temp directory, or Downloads.
- Do not merge generated caches: `.next/`, `out/`, `.vercel/`, `__pycache__/`, `.DS_Store`, local DB files.

### Next.js / TypeScript
- App router only — no pages router.
- Thin API routes. Business logic lives in `governance-core`, not in `app/api/`.
- Read `node_modules/next/dist/docs/` before using any Next.js API — this version has breaking changes.

### governance-core (FastAPI / Python)
- `Command` in `stopgo/command.py` is frozen (`@dataclass(frozen=True)`). Do not mutate.
- `GovernEngine._validate_schema()` enforces required fields. Only `payload` may be an empty dict.
- New signer IDs must be added to `signer_roles_map` in `gcc_engine.py` AND mapped to a role in `Rules_roles.yaml`.
- `qged_gateway()` in `main.py` is the execution boundary. It must return `ALLOW` or the runtime raises `RuntimeError("QGED_BLOCK:...")`.

### Evidence & Ledger
- Every execution path must produce a signed receipt and append to the JSONL ledger.
- Do not add mutation/commit/export paths that bypass evidence creation or ledger append.
- SHA-256 hash continuity must be maintained across ledger entries.

---

## 7. Governance Gate — Stop Conditions

**Stop and do not proceed if any of the following is true:**

1. `git status -sb` shows large tracked deletions before a deploy.
2. A code change bypasses the QGED gate, skips evidence creation, or omits ledger append.
3. Public copy (investor, auditor-facing pages) makes claims of ROI, prevented loss, or risk reduction without a signed business validation record.
4. A deployment would replace `gtcs4u.com` root experience without explicit user approval.
5. A CARSHUNTER page would expose supplier or source names.
6. The `investor-live-2026-06-15` tag would be deleted or overwritten.

---

## 8. Claim Discipline

**Proven claims (safe to use):**
- Runtime interception
- Signed evidence
- Replay reconstruction
- Hash continuity
- Ledger verification
- Authority traceability

**Forbidden without signed business validation:**
- ROI improvement
- Prevented losses / exposure avoided
- Compliance breach prevention
- Enterprise risk reduction
- Production adoption at named clients

---

## 9. Agent Planning Protocol

Before executing a multi-step task, write a plan and confirm the gate conditions:

```
Plan
─────────────────────────────
[ ] Identify affected surface (app/, governance-core/, public/, etc.)
[ ] Confirm no governance gate bypass
[ ] Confirm no claim discipline violation
[ ] Confirm no cross-domain contamination (PMS4U ≠ AegyptenHautnah ≠ CARSHUNTER)
[ ] State the specific files to change
[ ] State the specific files NOT to change
─────────────────────────────
PROCEED / HOLD
```

This makes the agent a governance participant, not just a command executor.

---

## 10. Recovery Point

Tag `investor-live-2026-06-15` — recovery baseline for the live investor brief.
To restore: `git checkout investor-live-2026-06-15`

