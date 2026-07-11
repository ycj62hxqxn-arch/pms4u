export type DomainGroup = "Production" | "Local Runtime" | "Deployment" | "Review";
export type RiskLevel = "Low" | "Medium" | "High";
export type PriorityLevel = "P0" | "P1" | "P2" | "P3";

export type DomainAsset = {
  domain: string;
  aliases: string[];
  group: DomainGroup;
  owner: string;
  risk: RiskLevel;
  priority: PriorityLevel;
  role: string;
  target: string;
  folder: string;
  url: string;
  health: string;
  tags: string[];
};

export type ResearchAsset = {
  id: string;
  title: string;
  kind: "Technical Note" | "Doctrine" | "White Paper" | "Reference Architecture" | "Standard";
  track: string;
  status: "Published" | "Queued" | "Draft";
  priority: PriorityLevel;
  owner: string;
  href: string | null;
  summary: string;
};

export const domainAssets: DomainAsset[] = [
  {
    domain: "pms.bpbsolutionsltd.com",
    aliases: ["pms4u.vercel.app"],
    group: "Production",
    owner: "PMS4U Research",
    risk: "High",
    priority: "P0",
    role: "Research, technical notes, doctrine, white papers, standards, and reference architecture.",
    target: "Root host rewrites to /research",
    folder: "app/research",
    url: "https://pms.bpbsolutionsltd.com/",
    health: "https://pms.bpbsolutionsltd.com/",
    tags: ["knowledge-layer", "research", "canonical"],
  },
  {
    domain: "gtcs4u.com",
    aliases: ["www.gtcs4u.com"],
    group: "Production",
    owner: "GTCS4U Platform",
    risk: "High",
    priority: "P0",
    role: "Enterprise AI governance platform: demo, console, pilot, product, and case studies.",
    target: "Root host rewrites to /gtcs4u",
    folder: "app/gtcs4u",
    url: "https://gtcs4u.com/",
    health: "https://gtcs4u.com/",
    tags: ["platform", "pilot", "console"],
  },
  {
    domain: "bpbsolutionsltd.com",
    aliases: ["www.bpbsolutionsltd.com"],
    group: "Production",
    owner: "BPB Corporate",
    risk: "Medium",
    priority: "P1",
    role: "Corporate identity, company context, formal contact, and relationship routing.",
    target: "Root host rewrites to /bpbsolutionsltd",
    folder: "app/bpbsolutionsltd",
    url: "https://www.bpbsolutionsltd.com/",
    health: "https://www.bpbsolutionsltd.com/",
    tags: ["corporate", "company", "contact"],
  },
  {
    domain: "aegyptenhautnah.com",
    aliases: ["www.aegyptenhautnah.com"],
    group: "Production",
    owner: "Aegypten Hautnah",
    risk: "Medium",
    priority: "P1",
    role: "Independent Egypt travel and booking project outside the PMS4U/GTCS4U/BPB structure.",
    target: "Independent public travel site",
    folder: "aegyptenhautnah.com",
    url: "https://aegyptenhautnah.com/",
    health: "https://aegyptenhautnah.com/",
    tags: ["travel", "independent", "booking"],
  },
  {
    domain: "api.aegyptenhautnah.com",
    aliases: [],
    group: "Production",
    owner: "Aegypten Hautnah",
    risk: "High",
    priority: "P1",
    role: "Tours and booking API surface for the travel project.",
    target: "Public API host",
    folder: "aegyptenhautnah.com/api.aegyptenhautnah.com",
    url: "https://api.aegyptenhautnah.com/index.php/health",
    health: "https://api.aegyptenhautnah.com/index.php/health",
    tags: ["api", "booking", "health"],
  },
  {
    domain: "governance.gtcs4u.com",
    aliases: [],
    group: "Production",
    owner: "GTCS4U Platform",
    risk: "High",
    priority: "P1",
    role: "Public governance runtime origin and future external proof API.",
    target: "Governance API origin",
    folder: "governance-core",
    url: "https://governance.gtcs4u.com/",
    health: "https://governance.gtcs4u.com/",
    tags: ["api", "governance", "runtime"],
  },
  {
    domain: "trace.gtcs4u.local",
    aliases: [],
    group: "Local Runtime",
    owner: "PMS4U Engineering",
    risk: "Medium",
    priority: "P2",
    role: "Local execution observatory and trace UI.",
    target: "127.0.0.1:3000",
    folder: "app/trace",
    url: "http://trace.gtcs4u.local/",
    health: "http://127.0.0.1:3000/",
    tags: ["local", "trace", "next"],
  },
  {
    domain: "governance.gtcs4u.local",
    aliases: [],
    group: "Local Runtime",
    owner: "PMS4U Engineering",
    risk: "High",
    priority: "P1",
    role: "Local constitutional execution runtime.",
    target: "127.0.0.1:8000",
    folder: "governance-core",
    url: "http://governance.gtcs4u.local/",
    health: "http://127.0.0.1:8000/events",
    tags: ["local", "fastapi", "governance"],
  },
  {
    domain: "carshunter.gtcs4u.local",
    aliases: ["carshunter.gtcs4u.info"],
    group: "Local Runtime",
    owner: "CARSHUNTER",
    risk: "Medium",
    priority: "P2",
    role: "Legacy local CARSHUNTER operational intake route.",
    target: "127.0.0.1:5001",
    folder: "carshunter_app",
    url: "http://carshunter.gtcs4u.local/",
    health: "http://127.0.0.1:5001/",
    tags: ["local", "carshunter", "flask"],
  },
  {
    domain: "operations-core.local",
    aliases: [],
    group: "Local Runtime",
    owner: "Operations Core",
    risk: "Medium",
    priority: "P2",
    role: "Local operations-core service reference.",
    target: "127.0.0.1:8000",
    folder: "operations-core",
    url: "http://operations-core.local:8000/",
    health: "http://127.0.0.1:8000/",
    tags: ["local", "operations", "api"],
  },
  {
    domain: "vercel-site-tau-six.vercel.app",
    aliases: [],
    group: "Review",
    owner: "PMS4U Engineering",
    risk: "Low",
    priority: "P3",
    role: "Unresolved Vercel reference retained for review and cleanup.",
    target: "Vercel review deployment",
    folder: "aegyptenhautnah.com",
    url: "https://vercel-site-tau-six.vercel.app/",
    health: "https://vercel-site-tau-six.vercel.app/",
    tags: ["vercel", "review", "cleanup"],
  },
];

