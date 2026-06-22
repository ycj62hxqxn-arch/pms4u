# PMS4U AI Coding Agent Instructions

## Product Boundary
- PMS4U is runtime governance infrastructure: authority and admissibility are resolved before execution becomes consequence.
- Preserve the claim boundary in `RELEASE_CONTROL.md`: proven claims are runtime interception, signed evidence, replay, hash continuity, ledger verification, and authority traceability. Do not claim ROI, prevented loss, or risk reduction without signed business validation.
- This repo also contains GTCS4U, BPB Solutions, CARSHUNTER, and AegyptenHautnah artifacts. Keep them separated; do not let one domain deployment replace another surface.

## Routing Map
- PMS4U root is `app/page.tsx`; it renders the GTCS4U page only when the host is `gtcs4u.com` or `www.gtcs4u.com`.
- GTCS4U public surface is `app/gtcs4u/page.tsx`; preserve the pilot/start-offer root experience unless replacement is explicitly approved.
- CARSHUNTER drops are campaign routes: `app/carshunter-drops/page.tsx` and `app/bpbsolutionsltd/carshunter-drops/page.tsx` redirect to `public/CARSHUNTER_BMW_BIG_DAY_DROPS_2026-06-17.html`.
- BPB corporate/YAI surfaces live under `app/bpbsolutionsltd/*` and `app/yai/*`.
- Investor routes are `app/investor/page.tsx` and `app/investor-technical-report/page.tsx`.

## Governance Architecture
- `governance-core/` is the FastAPI constitutional runtime; preserve authority resolution, evidence issuance, ledger append, replay, and verification paths.
- `governance-sdk/` defines cross-service states/receipts/contracts. Update UI normalizers and API responses together when contract fields change.
- `execution-proof-stack/` contains the minimal proof gateway and JSONL evidence flow.
- `carshunter_app/` applies governance to automotive transitions; do not expose supplier/source names in public CARSHUNTER pages.

## Development Workflow
- Work from `/Users/alaaatia/pms4u`, never from `/Users/alaaatia/Downloads`.
- Run `npm run build` before deployment. Use `npm run dev` for local Next.js testing.
- Local runtime services use FastAPI/uvicorn from `governance-core`; `start_dev.sh` is the combined local launcher when available.
- Keep generated caches (`.next`, `out`, `.vercel`, `.DS_Store`, `__pycache__`, local DBs) out of commits.

## Deployment Rules
- Deploy from the repo root only. Do not deploy a copied folder, temporary folder, or `Downloads` project to a production domain.
- Before deploying, check `git status -sb`; large tracked deletions are a stop sign.
- Verify production after deploy: `/`, `/investor`, `/gtcs4u`, `/carshunter-drops`, `/bpbsolutionsltd`, and `/bpbsolutionsltd/yai`.
- Keep the tag `investor-live-2026-06-15` as a recovery point for the live investor brief.

## Change Safety
- Do not add mutation/commit/export paths that bypass governance runtime checks, evidence creation, or ledger append.
- Treat public copy as investor/auditor-facing. Prefer exact proof language over broad claims.
- If adding a bot, start with read-only website chat, then Telegram alerts, then WhatsApp Business flows; no execution actions before audit logging is stable.
