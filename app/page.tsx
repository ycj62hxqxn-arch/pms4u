export default function Home() {
  return (
    <main className="bg-white text-black min-h-screen px-6 py-12">

      {/* HERO */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Control Your Business. <br /> Eliminate Chaos.
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Most businesses don’t fail from lack of ideas — they fail from lack of execution.
        </p>

        <p className="text-md text-gray-500 mb-8">
          PMS4U helps you build structured systems, track execution, and scale with full control in 48 hours.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="https://wa.me/491723256044"
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Book a Call
          </a>

          <a
            href="#services"
            className="border px-6 py-3 rounded-lg"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="text-center mb-16 text-gray-500 text-sm">
        Trusted by operators, founders, and scaling teams
      </section>

      {/* PROBLEM */}
      <section className="max-w-4xl mx-auto mb-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          The Problem
        </h2>

        <p className="text-gray-600">
          Lack of structure, unclear responsibilities, and missing tracking systems 
          lead to chaos, delays, and lost revenue.
        </p>
      </section>

      {/* SOLUTION */}
      <section className="max-w-4xl mx-auto mb-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          The Solution
        </h2>

        <p className="text-gray-600">
          We implement execution systems that give you full visibility, accountability,
          and control — without complexity.
        </p>
      </section>

      {/* SERVICES */}
      <section id="services" className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-semibold text-center mb-10">
          What We Do
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="font-bold mb-2">System Setup</h3>
            <p className="text-gray-600">
              Build structured workflows tailored to your business operations.
            </p>
          </div>

          <div className="border p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="font-bold mb-2">Execution Tracking</h3>
            <p className="text-gray-600">
              Monitor performance, accountability, and progress in real-time.
            </p>
          </div>

          <div className="border p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="font-bold mb-2">Governance Control</h3>
            <p className="text-gray-600">
              Define roles, decisions, and structure across your organization.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center mb-20">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to Take Control?
        </h2>

        <p className="text-gray-600 mb-6">
          Get your operational system implemented in less than 48 hours.
        </p>

        <a
          href="https://wa.me/491723256044"
          className="bg-black text-white px-8 py-4 rounded-lg text-lg"
        >
          Start Now
        </a>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-400 text-sm">
        © 2026 PMS4U — BPB Solutions LTD
      </footer>

    </main>
  );
}