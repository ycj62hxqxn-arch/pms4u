"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Profile = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  bio?: string;
  location?: string;
  avatar?: string;
  website?: string;
  followers?: string[];
  following?: string[];
};

export default function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    (async () => {
      const { userId: id } = await params;
      setUserId(id);

      try {
        const res = await fetch(`/api/profile/${id}`);
        if (!res.ok) {
          setError("Profile not found.");
          return;
        }
        const json = (await res.json()) as { profile?: Profile };
        setProfile(json.profile || null);
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  if (loading) return <div className="text-center py-10 text-slate-300">Loading profile...</div>;
  if (error) return <div className="text-center py-10 text-rose-300">{error}</div>;
  if (!profile) return <div className="text-center py-10 text-slate-300">Profile not found.</div>;

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-4">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-300 to-fuchsia-300 flex items-center justify-center text-2xl font-bold text-slate-900">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold">{profile.name}</h1>
              <p className="text-sm text-cyan-300 mt-1">{profile.email}</p>
              {profile.location && <p className="text-sm text-slate-300 mt-1">📍 {profile.location}</p>}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-200 hover:underline mt-1">
                  🔗 {profile.website}
                </a>
              )}
            </div>
          </div>
          <Link href={`/profile/${userId}/edit`} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-200">
            Edit Profile
          </Link>
        </div>

        {profile.bio && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-slate-200">{profile.bio}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-xs text-cyan-300 uppercase tracking-wide">Followers</p>
            <p className="text-2xl font-bold mt-1">{profile.followers?.length ?? 0}</p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-3">
            <p className="text-xs text-cyan-300 uppercase tracking-wide">Following</p>
            <p className="text-2xl font-bold mt-1">{profile.following?.length ?? 0}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-400">
          <p>Joined {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </main>
  );
}
