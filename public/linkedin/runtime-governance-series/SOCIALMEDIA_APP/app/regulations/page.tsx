import Link from "next/link";

export default function RegulationsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10 md:px-10">
      <div className="rounded-2xl border border-white/[0.08] bg-[#16161a] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-violet-300">PulseNet Regulations</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Member rules and approval policy</h1>

        <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm text-zinc-300">
          <li>Use real identity information for your member account.</li>
          <li>Respect privacy and do not publish sensitive personal data.</li>
          <li>No hate, harassment, explicit abuse, or illegal content.</li>
          <li>Do not impersonate individuals, organizations, or authorities.</li>
          <li>Uploaded media must be owned by you or licensed for reuse.</li>
          <li>Account access is activated only after email confirmation.</li>
          <li>Repeated violations may lead to suspension or removal.</li>
        </ol>

        <div className="mt-6 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-xs text-violet-200">
          By checking the regulations checkbox on signup, you acknowledge and accept these rules.
        </div>

        <div className="mt-6">
          <Link href="/signup" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">
            Back to signup
          </Link>
        </div>
      </div>
    </main>
  );
}
