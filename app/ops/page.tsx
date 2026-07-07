import type { Metadata } from "next";
import OpsControlPlaneClient from "./OpsControlPlaneClient";

export const metadata: Metadata = {
  title: "PMS4U Operations Control Plane",
  description:
    "Local operational evidence surface for PMS4U domains, health checks, owners, risk, priority, and research assets.",
};

export default function OpsPage() {
  return <OpsControlPlaneClient />;
}
