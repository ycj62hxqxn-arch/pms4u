import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Clapperboard, Image as ImageIcon, Megaphone, Mic, Sparkles } from "lucide-react";
import BackNavButton from "../../components/BackNavButton";

export const metadata: Metadata = {
  title: "YAI Studio | BPB Solutions LTD",
  description:
    "YAI Studio is the AI product suite under BPB Solutions LTD. Video Maker is one application inside a broader suite: video, images, voice, agents, and marketing workflows.",
};

const suiteApps = [
  {
    title: "Video Maker",
    icon: Clapperboard,
    status: "Pilot",
    body: "Create short-form campaign videos and branded explainers with governed prompts and operator review before publication.",
    href: "/bpbsolutionsltd/yai-studio/video-maker",
    cta: "Open Video Maker",
  },
  {
    title: "Image Generator",
    icon: ImageIcon,
    status: "Planned",
    body: "Generate campaign visuals and product images with approval gates, brand controls, and auditable prompts.",
    href: "/bpbsolutionsltd/yai-studio/image-generator",
    cta: "Open module",
  },
  {
    title: "Voice",
    icon: Mic,
    status: "Planned",
    body: "Voice-over and spoken content generation for ads, explainers, and support scripts with role-based publishing controls.",
    href: "/bpbsolutionsltd/yai-studio/voice",
    cta: "Open module",
  },
  {
    title: "Agents",
    icon: Bot,
    status: "Active",
    body: "Governed task agents for operations and support. Proposed actions require runtime authority checks before execution.",
    href: "/agent/inbound",
    cta: "Open agent surface",
  },
  {
    title: "Marketing Assistant",
    icon: Megaphone,
    status: "Planned",
    body: "Campaign planning, audience drafts, and channel copy generation with operator approval and evidence trail.",
    href: "/bpbsolutionsltd/yai-studio/marketing-assistant",
    cta: "Open module",
  },
] as const;

const domains = [
  ["yai.bpbsolutionsltd.com", "YAI suite entry"],
  ["studio.bpbsolutionsltd.com", "Studio-first brand"],
  ["creator.bpbsolutionsltd.com", "Creator workflow brand"],
] as const;

export default function YaiStudioPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <BackNavButton />
      <nav className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/bpbsolutionsltd" className="text-sm font-semibold tracking-[0.28em] text-white">
            BPB SOLUTIONS LTD
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
            <a href="#suite" className="hover:text-white">
              Suite
            </a>
            <a href="#domains" className="hover:text-white">
              Domains
            </a>
            <a href="#roadmap" className="hover:text-white">
              Roadmap
            </a>
            <Link href="/gtcs4u" className="hover:text-white">
              GTCS4U
            </Link>
            <Link href="/bpbsolutionsltd" className="hover:text-white">
              Corporate
            </Link>
          </div>
        </div>
      </nav>

      <section className="border-b border-white/10 px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
              <Sparkles size={14} />
              YAI Studio
            </div>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
              AI Video • Images • Voice • Marketing • Agents
            </h1>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Runtime Governance for AI Execution
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              YAI Studio is a separate AI product under BPB Solutions LTD. Video Maker is one app
              inside the suite, not a GTCS4U dependency. This keeps product boundaries clear and
              lets the AI suite scale independently.
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Positioning</div>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="grid grid-cols-[130px_1fr] gap-3 border-b border-white/10 pb-3">
                <div className="text-slate-400">Parent</div>
                <div>BPB Solutions LTD</div>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3 border-b border-white/10 pb-3">
                <div className="text-slate-400">Product</div>
                <div>YAI Studio</div>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3 border-b border-white/10 pb-3">
                <div className="text-slate-400">Role</div>
                <div>AI operator and creative suite</div>
              </div>
              <div className="grid grid-cols-[130px_1fr] gap-3">
                <div className="text-slate-400">Execution rule</div>
                <div>Authority verified before consequence-bearing actions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="suite" className="px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Suite applications</div>
            <h2 className="mt-2 text-3xl font-semibold">One suite. Multiple applications.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {suiteApps.map((app) => {
              const Icon = app.icon;
              return (
                <article key={app.title} className="flex h-full flex-col border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 text-emerald-200">
                      <Icon size={17} />
                      <h3 className="text-lg font-semibold text-white">{app.title}</h3>
                    </div>
                    <span className="rounded-full border border-white/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                      {app.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{app.body}</p>
                  <div className="mt-auto pt-5">
                    <Link href={app.href} className="inline-flex items-center rounded-md border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:border-emerald-300/60">
                      {app.cta}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="domains" className="border-y border-white/10 bg-black/20 px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Suggested domain entries</div>
            <h2 className="mt-2 text-2xl font-semibold">Dedicated hostnames mapped to YAI Studio</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {domains.map(([host, role]) => (
              <div key={host} className="border border-white/10 bg-white/[0.03] p-4">
                <div className="font-mono text-sm text-emerald-200">{host}</div>
                <div className="mt-2 text-sm text-slate-300">{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap" className="px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
          <article className="border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-xl font-semibold">Deployment plan</h3>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
              <li>Deploy route <code>/bpbsolutionsltd/yai-studio</code> on current BPB host.</li>
              <li>Point <code>yai</code>, <code>studio</code>, and <code>creator</code> subdomains to current deployment.</li>
              <li>Verify root rewrite for each host in middleware.</li>
              <li>Connect app-level APIs as each suite module reaches pilot readiness.</li>
            </ol>
          </article>

          <article className="border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-xl font-semibold">Boundary rule</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              GTCS4U remains the trade-governance product surface. YAI Studio is the separate AI
              product suite under BPB Solutions LTD. This keeps domains aligned and allows feature
              expansion without overloading GTCS4U positioning.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
