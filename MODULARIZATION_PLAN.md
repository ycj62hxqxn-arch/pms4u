# PMS4U Modularization Plan (No-Downtime)

## Goal
Reduce workspace/indexing noise and keep production routing stable while preparing split repositories/workspaces for:
- PMS4U core
- YAI Studio
- CARSHUNTER
- GTCS4U
- Research/Archive assets

## Guardrails (must not change)
- `PLAN_ONLY` output state remains active for generators.
- Human approval remains required before publish.
- No auto-publish flows.
- No bypass of governance runtime/evidence logic.
- No false claims that AI-generated media was produced when fallback templates are used.

## Phase 1 — Baseline & Safety
1. Tag current production baseline.
2. Keep current domain routing/canonical behavior in place.
3. Capture smoke checks for:
   - `/`
   - `/investor`
   - `/gtcs4u`
   - `/carshunter-drops`
   - `/bpbsolutionsltd`
   - `/bpbsolutionsltd/yai`

## Phase 2 — YAI Studio Extraction (first)
Move ownership boundaries to a dedicated workspace/repo candidate:
- `app/bpbsolutionsltd/yai-studio/*`
- `app/api/yai-studio/*`
- shared contracts from `governance-sdk/`

Keep PMS4U as the active entrypoint until parity checks pass.

## Phase 3 — Surface Splits
- GTCS4U surface extraction candidate:
  - `app/gtcs4u/*`
- CARSHUNTER surface extraction candidate:
  - `app/carshunter-drops/*`
  - static campaign assets in `public/*`

## Phase 4 — Research / Archive Reduction
Move historical/research-heavy artifacts into archive-focused workspace/repo.
Keep only live-served assets in core production repo.

## Phase 5 — Shared Package Discipline
Introduce a shared package/versioning flow for governance contracts.
- Single source of truth in `governance-sdk/`
- version lock and changelog for breaking fields

## Added Focused Workspaces
Use these workspace presets to reduce indexing overhead:
- `workspaces/pms4u-core.code-workspace`
- `workspaces/yai-studio-focused.code-workspace`
- `workspaces/products-surfaces-focused.code-workspace`

## Immediate Operational Benefit
- Smaller active file graph per task
- Faster symbol/index/search responsiveness
- Reduced accidental cross-domain edits
- Cleaner AI assistance context targeting
