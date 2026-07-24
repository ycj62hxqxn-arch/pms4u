"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState<"0" | "1" | "">("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("verified");

    if (value !== "0" && value !== "1") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setVerified(value);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    if (!res.ok) {
      setLoading(false);
      setError(data.message ?? "Login failed.");
      return;
    }
    router.push("/feed");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f11] px-4">
      <Link href="/" className="mb-8 text-2xl font-bold tracking-tight">
        Pulse<span className="text-violet-400">Net</span>
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-400">Sign in to your account to continue.</p>
        {verified === "1" && (
          <p className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            Email verified. Your member account is active.
          </p>
        )}
        {verified === "0" && (
          <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            Verification link is invalid or expired.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/[0.1] bg-[#16161a] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/[0.1] bg-[#16161a] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          New to PulseNet?{" "}
          <Link href="/signup" className="font-semibold text-violet-400 transition-colors hover:text-violet-300">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
