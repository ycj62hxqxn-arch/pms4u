import type { Metadata } from "next";
import { VideoMakerClient } from "./VideoMakerClient";

export const metadata: Metadata = {
  title: "YAI Studio Video Maker | BPB Solutions LTD",
  description:
    "Video Maker inside YAI Studio. Generates governed storyboard and script plans with PLAN_ONLY decision policy and no auto-publish.",
};

export default function YaiStudioVideoMakerPage() {
  return <VideoMakerClient />;
}
