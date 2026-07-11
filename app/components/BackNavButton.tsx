"use client";

import { useRouter } from "next/navigation";

type BackNavButtonProps = {
  fallbackHref?: string;
  className?: string;
};

export default function BackNavButton({
  fallbackHref = "/bpbsolutionsltd",
  className = "fixed left-4 top-4 z-[100] rounded-full border border-white/20 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-300",
}: BackNavButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <button type="button" onClick={handleBack} className={className} aria-label="Go back">
      ← Back
    </button>
  );
}