export const researchAssets: ResearchAsset[] = [
  {
    id: "SPEC-001",
    title: "Specification 1.0 — Constitutional Runtime Governance",
    kind: "Standard",
    track: "Core Specification",
    status: "Published",
    priority: "P0",
    owner: "PMS4U Research",
    href: "/research/specification-1-0",
    summary:
      "Normative base for constitutional model, runtime authority, admissibility, evidence, execution gate, consequence, and conformance.",
  },
  {
    id: "TN-001",
    title: "Who Verifies the Verifier?",
    kind: "Technical Note",
    track: "Runtime Authority",
    status: "Published",
    priority: "P0",
    owner: "PMS4U Research",
    href: "/research/technical-notes/tn-001",
    summary:
      "Runtime authority, constitutional admissibility, and the case for an independent constitutional model.",
  },
  {
    id: "TN-002",
    title: "Authority vs Permission",
    kind: "Technical Note",
    track: "Runtime Authority",
    status: "Queued",
    priority: "P1",
    owner: "PMS4U Research",
    href: null,
    summary:
      "Permission grants access; authority determines whether a consequence-bearing transition may occur now.",
  },
  {
    id: "TN-003",
    title: "Admissibility",
    kind: "Technical Note",
    track: "Admissibility",
    status: "Queued",
    priority: "P1",
    owner: "PMS4U Research",
    href: null,
    summary:
      "How authority, evidence, policy state, and consequence classification determine whether execution may proceed now.",
  },
  {
    id: "TN-004",
    title: "Evidence Continuity",
    kind: "Technical Note",
    track: "Evidence",
    status: "Queued",
    priority: "P1",
    owner: "PMS4U Research",
    href: null,
    summary:
      "How evidence supports admissibility before consequence and remains replayable after consequence.",
  },
  {
    id: "TN-005",
    title: "Execution Gate",
    kind: "Technical Note",
    track: "Execution Governance",
    status: "Queued",
    priority: "P1",
    owner: "PMS4U Research",
    href: null,
    summary:
      "The final release boundary where admissible evaluation becomes actual consequence-bearing mutation.",
  },
  {
    id: "DG-001",
    title: "Runtime Governance Doctrine",
    kind: "Doctrine",
    track: "Execution Governance",
    status: "Draft",
    priority: "P2",
    owner: "PMS4U Research",
    href: null,
    summary:
      "Doctrine consolidation after the first sequence of technical notes.",
  },
  {
    id: "WP-001",
    title: "The Constitutional Layer of Enterprise AI",
    kind: "White Paper",
    track: "Enterprise AI Governance",
    status: "Draft",
    priority: "P2",
    owner: "PMS4U Research",
    href: null,
    summary:
      "A 20-page executive and technical white paper for enterprise buyers and CTOs.",
  },
  {
    id: "RA-001",
    title: "Constitutional Runtime Governance Reference Architecture",
    kind: "Reference Architecture",
    track: "Architecture",
    status: "Published",
    priority: "P0",
    owner: "PMS4U Research",
    href: "/reference-architecture",
    summary:
      "Canonical architecture connecting constitutional model, runtime authority, admissibility gate, and evidence spine.",
  },
  {
    id: "SDK-001",
    title: "Runtime SDK Surface",
    kind: "Standard",
    track: "Developer Adoption",
    status: "Published",
    priority: "P1",
    owner: "PMS4U Research",
    href: "/research/runtime-sdk",
    summary:
      "JavaScript and Python adoption surface for runtime decision contracts and evidence-aware integration patterns.",
  },
  {
    id: "PG-001",
    title: "Public Runtime Playground",
    kind: "Standard",
    track: "Developer Adoption",
    status: "Published",
    priority: "P1",
    owner: "PMS4U Research",
    href: "/playground",
    summary:
      "Interactive decision simulator for action, authority, and evidence with allow/deny/review/defer outcomes.",
  },
  {
    id: "STD-001",
    title: "Technical Note Numbering Standard",
    kind: "Standard",
    track: "Publishing Operations",
    status: "Draft",
    priority: "P2",
    owner: "PMS4U Research",
    href: null,
    summary:
      "Naming, numbering, status, citation, PDF, and HTML rules for the PMS4U knowledge corpus.",
  },
];

export const localHosts = [
  ["127.0.0.1", "trace.gtcs4u.local"],
  ["127.0.0.1", "governance.gtcs4u.local"],
  ["127.0.0.1", "carshunter.gtcs4u.local"],
  ["127.0.0.1", "operations-core.local"],
  ["127.0.0.1", "pms.bpbsolutionsltd.com"],
  ["127.0.0.1", "gtcs4u.info"],
  ["127.0.0.1", "carshunter.gtcs4u.info"],
] as const;
