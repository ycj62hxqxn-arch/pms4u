import type { Metadata } from "next";
import YaiConsole from "./YaiConsole";

export const metadata: Metadata = {
  title: "YAI Local Console | PMS4U",
  description:
    "Local YAI console for PMS4U: a private OpenAI-backed execution-governance assistant with a simple MCV structure.",
};

export default function YaiPage() {
  return <YaiConsole />;
}
