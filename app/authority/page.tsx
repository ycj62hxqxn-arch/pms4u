import Image from "next/image";
import type { Metadata } from "next";
import FadeIn from "../components/FadeIn";

export const metadata: Metadata = {
  title: "Authority Resolution",
  description:
    "Founder and chief architect profile for PMS4U, focused on execution governance, authority resolution, and consequence-bearing runtime control.",
  alternates: {
    canonical: "/authority",
  },
  openGraph: {
    title: "Authority Resolution | PMS4U",
    description:
      "Founder and chief architect profile for PMS4U, focused on execution governance, authority resolution, and consequence-bearing runtime control.",
    url: "/authority",
  },
};

export default function Authority() {
  return (
    <main className="text-white min-h-screen px-6 authority-bg">

      {/* HERO */}
      <FadeIn>
        <section className="max-w-5xl mx-auto py-24 text-center relative">

          {/* Glow */}
          <div className="absolute inset-0 -z-10 flex justify-center">
            <div className="w-[500px] h-[500px] bg-white/10 blur-[120px] rounded-full" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Authority Resolution
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Runtime authority resolution for consequence-bearing execution, designed and led by the PMS4U founder.
          </p>

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 text-left text-sm md:grid-cols-3">
            {[
              ["Discipline", "Execution Governance"],
              ["Architecture", "Constitutional Execution Infrastructure"],
              ["Implementation", "PMS4U Runtime Governance OS"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">{label}</div>
                <div className="mt-3 text-white">{value}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* IDENTITY */}
      <FadeIn>
        <section className="max-w-5xl mx-auto py-20 border-t border-white/10 text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Founder
          </h2>

          <div className="mx-auto mb-8 w-44 h-44 overflow-hidden rounded-2xl border border-white/15 bg-white/5">
            <Image
              src="/assets/founder/alaa-founder-2026-v2.jpg"
              alt="Founder portrait"
              width={352}
              height={352}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <p className="text-xl font-medium">
            Alaa Mahmoud Abdelbasit Atia
          </p>

          <p className="text-gray-400 mt-4">
            Founder & Chief Architect, PMS4U · Execution Governance Researcher
          </p>
        </section>
      </FadeIn>

      {/* PROFESSIONAL PROFILE */}
      <FadeIn>
        <section className="max-w-6xl mx-auto py-20 border-t border-white/10">
          <h2 className="text-3xl text-center mb-12">
            Professional Profile
          </h2>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10">
            <p className="text-gray-300 leading-8">
              Founder-operator profile focused on Governance, Risk, and Compliance (GRC), Information Security governance,
              and runtime execution control for high-consequence workflows. The core specialization is Execution Governance:
              authority validation, admissibility checks, traceable evidence creation, and replay-ready auditability before
              consequence-bearing execution occurs.
            </p>
            <p className="text-gray-400 mt-5 leading-8">
              AI governance is one application domain of this work. The same architecture applies to enterprise workflows,
              financial systems, industrial automation, regulated operations, and autonomous execution environments.
            </p>
          </div>
        </section>
      </FadeIn>

      {/* EXPERIENCE HIGHLIGHTS */}
      <FadeIn>
        <section className="max-w-6xl mx-auto py-20 border-t border-white/10">
          <h2 className="text-3xl text-center mb-12">
            Experience Highlights
          </h2>

          <div className="space-y-5">
            {[
              [
                "Founder & System Architect — BPB Solutions Limited (2023–Present)",
                "Designed governance-driven runtime systems where authority, decision boundaries, and accountability are enforced before execution.",
              ],
              [
                "Business Owner — Alaa Atia Investitionen und Beratung (2020–Present)",
                "Cross-border trade and advisory operations that informed real-world governance design requirements.",
              ],
              [
                "Project Lead, Market Intelligence & Field Operations — Leyhausen Field Services International (2016–2020)",
                "Led multilingual research operations, localization quality controls, and execution reliability workflows across regions.",
              ],
              [
                "Project Management & Team Leadership (2011–2015)",
                "Operational project execution, onboarding, coaching, and performance governance in field and enterprise contexts.",
              ],
            ].map(([title, desc], i) => (
              <article
                key={i}
                className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/40 transition duration-300"
              >
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-7">{desc}</p>
              </article>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* SELECTED CERTIFICATIONS */}
      <FadeIn>
        <section className="max-w-6xl mx-auto py-20 border-t border-white/10">
          <h2 className="text-3xl text-center mb-12">
            Selected Certifications
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "CompTIA Project+ (active cycle through 2028)",
              "PRINCE2® Foundation",
              "ITIL Foundation Certificate in IT Service Management",
              "SAP Certified Application Associate — S/4HANA Financial Accounting",
              "SAP Certified Application Associate — S/4HANA Cloud Sales",
              "SAP User Certification",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md p-5 rounded-xl border border-white/10 hover:border-white/40 transition duration-300"
              >
                <p className="text-gray-300 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* BACKGROUND */}
      <FadeIn>
        <section className="max-w-6xl mx-auto py-20 border-t border-white/10">
          <h2 className="text-3xl text-center mb-12">
            Background & Focus
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {[
              ["Governance Doctrine", "Developed the execution doctrine where authority and admissibility are resolved before consequence-bearing transitions."],
              ["Runtime Product Building", "Focused on practical runtime surfaces for evidence, traceability, replay, and decision transparency."],
              ["Cross-Market Operating Context", "Builds across Cairo, UAE, UK, and EU business contexts with strong separation between advisory and execution roles."],
              ["Pilot-Oriented Delivery", "Prioritizes controlled pilots with measurable governance proof, signed evidence, and operational clarity."],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/40 hover:scale-[1.02] transition duration-300"
              >
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}

          </div>
        </section>
      </FadeIn>

      {/* OPERATING PRINCIPLES */}
      <FadeIn>
        <section className="max-w-6xl mx-auto py-20 border-t border-white/10">
          <h2 className="text-3xl text-center mb-12">
            Operating Principles
          </h2>

          <div className="space-y-6">

            {[
              ["Authority before execution", "No consequential transition should proceed without explicit authority context."],
              ["Evidence by default", "Every admissible transition should produce durable, auditable evidence artifacts."],
              ["Replayable operations", "Operational history should be reconstructible for diligence, audit, and verification."],
              ["Claim discipline", "Public claims stay tied to proven runtime behavior and signed validation."],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/40 transition duration-300"
              >
                <h3 className="font-semibold">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}

          </div>
        </section>
      </FadeIn>

      {/* CURRENT BUILD PRIORITIES */}
      <FadeIn>
        <section className="max-w-5xl mx-auto py-20 border-t border-white/10 text-center bg-white/[0.02] rounded-2xl px-6">
          <h2 className="text-3xl mb-10">
            Current Priorities
          </h2>

          <div className="space-y-4 text-gray-400">
            <p>Stabilize runtime governance surfaces for enterprise pilots</p>
            <p>Expand evidence and replay quality metrics</p>
            <p>Package integration-ready APIs and deployment modes</p>
            <p>Convert pilot outputs into signed commercial proof</p>
          </div>
        </section>
      </FadeIn>

      {/* CTA */}
      <FadeIn>
        <section className="text-center py-24 border-t border-white/10">
          <h2 className="text-2xl mb-6">
            Request Full Briefing
          </h2>

          <a
            href="https://wa.me/491723256044"
            className="bg-white text-black px-8 py-4 rounded-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            Contact Now
          </a>
        </section>
      </FadeIn>

    </main>
  );
}
