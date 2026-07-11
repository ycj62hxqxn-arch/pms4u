import type { Metadata } from "next";
import { ImageGeneratorClient } from "./ImageGeneratorClient";

export const metadata: Metadata = {
  title: "YAI Studio Image Generator | BPB Solutions LTD",
  description:
    "Image Generator module in YAI Studio. Generates governed image prompt sets with PLAN_ONLY policy and no auto-publish.",
};

export default function YaiStudioImageGeneratorPage() {
  return <ImageGeneratorClient />;
}
