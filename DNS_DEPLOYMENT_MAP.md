# DNS & Deployment Map (Global)

## Domains & Subdomains
| Domain/Subdomain           | Registrar | DNS Host | Target/Value         | Purpose/Service           | Hosting/Port           |
|---------------------------|-----------|----------|----------------------|---------------------------|------------------------|
| aegyptenhautnah.com       | IONOS     | IONOS    | [ALL-INKL IP]        | Main Website              | ALL-INKL (80/443)      |
| www.aegyptenhautnah.com   | IONOS     | IONOS    | aegyptenhautnah.com  | Main Website (CNAME)      | ALL-INKL (80/443)      |
| api.aegyptenhautnah.com   | IONOS     | IONOS    | [API Server IP]      | Lead Registry API         | ALL-INKL or VPS (8000) |
| carshunter.de             | IONOS     | IONOS    | [ALL-INKL IP]        | Carshunter Website        | ALL-INKL (80/443)      |
| www.carshunter.de         | IONOS     | IONOS    | carshunter.de        | Carshunter Website (CNAME)| ALL-INKL (80/443)      |
| api.carshunter.de         | IONOS     | IONOS    | [API Server IP]      | Carshunter API            | VPS/ALL-INKL (8000)    |
| gmtc4u.de                 | IONOS     | IONOS    | [ALL-INKL IP]        | GMTC4U Website            | ALL-INKL (80/443)      |
| www.gmtc4u.de             | IONOS     | IONOS    | gmtc4u.de            | GMTC4U Website (CNAME)    | ALL-INKL (80/443)      |
| api.gmtc4u.de             | IONOS     | IONOS    | [API Server IP]      | GMTC4U API                | VPS/ALL-INKL (8000)    |
| pms4u.vercel.app          | Vercel    | Vercel   | [Vercel]             | CEI Demo/Proof Surface    | Vercel (443)           |
| ...                       | ...       | ...      | ...                  | ...                       | ...                    |

## Ports
- 80/443: Standard HTTP/HTTPS for websites
- 8000: FastAPI/Backend APIs (development or production)
- (Add others as needed)

## Email
- MX records: (e.g. IONOS/ALL-INKL/Google Workspace)
- SPF/DKIM/DMARC: (configure as needed)

## Notes
- All DNS is managed at IONOS unless otherwise noted.
- Hosting can be ALL-INKL, Vercel, or a VPS depending on the service.
- Update this file with any new domains, subdomains, or ports as the system grows.

---

_This file is the single source of truth for all domain, DNS, and deployment routing for your ecosystem._
