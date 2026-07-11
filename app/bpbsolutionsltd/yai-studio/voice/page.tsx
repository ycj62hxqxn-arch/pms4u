import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAI Studio Voice | BPB Solutions LTD",
  description: "Voice module in YAI Studio (planned).",
};

export default function YaiStudioVoicePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-white">
      <div className="mx-auto max-w-3xl border border-white/10 bg-white/[0.03] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">YAI Studio</div>
        <h1 className="mt-3 text-3xl font-semibold">Voice (Planned)</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Voice generation is planned as a governed module for narration, ads, and support scripts.
          Publishing or outbound delivery remains blocked until operator approval.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/bpbsolutionsltd/yai-studio" className="border border-white/20 px-3 py-2 hover:border-emerald-300/60">
            Back to YAI Studio
          </Link>
          <Link href="/bpbsolutionsltd/yai-studio/video-maker" className="border border-emerald-300/40 bg-emerald-300/10 px-3 py-2 text-emerald-100 hover:border-emerald-200">
            Open Video Maker
          </Link>
        </div>
      </div>
    </main>
  );
}
