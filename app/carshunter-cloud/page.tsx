import type { Metadata } from "next";
import CarshunterCloudClient from "./CarshunterCloudClient";

export const metadata: Metadata = {
  title: "CARSHUNTER Cloud | Governed AI Vehicle Sourcing",
  description:
    "Cloud-native AI automotive sourcing reference app powered by PMS4U runtime governance.",
  alternates: {
    canonical: "/carshunter-cloud",
  },
  openGraph: {
    title: "CARSHUNTER Cloud",
    description:
      "A PMS4U reference app for governed vehicle sourcing, multi-agent workflows, and cloud deployment.",
    url: "/carshunter-cloud",
    type: "website",
  },
};

export default function CarshunterCloudPage() {
  return <CarshunterCloudClient />;
}
