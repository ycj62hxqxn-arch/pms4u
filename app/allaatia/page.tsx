import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alaa Atia — Governance Runtime Platform",
  description:
    "Full in-depth report on the PMS4U ecosystem: projects, milestones, case studies, financial impact pathways, and session records. Sep 2025 – Jul 2026.",
};

export default function AllaatiaReportPage() {
  redirect("/allaatia-full-in-depth-report.html");
}
