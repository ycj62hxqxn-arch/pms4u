import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import FeedClient from "./feed-client";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";

export default async function FeedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    redirect("/login");
  }

  let session: { name: string; email: string } | null = null;
  try {
    const verified = await verifySessionToken(token);
    session = { name: verified.name, email: verified.email };
  } catch {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 md:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/15 bg-black/30 p-6 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Live Feed</p>
          <h1 className="mt-2 text-3xl font-semibold">Welcome, {session.name}</h1>
          <p className="text-sm text-slate-300">Signed in as {session.email}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/members" className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:border-white">
            Members
          </Link>
          <Link href="/profile" className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:border-white">
            My Profile
          </Link>
          <LogoutButton />
        </div>
      </header>

      <FeedClient currentUserEmail={session.email} />
    </main>
  );
}
