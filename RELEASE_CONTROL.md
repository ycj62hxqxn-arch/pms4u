# PMS4U Release Control Map

This repo hosts multiple business surfaces. Keep the runtime surfaces, public domains, and one-off generated pages separated before deploying.

## Canonical Surfaces

| Surface | Route / Domain | Source in this repo | Release rule |
| --- | --- | --- | --- |
| PMS4U runtime | `pms.bpbsolutionsltd.com`, `pms4u.vercel.app` | `app/page.tsx`, governance routes, YAI routes | Primary app. Build and deploy from repo root only. |
| Investor brief | `/investor`, `/investor-technical-report` | `app/investor/page.tsx`, `app/investor-technical-report/page.tsx` | Preserve claim discipline: no ROI/prevented-loss claims without signed business validation. |
| GTCS4U public site | `gtcs4u.com`, `www.gtcs4u.com` | `app/gtcs4u/page.tsx`; host-based rewrite in `app/page.tsx` / `middleware.ts` | Do not replace the root with files from `Downloads`. Add experiments as routes first. |
| CARSHUNTER drops | `/carshunter-drops`, `/bpbsolutionsltd/carshunter-drops` | route redirects plus `public/CARSHUNTER_BMW_BIG_DAY_DROPS_2026-06-17.html` | Must remain a linked campaign page, not the GTCS4U homepage. Do not expose supplier/source names. |
| BPB Solutions | `/bpbsolutionsltd`, `/bpbsolutionsltd/yai` | `app/bpbsolutionsltd/*` | Corporate entry point for YAI Local and governance console. |
| AegyptenHautnah | external domain/server | `aegyptenhautnah.com/` assets are archival/copy material here | Treat as a separate project. Do not deploy via PMS4U unless explicitly planned. |

## Deployment Rules

- Deploy PMS4U from `/Users/alaaatia/pms4u`, never from `/Users/alaaatia/Downloads`.
- Build before deploy with `npm run build`.
- Verify live routes after deploy:
  - `/`
  - `/investor`
  - `/gtcs4u`
  - `/carshunter-drops`
  - `/bpbsolutionsltd`
  - `/bpbsolutionsltd/yai`
- If `gtcs4u.com` needs a new homepage, preserve the current pilot/start-offer structure unless the user explicitly approves replacing the root experience.
- Keep `investor-live-2026-06-15` as the recovery tag for the investor deployment.

## Claim Discipline

Proven claims may mention runtime interception, signed evidence, hash continuity, replay reconstruction, ledger verification, and authority traceability.

Do not claim prevented losses, financial exposure avoided, compliance breach prevention, ROI improvement, enterprise risk reduction, or production adoption unless a business owner signs an outcome note.
