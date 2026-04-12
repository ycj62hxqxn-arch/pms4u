export default function ShabReport() {
  return (
    <main className="text-white min-h-screen px-6 py-20">
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          BPB Shab Department — Governance-OS Report
        </h1>
        <p className="text-gray-400 max-w-3xl mx-auto">
          External client-facing overview of the Governance-OS architecture and the Governed
          Execution Gateway runtime. This report summarizes operational readiness, governance
          controls, and execution assurance for stakeholders.
        </p>
      </section>

      <section className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Governance-First Execution",
            desc: "Runtime control plane ensuring only admissible and authorized actions execute.",
          },
          {
            title: "Evidence & Auditability",
            desc: "Evidence Freeze preserves immutable audit trails for every execution decision.",
          },
          {
            title: "Operational State Engine",
            desc: "State transitions track admissibility, authority, risk, and execution outcomes.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto mt-16 bg-white/[0.03] border border-white/10 rounded-2xl p-8">
        <h2 className="text-2xl mb-4">Execution Governance Pipeline</h2>
        <p className="text-gray-400">
          AI Decision → Admissibility → Authority Verification → Execution Gate → Approved/Blocked →
          Evidence Freeze → History → State Update
        </p>
      </section>

      <section className="max-w-6xl mx-auto mt-16 grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl mb-3">Governance Stack</h3>
          <ul className="space-y-2 text-gray-400">
            <li>PMS — Policy management and command validation</li>
            <li>QGED — Governance gate engine and decision control</li>
            <li>ALCATARA — Decision logic and workflow control</li>
            <li>RAM — Regulatory architecture and compliance automation</li>
            <li>Evidence Freeze — Immutable audit snapshots</li>
          </ul>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl mb-3">Operational Snapshot</h3>
          <div className="grid grid-cols-2 gap-4 text-gray-400">
            <div>
              <p className="text-sm">Executions Today</p>
              <p className="text-2xl text-white">87</p>
            </div>
            <div>
              <p className="text-sm">Approved</p>
              <p className="text-2xl text-white">73</p>
            </div>
            <div>
              <p className="text-sm">Blocked</p>
              <p className="text-2xl text-white">14</p>
            </div>
            <div>
              <p className="text-sm">Avg Risk Score</p>
              <p className="text-2xl text-white">0.32</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-16 text-center">
        <h2 className="text-2xl mb-4">Client-Facing Next Steps</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          The Shab Department external cut focuses on readiness, execution assurance, and the
          governance roadmap. For detailed evidence ingestion and enterprise integration mapping,
          a full briefing is available upon request.
        </p>
        <a
          href="https://wa.me/491723256044"
          className="inline-block mt-8 bg-white text-black px-8 py-4 rounded-lg hover:scale-105 hover:shadow-xl transition duration-300"
        >
          Request the Full Report
        </a>
      </section>
    </main>
  );
}
