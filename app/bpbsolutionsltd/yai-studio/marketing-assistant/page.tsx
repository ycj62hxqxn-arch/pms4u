import Link from "next/link";
import type { Metadata } from "next";
import BackNavButton from "../../../components/BackNavButton";

export const metadata: Metadata = {
  title: "YAI Studio Marketing Assistant | BPB Solutions LTD",
  description: "Marketing Assistant module in YAI Studio (planned).",
};

export default function YaiStudioMarketingAssistantPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-white">
      <BackNavButton />
      <div className="mx-auto max-w-3xl border border-white/10 bg-white/[0.03] p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">YAI Studio</div>
        <h1 className="mt-3 text-3xl font-semibold">Marketing Assistant (Planned)</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          This module will support campaign drafts, positioning options, and channel copy variants,
          with governance checks before execution or publication.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link href="/bpbsolutionsltd/yai-studio" className="border border-white/20 px-3 py-2 hover:border-emerald-300/60">
            Back to YAI Studio
          </Link>
          <Link href="/marketing-research" className="border border-white/20 px-3 py-2 hover:border-emerald-300/60">
            Open Marketing Research
          </Link>
        </div>
      </div>
    </main>
  );
}
