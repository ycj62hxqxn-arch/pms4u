import Link from "next/link";

const highlights = [
  "AI-curated home feed",
  "Real-time chat and notifications",
  "Groups and community moderation",
  "Creator and business profile tools",
  "Safe growth controls and trust layers",
] as const;

const productSlices = [
  {
    title: "Modern Feed UX",
    text: "High-density story cards, short-form media rails, reactions, comments, and saved content patterns.",
  },
  {
    title: "Identity & Auth",
    text: "Signup, login, session cookie auth, and extensible account settings prepared for OAuth providers.",
  },
  {
    title: "Realtime Layer",
    text: "Messaging and notifications architecture ready for WebSocket transport and event fanout.",
  },
  {
    title: "Creator Monetization",
    text: "Foundations for subscriptions, premium posts, ad surfaces, and analytics-driven growth.",
  },
] as const;

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10 md:px-10">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-28 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />

      <section className="mx-auto max-w-6xl rounded-3xl border border-white/15 bg-gradient-to-br from-white/15 to-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">PulseNet Social OS</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          High-end social platform starter with working auth and modern product-grade UI.
        </h1>
        <p className="mt-5 max-w-3xl text-base text-slate-200 md:text-lg">
          Designed for teams building a serious Facebook-class competitor: premium interface patterns, account system, and scalable architecture foundations.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-200">
            Create account
          </Link>
          <Link href="/login" className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:border-white">
            Login
          </Link>
          <Link href="/members" className="rounded-xl border border-fuchsia-300/40 bg-fuchsia-400/10 px-5 py-3 text-sm font-semibold text-fuchsia-100 transition hover:border-fuchsia-200">
            View members
          </Link>
          <Link href="/feed" className="rounded-xl border border-fuchsia-300/40 bg-fuchsia-400/10 px-5 py-3 text-sm font-semibold text-fuchsia-100 transition hover:border-fuchsia-200">
            Open feed
          </Link>
        </div>

        <ul className="mt-8 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
          {highlights.map((item) => (
            <li key={item}>✦ {item}</li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-2">
        {productSlices.map((slice) => (
          <article key={slice.title} className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold">{slice.title}</h2>
            <p className="mt-2 text-slate-300">{slice.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
