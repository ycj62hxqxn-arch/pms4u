const reportData = {
  metadata: {
    title: "Workspace Technical Report | PMS4U",
    description:
      "A native technical report for the PMS4U workspace covering doctrine, milestones, domains, sectors, projects, impact, and SWOT.",
  },
  header: {
    eyebrow: "Native workspace report",
    title: "Workspace Technical Report",
    lead:
      "A native report surface for the PMS4U workspace. It covers what the workspace is, when the key milestones happened, how the system is built, why it exists, what changed, where it has impact, which domains and sectors it covers, and which projects have been completed.",
  },
  quickFacts: [
    { label: "Repository", value: "pms4u" },
    { label: "Runtime", value: "Next.js 16 / React 19" },
    { label: "Governance model", value: "CEI / SET" },
    { label: "Public surfaces", value: "7+ routes" },
    { label: "Audit status", value: "PASS" },
    { label: "Deployment", value: "Vercel-compatible" },
  ],
  stackNotes: [
    "Constitutional Execution Infrastructure (CEI)",
    "Sovereign Execution Triad (SET)",
    "Runtime admissibility and authority verification",
    "Evidence sealing and replayable lineage",
    "Runtime governance console and trace viewer",
    "Lead intake and social automation contracts",
  ],
  summary: {
    title: "What this workspace is",
    paragraphs: [
      "This repository is the canonical reference for Constitutional Execution Infrastructure (CEI) and the Sovereign Execution Triad (SET). The core doctrine is authority before execution: consequential actions should not become real unless they remain admissible at runtime.",
      "The workspace is not only a landing page. It includes a governance authority page, a doctrine briefing, a proof surface, a live trace viewer, a runtime console, and a client-facing report, plus supporting operational contracts for lead intake and social automation.",
    ],
    calloutTitle: "Core thesis",
    calloutLead:
      "Proof before power. Evidence before consequence. Authority before execution.",
    calloutBody:
      "The product category is runtime control of execution, not retrospective audit or compliance reporting.",
  },
  milestones: [
    {
      date: "2026-04-10",
      title: "Initial authority-page and UI modernization",
      detail:
        "The interface language moved toward a premium governance aesthetic, establishing the design direction reused across the workspace.",
    },
    {
      date: "2026-04-10 to 2026-04-12",
      title: "Structural cleanup and component stabilization",
      detail:
        "Duplicated structure was removed and component typing was corrected to stabilize the app router implementation.",
    },
    {
      date: "2026-05-25",
      title: "Console route launched",
      detail:
        "The runtime governance console became a first-class route, turning the execution narrative into an interactive simulation.",
    },
    {
      date: "2026-05-28",
      title: "Canonical doctrine consolidation",
      detail:
        "The README, whitepaper, and sovereign stack docs were aligned around CEI, admissibility, and authority-before-execution.",
    },
    {
      date: "2026-05-31",
      title: "Repository audit passed",
      detail:
        "No tracked .env files, databases, runtime logs, or cache files were present in version control.",
    },
  ],
  how: {
    title: "How the workspace is built and how the projects were accomplished",
    implementationTitle: "Implementation model",
    implementationBody:
      "The app uses Next.js App Router pages and client components where runtime state is needed. Governance UI is split into reusable components for evidence badges, event hashes, authority seals, receipts, and traces.",
    deliveryTitle: "Project delivery model",
    deliveryBody:
      "Each major project was delivered as a route-level surface or adjacent operational contract: the landing page framed the doctrine, the authority page mapped entities, the trace page replayed lineage, the proof surface demonstrated freeze vs allow, and the console modeled runtime decisioning.",
    projectsTableTitle: "How each major project was accomplished",
    projectsTableHeaders: ["Project", "What it shows", "How it was accomplished"],
  },
  why: {
    title: "Why the workspace exists",
    problemTitle: "Problem statement",
    problemBody:
      "Traditional governance is retrospective. Autonomous systems can create irreversible consequences before a human or policy process catches up. The workspace exists to move governance into the execution boundary itself.",
    rationaleTitle: "Strategic rationale",
    rationaleBody:
      "The repo turns governance into a control plane. That supports enterprise trust, evidence integrity, and operational continuity across multiple businesses and domains.",
    categoryTitle: "Category distinction",
    categoryBody:
      "The repo explicitly rejects being framed as an audit platform, observability layer, compliance dashboard, or policy engine. The intended category is constitutional runtime control.",
    businessTitle: "Business reason",
    businessBody:
      "The broader ecosystem spans automotive, tourism, corporate presence, and governance documentation. A shared authority model reduces drift between brands, entities, and operational channels.",
  },
  changes: {
    title: "What changed in the workspace and what it achieved",
    documentationTitle: "Documentation change",
    documentationBody:
      "The README was rewritten around CEI and runtime admissibility. The sovereign stack and whitepaper tightened the ontology around authority, execution, memory, and evidentiary logic.",
    assetsTitle: "Asset canonicalization",
    assetsBody:
      "Proof assets were consolidated under a single public /assets path, improving deployment compatibility and reducing broken links.",
    routesTitle: "Route hardening",
    routesBody:
      "The console and trace routes transformed doctrine into interactive proof surfaces rather than static explanation pages.",
    hygieneTitle: "Repo hygiene",
    hygieneBody:
      "The latest audit confirmed no tracked environment files, databases, logs, or caches in version control.",
    impactStats: [
      { label: "Operational impact", value: "Runtime control" },
      { label: "Narrative impact", value: "Clear category" },
      { label: "Delivery impact", value: "Static-safe" },
      { label: "Execution impact", value: "Freeze before consequence" },
    ],
  },
  impact: {
    title: "Observed and expected technical impact",
    securityTitle: "Security posture",
    securityBody:
      "Evidence-first design reduces untracked state changes and strengthens forensic clarity.",
    trustTitle: "Operational trust",
    trustBody:
      "Runtime admissibility, receipts, traces, and banners make trust conditions visible instead of implicit.",
    coherenceTitle: "Multi-entity coherence",
    coherenceBody:
      "Domain maps align multiple businesses under one governance model, improving brand and execution consistency.",
    maintainabilityTitle: "Maintainability",
    maintainabilityBody:
      "Modular routes, governance components, and source docs lower ambiguity for future work.",
  },
  domains: [
    {
      domain: "carshunter.de",
      repo: "carshunter_app",
      sector: "Automotive retail / brokerage",
      role: "Vehicle sourcing and governed transaction execution.",
    },
    {
      domain: "aegyptenhautnah.com",
      repo: "operations-core",
      sector: "Tourism / cultural operations",
      role: "Lead intake, customer operations, and social automation.",
    },
    {
      domain: "bpbsolutionsltd.com",
      repo: "corporate",
      sector: "Corporate presence",
      role: "Public brand and YAI Local execution-governance entry layer.",
    },
    {
      domain: "gtcs4u.info",
      repo: "governance-os",
      sector: "Governance documentation",
      role: "Reference site for operating doctrine and architecture.",
    },
    {
      domain: "gtcs4u.com",
      repo: "holding-site",
      sector: "Holding / entry point",
      role: "Umbrella entry into the broader portfolio.",
    },
    {
      domain: "pms4u.vercel.app",
      repo: "pms4u",
      sector: "Governance runtime demo",
      role: "Landing, proof surface, trace, doctrine, console, and report routes.",
    },
  ],
  sectors: {
    title: "What domains and sectors this workspace covers",
    coverage:
      "Automotive, tourism, corporate services, governance software, runtime evidence systems, document automation, lead registry tooling, and social media automation.",
    operatingModel:
      "Business-specific surfaces feed back into a shared governance core so execution logic, evidence, and authority do not have to be rebuilt per brand.",
  },
  projects: [
    {
      name: "Home page",
      impact: "Brand narrative and execution-first positioning.",
      method: "Next.js route with hero, framework cards, execution steps, and CTA flows.",
    },
    {
      name: "Authority page",
      impact: "Multi-entity governance structure and systems portfolio.",
      method: "Structured route with company, entity, and systems cards.",
    },
    {
      name: "Doctrine page",
      impact: "CARSHUNTER investor/member briefing and tri-layer architecture.",
      method: "Long-form presentation route with state-machine narrative and roadmap.",
    },
    {
      name: "Proof surface",
      impact: "Constitutional freeze vs allow path.",
      method: "Interactive verdict toggle with evidence chain and proof video.",
    },
    {
      name: "Trace page",
      impact: "Evidence-bound lineage replay.",
      method: "Live lineage polling, websocket replay, receipt rendering, and hash continuity.",
    },
    {
      name: "Console page",
      impact: "Runtime decision engine simulation.",
      method: "State-machine simulation with risk telemetry and authority injection.",
    },
    {
      name: "Shab report",
      impact: "Client-facing governance OS summary.",
      method: "Executive report surface with stack summary and operational snapshot.",
    },
    {
      name: "Operations core",
      impact: "Operational intake and social automation primitives.",
      method: "Lead registry API contract plus local automation agent documentation.",
    },
  ],
  projectsSection: {
    title: "Which projects have been done and how they were delivered",
  },
  swot: {
    title: "In-depth technical SWOT analysis",
    items: [
      {
        title: "Strengths",
        tone: "text-emerald-300",
        body:
          "Strong doctrinal coherence, clear category framing, reusable governance primitives, and a consistent visual language across routes.",
      },
      {
        title: "Weaknesses",
        tone: "text-amber-300",
        body:
          "Some surfaces are still simulation-heavy, and live trace features depend on local backend availability.",
      },
      {
        title: "Opportunities",
        tone: "text-sky-300",
        body:
          "Package the trace, receipt, and admissibility patterns into reusable enterprise modules and production APIs.",
      },
      {
        title: "Threats",
        tone: "text-rose-300",
        body:
          "Category confusion, backend drift, and overreliance on narrative proof can weaken trust if not kept synchronized.",
      },
    ],
    conclusionTitle: "SWOT conclusion",
    conclusionBody:
      "The strongest asset is the governance architecture itself. The main risk is execution quality and operational hardening, not conceptual originality.",
    mitigationTitle: "Mitigation path",
    mitigationBody:
      "Continue formalizing contracts, automate tests around trace integrity, expand backend availability, and keep docs synchronized with shipped routes and assets.",
  },
  sources: {
    title: "Files used to produce this report",
    primary: [
      "README.md",
      "SOVEREIGN_STACK.md",
      "WHITEPAPER.md",
      "ARCHITECTURE_MAP_MASTER.md",
      "PLATFORM_AUTHORITY_MAP.md",
      "DNS_DEPLOYMENT_MAP.md",
      "REPOSITORY_AUDIT.md",
      "BPB_SHAP_Q1_2026_Report.md",
    ],
    implementation: [
      "app/page.tsx",
      "app/authority/page.tsx",
      "app/doctrine/page.tsx",
      "app/proof-surface/page.tsx",
      "app/trace/page.tsx",
      "app/console/page.tsx",
      "app/shab-report/page.tsx",
      "app/components/governance/*",
      "operations-core/lead_registry/openapi.md",
      "operations-core/social_agent/README.md",
      "execution-proof-stack/docs/DOCTRINE.md",
    ],
  },
};

export default reportData;
