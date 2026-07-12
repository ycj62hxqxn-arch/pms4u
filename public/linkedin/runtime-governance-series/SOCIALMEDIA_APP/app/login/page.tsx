"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json().catch(() => ({}))) as { message?: string };

    if (!response.ok) {
      setLoading(false);
      setMessage(data.message ?? "Login failed.");
      return;
    }

    router.push("/feed");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-3xl border border-white/15 bg-gradient-to-br from-white/15 to-white/5 p-8 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300">Welcome back</p>
        <h1 className="mt-3 text-3xl font-semibold">Login to PulseNet</h1>
        <p className="mt-2 text-sm text-slate-300">Access your feed, communities, and realtime social dashboard.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm text-slate-200">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 outline-none transition focus:border-cyan-300"
            />
          </label>
          <label className="block text-sm text-slate-200">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 outline-none transition focus:border-cyan-300"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-200 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-rose-200">{message}</p> : null}

        <p className="mt-6 text-sm text-slate-300">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Create your account
          </Link>
        </p>
      </section>
    </main>
  );
}
