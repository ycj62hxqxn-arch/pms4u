import FadeIn from "../components/FadeIn";

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
            Multi-Entity Governance Architecture
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Built across Cairo, UAE, UK, and EU — PMS4U is a production-proven execution control system backed by real operations, real capital, and real evidence.
          </p>
        </section>
      </FadeIn>

      {/* IDENTITY */}
      <FadeIn>
        <section className="max-w-5xl mx-auto py-20 border-t border-white/10 text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Authority Holder
          </h2>

          <p className="text-xl font-medium">
            Alaa Mahmoud Abdelbasit Atia
          </p>

          <p className="text-gray-400 mt-4">
            Doctrine Creator · Capital Steward · Operational Overseer · Strategic Advisor
          </p>
        </section>
      </FadeIn>

      {/* ENTITIES */}
      <FadeIn>
        <section className="max-w-6xl mx-auto py-20 border-t border-white/10">
          <h2 className="text-3xl text-center mb-12">
            Entity Structure
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {[
              ["Al-Catara Big G Gov — Cairo", "Governance doctrine creation, G-LAW / PMS-LAW systems, market research operations."],
              ["Value LLC — Al-Sharjah, UAE", "Capital management and CARSHUNTER logistics funding."],
              ["BPB Solutions LTD — UK", "System deployment, governance implementation, client execution."],
              ["AA Investitionen — Germany", "Advisory-only entity with strict separation from execution and capital."],
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

      {/* SYSTEMS */}
      <FadeIn>
        <section className="max-w-6xl mx-auto py-20 border-t border-white/10">
          <h2 className="text-3xl text-center mb-12">
            Systems Portfolio
          </h2>

          <div className="space-y-6">

            {[
              ["PMS Govern", "Python-based governance engine with validation gates, immutable ledger, and role-based execution control."],
              ["Document Processing Suite", "Automated HTML → PDF/DOCX pipelines with structured evidence generation."],
              ["Evidence Vault", "SHA256-based immutable storage ensuring full traceability and proof."],
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

      {/* FRAMEWORK */}
      <FadeIn>
        <section className="max-w-5xl mx-auto py-20 border-t border-white/10 text-center bg-white/[0.02] rounded-2xl px-6">
          <h2 className="text-3xl mb-10">
            PMS4U Framework
          </h2>

          <div className="space-y-4 text-gray-400">
            <p>AA → YAI → AI Authority Gate</p>
            <p>Validation before execution</p>
            <p>Immutable evidence after execution</p>
            <p>Separation of duties across entities</p>
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