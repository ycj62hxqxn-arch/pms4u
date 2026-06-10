# ARCHITECTURE MAP MASTER

## Domains → Repositories

| Domain                | Repository         |
|---------------------- |-------------------|
| carshunter.de         | carshunter_app    |
| aegyptenhautnah.com   | operations-core   |
| bpbsolutionsltd.com   | corporate         |
| gtcs4u.info           | governance-os     |
| gtcs4u.com            | holding-site      |

## Repositories

- pms4u
- governance-core
- governance-os
- carshunter_app
- operations-core

## Runtime

- Flask
- FastAPI
- Next.js
- SQLite/Postgres

## Governance

- State Machine
- Governance Gate
- Evidence
- Ledger
- Replay Engine

---

## Domain Roles

| Domain              | Role                    |
|---------------------|-------------------------|
| carshunter.de       | Automotive Operations   |
| aegyptenhautnah.com | Tourism Operations      |
| bpbsolutionsltd.com | Corporate Presence      |
| gtcs4u.info         | Governance Documentation|
| gtcs4u.com          | Holding / Main Entry    |

## Authority Flow

User Request
↓
Application Layer
↓
Governance Gate
↓
Evidence Generation
↓
Ledger Append
↓
Commit / Freeze
↓
Replay & Audit
