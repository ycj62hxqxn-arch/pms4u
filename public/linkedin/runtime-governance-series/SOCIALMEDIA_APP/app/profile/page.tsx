"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Profile = {
  id: string;
  name: string;
  email: string;
};

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const json = (await res.json()) as { session?: { userId: string; name: string; email: string } };
        if (json.session) {
          setProfile({
            id: json.session.userId,
            name: json.session.name,
            email: json.session.email,
          });
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) return <div className="text-center py-10 text-slate-300">Loading...</div>;
  if (!profile) return <div className="text-center py-10 text-slate-300">Not found.</div>;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 md:px-10">
      <div className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <p className="text-slate-300 mb-6">Welcome, {profile.name}!</p>

        <div className="flex gap-3">
          <Link href={`/profile/${profile.id}`} className="rounded-xl bg-cyan-300 px-6 py-2 font-semibold text-slate-900 hover:bg-cyan-200">
            View Profile
          </Link>
          <Link href={`/profile/${profile.id}/edit`} className="rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-6 py-2 font-semibold text-cyan-100 hover:border-cyan-200">
            Edit Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
