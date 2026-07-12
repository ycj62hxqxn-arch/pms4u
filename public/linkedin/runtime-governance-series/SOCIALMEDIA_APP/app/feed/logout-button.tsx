"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    if (loading) return;
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:border-white disabled:opacity-70"
      type="button"
    >
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
