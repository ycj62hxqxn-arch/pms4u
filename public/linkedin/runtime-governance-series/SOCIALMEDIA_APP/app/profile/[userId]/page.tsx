"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  name: string;
  createdAt: string;
  bio?: string;
  location?: string;
  avatar?: string;
  website?: string;
  followers?: string[];
  following?: string[];
};

const AVATAR_COLORS = [
  "from-violet-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-cyan-500 to-blue-500",
];

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.28 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} font-bold text-white ring-4 ring-[#0f0f11]`}
    >
      {initials}
    </div>
  );
}

export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    (async () => {
      const { userId: id } = await params;
      setUserId(id);
      const [profileRes, meRes] = await Promise.all([
        fetch(`/api/profile/${id}`),
        fetch("/api/auth/me"),
      ]);
      if (profileRes.ok) {
        const json = (await profileRes.json()) as { profile?: Profile };
        setProfile(json.profile ?? null);
      }
      if (meRes.ok) {
        const me = (await meRes.json()) as { userId?: string };
        setCurrentUserId(me.userId ?? "");
      }
      setLoading(false);
    })();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f11]">
        <div className="text-sm text-zinc-600">Loading…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0f0f11]">
        <p className="text-zinc-400">Profile not found.</p>
        <Link href="/feed" className="text-sm text-violet-400 hover:underline">
          Back to feed
        </Link>
      </div>
    );
  }

  const isOwn = currentUserId === userId;

  return (
    <div className="min-h-screen bg-[#0f0f11]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0f0f11]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
          <Link href="/" className="text-base font-bold">
            Pulse<span className="text-violet-400">Net</span>
          </Link>
          <Link href="/feed" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Feed
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Cover banner */}
        <div className="h-32 rounded-2xl bg-gradient-to-r from-violet-900/50 via-indigo-900/50 to-pink-900/30 md:h-44" />

        {/* Profile card */}
        <div className="-mt-6 rounded-2xl border border-white/[0.07] bg-[#16161a]">
          <div className="px-6 pb-6 pt-0">
            {/* Avatar + edit row */}
            <div className="-mt-8 mb-4 flex items-end justify-between">
              <Avatar name={profile.name} size={80} />
              {isOwn && (
                <Link
                  href={`/profile/${userId}/edit`}
                  className="rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Edit profile
                </Link>
              )}
            </div>

            <h1 className="text-xl font-bold text-white">{profile.name}</h1>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-500">
              {profile.location && <span>📍 {profile.location}</span>}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:underline"
                >
                  🔗 {profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              <span>
                Joined{" "}
                {new Date(profile.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {profile.bio && (
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="mt-6 flex gap-6 border-t border-white/[0.07] pt-5">
              <div>
                <span className="text-lg font-bold text-white">
                  {profile.followers?.length ?? 0}
                </span>
                <span className="ml-1.5 text-sm text-zinc-500">Followers</span>
              </div>
              <div>
                <span className="text-lg font-bold text-white">
                  {profile.following?.length ?? 0}
                </span>
                <span className="ml-1.5 text-sm text-zinc-500">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts placeholder */}
        <div className="mt-4 rounded-2xl border border-white/[0.07] bg-[#16161a] p-6 text-center text-sm text-zinc-600">
          Posts will appear here.
        </div>
      </main>
    </div>
  );
}
