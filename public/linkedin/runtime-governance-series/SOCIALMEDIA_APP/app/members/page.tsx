"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Member = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  bio?: string;
  location?: string;
  avatar?: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/members");
        if (!res.ok) {
          setError("Failed to load members.");
          return;
        }
        const json = (await res.json()) as { members?: Member[] };
        setMembers(Array.isArray(json.members) ? json.members : []);
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 md:px-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Member Directory</h1>
        <p className="text-slate-300">{filtered.length} members in the network</p>
      </div>

      <div className="mb-6 rounded-xl border border-white/20 bg-black/30 px-4 py-2">
        <input
          type="text"
          placeholder="Search members by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-white outline-none placeholder:text-slate-400"
        />
      </div>

      {loading && <p className="text-center text-slate-300">Loading members...</p>}
      {error && <p className="text-center text-rose-300">{error}</p>}

      {!loading && members.length === 0 && (
        <p className="text-center text-slate-300">No members found.</p>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((member) => {
          const initials = member.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          return (
            <Link key={member.id} href={`/profile/${member.id}`}>
              <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 hover:border-white/30 transition cursor-pointer h-full">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-300 to-fuchsia-300 flex items-center justify-center text-lg font-bold text-slate-900 flex-shrink-0">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-white truncate">{member.name}</h2>
                    <p className="text-xs text-cyan-300 truncate">{member.email}</p>
                    {member.location && (
                      <p className="text-xs text-slate-400 mt-1">📍 {member.location}</p>
                    )}
                  </div>
                </div>

                {member.bio && (
                  <p className="mt-3 text-sm text-slate-300 line-clamp-2">{member.bio}</p>
                )}

                <p className="text-xs text-slate-500 mt-3">
                  Joined {new Date(member.createdAt).toLocaleDateString()}
                </p>
              </article>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
