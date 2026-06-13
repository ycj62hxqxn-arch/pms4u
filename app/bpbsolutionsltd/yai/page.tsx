import type { Metadata } from "next";
import Link from "next/link";
import YaiConsole from "../../yai/YaiConsole";

export const metadata: Metadata = {
  title: "YAI Local | BPB Solutions LTD",
  description:
    "BPB Solutions LTD YAI Local console for PMS4U execution governance, operator guidance, and traceable local fallback.",
};

export default function BpbYaiPage() {
  return (
    <>
      <div className="border-b border-emerald-300/20 bg-emerald-950/20 px-5 py-3 text-sm text-emerald-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold">BPB Solutions LTD YAI Local</span>
          <Link href="/bpbsolutionsltd" className="text-emerald-200 underline-offset-4 hover:underline">
            Back to BPB site
          </Link>
        </div>
      </div>
      <YaiConsole />
    </>
  );
}
