export default function Home() {
  return (
    <main className="text-white min-h-screen px-6">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/50 border-b border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="font-semibold tracking-wide">PMS4U</div>

          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#how" className="hover:text-white transition">System</a>
            <a href="/authority" className="hover:text-white transition">Authority</a>
            <a href="https://wa.me/491723256044" className="hover:text-white transition">
              Contact
            </a>
          </div>

        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-5xl mx-auto text-center pt-48 pb-32 fade-in">
        
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Control Execution.
        </h1>

        <p className="text-xl text-gray-300 mb-6">
          Without Slowing It Down.
        </p>

        <p className="text-gray-500 max-w-2xl mx-auto">
          PMS4U is a governance-first execution system that enforces control, validates decisions,
          and produces evidence — so operations scale without chaos.
        </p>

        <div className="flex justify-center gap-4 mt-10">

          <a
            href="https://wa.me/491723256044"
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:scale-105 transition"
          >
            Request a Briefing
          </a>

          <a
            href="/authority"
            className="border border-white/20 px-6 py-3 rounded-lg hover:border-white hover:scale-105 transition"
          >
            View Portfolio
          </a>

        </div>

      </section>

      {/* DIVIDER */}
      <div className="h-px bg-white/10 max-w-6xl mx-auto" />

      {/* HOW */}
      <section id="how" className="max-w-6xl mx-auto py-32 fade-in">
        
        <h2 className="text-3xl text-center mb-16">
          Execution System
        </h2>

        <div className="grid md:grid-cols-4 gap-6 text-center">

          {[
            ["Intake", "Capture intent and constraints"],
            ["Validation", "GO / NO-GO before risk"],
            ["Execution", "Controlled actions under roles"],
            ["Evidence", "Immutable proof & traceability"],
          ].map(([title, desc], i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/40 hover:scale-105 transition"
            >
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* PROOF */}
      <section className="max-w-5xl mx-auto py-32 text-center fade-in">
        
        <h2 className="text-3xl mb-10">
          What It Proves
        </h2>

        <div className="space-y-4 text-gray-400 text-lg">
          <p>Human-controlled execution authority</p>
          <p>Separation of duties across operations</p>
          <p>Continuity of knowledge across time</p>
          <p>Evidence-first scalable systems</p>
        </div>

      </section>

      {/* CTA */}
      <section className="text-center py-32 fade-in">
        
        <h2 className="text-3xl mb-6">
          Request a Private Briefing
        </h2>

        <a
          href="https://wa.me/491723256044"
          className="bg-white text-black px-8 py-4 rounded-lg text-lg hover:scale-105 transition"
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