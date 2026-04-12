import Image from "next/image";
import ExecutionBoundarySection from "./components/ExecutionBoundarySection";

export default function Home() {
  return (
    <main className="text-white min-h-screen px-6 overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/40 border-b border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-semibold tracking-widest">PMS4U</div>

          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#framework" className="hover:text-white transition">Framework</a>
            <a href="#how" className="hover:text-white transition">System</a>
            <a href="/authority" className="hover:text-white transition">Authority</a>
            <a href="/shab-report" className="hover:text-white transition">Shab Report</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative max-w-5xl mx-auto text-center pt-48 pb-40">

        {/* Animated Glow */}
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="w-[700px] h-[700px] bg-white/10 blur-[160px] rounded-full animate-pulse" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-white via-gray-300 to-gray-600 bg-clip-text text-transparent">
            Control Execution.
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-6">
          Without Slowing It Down.
        </p>

        <p className="text-gray-500 max-w-2xl mx-auto">
          Governance-first execution system that enforces control,
          validates decisions, and produces evidence.
        </p>

        <div className="flex justify-center gap-4 mt-12">
          <a
            href="https://wa.me/491723256044"
            className="bg-white text-black px-6 py-3 rounded-lg hover:scale-105 hover:shadow-xl transition duration-300"
          >
            Request Briefing
          </a>

          <a
            href="#framework"
            className="border border-white/20 px-6 py-3 rounded-lg hover:border-white hover:scale-105 transition duration-300"
          >
            Explore System
          </a>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-px bg-white/10 max-w-6xl mx-auto" />

      {/* FRAMEWORK */}
      <section id="framework" className="max-w-6xl mx-auto py-32 relative">

        {/* Background depth */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />

        <h2 className="text-3xl text-center mb-16 tracking-wide">
          Framework Architecture
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {[
            {
              src: "/assets/frameworks/stack.png",
              title: "9-Layer Authority System",
            },
            {
              src: "/assets/frameworks/drift.png",
              title: "Reality Drift Boundary",
            },
            {
              src: "/assets/frameworks/pms.png",
              title: "Governance Stack",
            },
            {
              src: "/assets/frameworks/system.png",
              title: "System Invariance",
            },
          ].map((item, i) => (

            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/30 transition duration-500"
            >

              {/* IMAGE */}
              <Image
                src={item.src}
                alt={item.title}
                width={1200}
                height={800}
                className="w-full h-auto"
              />

              {/* LIGHT SWEEP 🔥 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition duration-1000" />
              </div>

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
                <p className="text-lg font-medium tracking-wide">
                  {item.title}
                </p>
              </div>

            </div>

          ))}

        </div>
      </section>

      {/* HOW */}
      <section id="how" className="max-w-6xl mx-auto py-32 bg-white/[0.02] rounded-2xl px-6">

        <h2 className="text-3xl text-center mb-16">
          Execution System
        </h2>

        <div className="grid md:grid-cols-4 gap-6 text-center">

          {[
            ["Intake", "Capture intent"],
            ["Validation", "GO / NO-GO"],
            ["Execution", "Controlled actions"],
            ["Evidence", "Immutable proof"],
          ].map(([title, desc], i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/40 hover:scale-[1.05] hover:-translate-y-2 transition duration-300"
            >
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}

        </div>
      </section>

      <ExecutionBoundarySection />

      {/* PROOF */}
      <section className="max-w-5xl mx-auto py-32 text-center">
        <h2 className="text-3xl mb-10">What It Proves</h2>

        <div className="space-y-4 text-gray-400 text-lg">
          <p>Human-controlled execution authority</p>
          <p>Separation of duties</p>
          <p>Continuity across time</p>
          <p>Evidence-first systems</p>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="text-center py-32">
        <h2 className="text-3xl mb-6">
          Request a Private Briefing
        </h2>

        <a
          href="https://wa.me/491723256044"
          className="bg-white text-black px-8 py-4 rounded-lg hover:scale-105 hover:shadow-xl transition duration-300"
        >
          Contact Now
        </a>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-600 text-sm pb-10">
        © 2026 PMS4U — BPB Solutions LTD
      </footer>

    </main>
  );
}