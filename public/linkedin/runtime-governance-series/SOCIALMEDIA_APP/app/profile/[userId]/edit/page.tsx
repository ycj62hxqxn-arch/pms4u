"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
};

export default function EditProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState("");

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
        const p = json.profile;
        if (p) {
          setProfile(p);
          setBio(p.bio || "");
          setLocation(p.location || "");
          setWebsite(p.website || "");
        }
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  async function handleSave() {
    if (!userId) return;
    setError("");
    setSuccess("");
    setIsSaving(true);

    const res = await fetch(`/api/profile/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio: bio || undefined,
        location: location || undefined,
        website: website || undefined,
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      setError(err.message || "Failed to update profile.");
      setIsSaving(false);
      return;
    }

    setSuccess("Profile updated!");
    setIsSaving(false);
    setTimeout(() => router.push(`/profile/${userId}`), 1000);
  }

  if (loading) return <div className="text-center py-10 text-slate-300">Loading...</div>;
  if (error && !profile) return <div className="text-center py-10 text-rose-300">{error}</div>;
  if (!profile) return <div className="text-center py-10 text-slate-300">Not found.</div>;

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 md:px-10">
      <Link href={`/profile/${userId}`} className="text-sm text-cyan-300 hover:underline mb-6 inline-block">
        ← Back to profile
      </Link>

      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-8">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

        {error && <div className="mb-4 rounded-lg bg-rose-400/10 border border-rose-400/30 px-4 py-2 text-sm text-rose-300">{error}</div>}
        {success && <div className="mb-4 rounded-lg bg-cyan-400/10 border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300">{success}</div>}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-white outline-none ring-cyan-300/40 focus:ring"
              rows={4}
              placeholder="Tell us about yourself..."
            />
            <p className="text-xs text-slate-400 mt-1">{bio.length}/500</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={100}
              className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-white outline-none ring-cyan-300/40 focus:ring"
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-white outline-none ring-cyan-300/40 focus:ring"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-cyan-300 px-6 py-2 font-semibold text-slate-900 hover:bg-cyan-200 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href={`/profile/${userId}`}
            className="rounded-xl border border-white/30 bg-white/10 px-6 py-2 font-semibold hover:border-white"
          >
            Cancel
          </Link>
        </div>
      </div>
    </main>
  );
}
