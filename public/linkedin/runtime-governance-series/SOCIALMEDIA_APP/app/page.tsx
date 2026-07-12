import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col">
      <nav className="border-b border-white/[0.07] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            Pulse<span className="text-violet-400">Net</span>
          </span>
          <div className="flex gap-3">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
          ✦ Now live &mdash; join the network today
        </div>
        <h1 className="max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl">
          Your network,
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            built different.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
          PulseNet is a modern social platform — real feed, rich profiles, real connections. Built for the people who move fast.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:bg-violet-500 transition-colors"
          >
            Create free account
          </Link>
          <Link
            href="/feed"
            className="rounded-xl border border-white/[0.12] bg-white/[0.06] px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Browse feed →
          </Link>
        </div>

        <div className="mt-24 grid w-full max-w-4xl grid-cols-1 gap-4 text-left md:grid-cols-3">
          {[
            { icon: "⚡", title: "Live Feed", desc: "Posts, likes, comments and media — everything in one stream." },
            { icon: "◉", title: "Rich Profiles", desc: "Full member profiles with bio, location, links and social stats." },
            { icon: "◎", title: "Member Network", desc: "Find and connect with everyone in your community." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/[0.07] bg-[#16161a] p-6">
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/[0.07] py-4 text-center text-xs text-zinc-700">
        © 2026 PulseNet
      </footer>
    </div>
  );
}
