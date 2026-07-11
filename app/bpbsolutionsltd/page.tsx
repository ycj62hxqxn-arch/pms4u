import Link from "next/link";
import type { Metadata } from "next";
import { Building2, ExternalLink, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "BPB Solutions LTD — Corporate",
  description:
    "Corporate identity page for BPB Solutions LTD, separating company information from PMS4U research and GTCS4U platform operations.",
};

const corporateFacts = [
  ["Role", "Corporate entity and ownership umbrella"],
  ["Research layer", "PMS4U"],
  ["Platform layer", "GTCS4U"],
  ["Operating principle", "Authority before execution"],
];

const boundaries = [
  {
    title: "PMS4U",
    body: "Research, technical notes, doctrine, white papers, reference architecture, and standards.",
    href: "/research",
    cta: "Open research",
  },
  {
    title: "GTCS4U",
    body: "Enterprise AI governance platform: console, pilot, product demo, runtime proof, and case studies.",
    href: "/gtcs4u",
    cta: "Open platform",
  },
  {
    title: "YAI Studio",
    body: "AI product suite under BPB Solutions: Video Maker, Image Generator, Voice, Agents, and Marketing Assistant.",
    href: "/bpbsolutionsltd/yai-studio",
    cta: "Open YAI Studio",
  },
  {
    title: "Corporate contact",
    body: "Company-level contact, relationship routing, contracting context, and formal inquiries.",
    href: "mailto:info@bpbsolutionsltd.com",
    cta: "Email BPB",
  },
];

export default function BpbSolutionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/bpbsolutionsltd" className="text-sm font-bold tracking-[0.28em] text-slate-950">
            BPB SOLUTIONS LTD
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <a href="#company" className="hover:text-slate-950">
              Company
            </a>
            <a href="#boundaries" className="hover:text-slate-950">
              Domain Boundaries
            </a>
            <Link href="/bpbsolutionsltd/yai-studio" className="hover:text-slate-950">
              YAI Studio
            </Link>
            <Link href="/research" className="hover:text-slate-950">
              PMS4U
            </Link>
            <Link href="/gtcs4u" className="hover:text-slate-950">
              GTCS4U
            </Link>
          </div>
        </div>
      </nav>

      <section id="company" className="border-b border-slate-200 bg-white px-5 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-600">
              <Building2 size={15} />
              Corporate Layer
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-normal sm:text-6xl">
              BPB Solutions LTD is the corporate umbrella.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              This domain is intentionally corporate: company context, formal contact, and
              relationship routing. Research belongs to PMS4U. Product demonstrations and pilots
              belong to GTCS4U.
            </p>
          </div>

          <div className="border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              <ShieldCheck size={15} />
              Identity Map
            </div>
            <div className="grid gap-3 text-sm">
              {corporateFacts.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[130px_1fr] gap-4 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                  <div className="font-semibold text-slate-500">{label}</div>
                  <div className="text-slate-950">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="boundaries" className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 border-b border-slate-200 pb-5">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
              Domain Boundaries
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">One system, three public roles.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {boundaries.map((item) => {
              const external = item.href.startsWith("mailto:");
              const content = (
                <article className="h-full border border-slate-200 bg-white p-5 transition hover:border-slate-400">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                    {item.cta}
                    <ExternalLink size={15} />
                  </div>
                </article>
              );

              return external ? (
                <a key={item.title} href={item.href} className="block">
                  {content}
                </a>
              ) : (
                <Link key={item.title} href={item.href} className="block">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 px-5 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Corporate contact
            </div>
            <h2 className="mt-2 text-2xl font-semibold">Formal inquiries route through BPB Solutions LTD.</h2>
          </div>
          <a
            href="mailto:info@bpbsolutionsltd.com"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-100"
          >
            <Mail size={16} />
            Contact BPB
          </a>
        </div>
      </section>
    </main>
  );
}
