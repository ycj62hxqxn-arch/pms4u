"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationLink, setVerificationLink] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setSuccess("");
    setVerificationLink("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, acceptTerms }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; verificationLink?: string };
      if (!res.ok) {
        setLoading(false);
        setError(data.message ?? "Signup failed.");
        return;
      }
      setLoading(false);
      setSuccess(data.message ?? "Account created. Check your email to verify.");
      setVerificationLink(data.verificationLink ?? "");
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f11] px-4">
      <Link href="/" className="mb-8 text-2xl font-bold tracking-tight">
        Pulse<span className="text-violet-400">Net</span>
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-zinc-400">Join PulseNet — it only takes a minute.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Full name</label>
            <input
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full rounded-xl border border-white/[0.1] bg-[#16161a] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
            />
          </div>
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
              placeholder="Min. 8 characters"
              className="w-full rounded-xl border border-white/[0.1] bg-[#16161a] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
            />
          </div>

          <label className="flex items-start gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5"
              required
            />
            <span>
              I accept the platform regulations and member policy.
              {" "}
              <Link href="/regulations" className="text-violet-400 hover:underline">
                Read regulations
              </Link>
            </span>
          </label>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </p>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              <p>{success}</p>
              {verificationLink && (
                <p className="mt-2 text-xs text-emerald-200">
                  Dev link: <a className="underline" href={verificationLink}>Verify now</a>
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !acceptTerms}
            className="mt-2 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already a member?{" "}
          <Link href="/login" className="font-semibold text-violet-400 transition-colors hover:text-violet-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
