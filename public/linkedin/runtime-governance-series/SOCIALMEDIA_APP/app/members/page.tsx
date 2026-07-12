"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Member = {
  id: string;
  name: string;
  createdAt: string;
  bio?: string;
  location?: string;
};

const AVATAR_COLORS = [
  "from-violet-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-cyan-500 to-blue-500",
];

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-sm font-bold text-white`}
    >
      {initials}
    </div>
  );
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((json: { members?: Member[] }) =>
        setMembers(Array.isArray(json.members) ? json.members : [])
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.location ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f11]">
      <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0f0f11]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Pulse<span className="text-violet-400">Net</span>
          </Link>
          <Link
            href="/feed"
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/[0.07] hover:text-white transition-colors"
          >
            Feed
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Members</h1>
          <p className="mt-1 text-sm text-zinc-500">{members.length} people in the network</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members…"
            className="w-full rounded-xl border border-white/[0.1] bg-[#16161a] py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
          />
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex animate-pulse gap-3 rounded-2xl border border-white/[0.07] bg-[#16161a] p-4"
              >
                <div className="h-12 w-12 shrink-0 rounded-full bg-white/[0.07]" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 w-24 rounded bg-white/[0.07]" />
                  <div className="h-3 w-32 rounded bg-white/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Member grid */}
        {!loading && (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member) => (
              <Link key={member.id} href={`/profile/${member.id}`}>
                <article className="group flex cursor-pointer gap-3 rounded-2xl border border-white/[0.07] bg-[#16161a] p-4 transition-all hover:border-violet-500/40 hover:bg-[#1c1c22]">
                  <Avatar name={member.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-violet-300">
                      {member.name}
                    </p>
                    {member.location ? (
                      <p className="mt-0.5 truncate text-xs text-zinc-500">📍 {member.location}</p>
                    ) : (
                      <p className="mt-0.5 text-xs text-zinc-600">
                        Joined{" "}
                        {new Date(member.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    {member.bio && (
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{member.bio}</p>
                    )}
                  </div>
                  <svg
                    className="h-4 w-4 shrink-0 self-center text-zinc-700 transition-colors group-hover:text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </article>
              </Link>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-500">
            No members match your search.
          </p>
        )}
      </main>
    </div>
  );
}
