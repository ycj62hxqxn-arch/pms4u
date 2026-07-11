import { Suspense } from "react";
import { CarouselViewer } from "./CarouselViewer";
import BackNavButton from "../../components/BackNavButton";

export const metadata = {
  title: "Runtime Governance Is Real | LinkedIn Carousel",
  description:
    "LinkedIn carousel explaining runtime governance proof, claim discipline, and YAI Studio execution control.",
};

export default function RuntimeGovernanceCarouselPage() {
  return (
    <main className="min-h-screen bg-black">
      <BackNavButton />
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <CarouselViewer />
      </Suspense>
    </main>
  );
}
