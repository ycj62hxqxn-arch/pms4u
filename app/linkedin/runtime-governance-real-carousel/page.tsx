import { Suspense } from "react";
import { CarouselViewer } from "./CarouselViewer";

export const metadata = {
  title: "Runtime Governance Is Real | LinkedIn Carousel",
  description:
    "LinkedIn carousel explaining runtime governance proof, claim discipline, and PMS4U execution control.",
};

export default function RuntimeGovernanceCarouselPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <CarouselViewer />
    </Suspense>
  );
}
