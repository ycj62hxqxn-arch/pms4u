"use client";

import { useSearchParams } from "next/navigation";

export function CarouselViewer() {
  const searchParams = useSearchParams();
  const slide = searchParams.get("slide") ?? "1";
  const safeSlide = /^\d+$/.test(slide) ? slide : "1";

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <iframe
        title="Runtime Governance Is Real LinkedIn Carousel"
        src={`/linkedin/runtime-governance-real-carousel/index.html?slide=${safeSlide}`}
        className="h-full w-full border-0"
      />
    </main>
  );
}
