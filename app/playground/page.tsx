import type { Metadata } from "next";
import { PlaygroundClient } from "./PlaygroundClient";

export const metadata: Metadata = {
  title: "PMS4U Playground",
  description:
    "Interactive constitutional runtime playground for action, authority, and evidence decision simulation.",
};

export default function PlaygroundPage() {
  return (
    <main className="enterprise-shell py-12">
      <div className="enterprise-wrap space-y-8">
        <header className="enterprise-hero">
          <div className="enterprise-kicker">Public Playground</div>
          <h1 className="enterprise-h1">Runtime Decision Playground</h1>
          <p className="enterprise-lead">
            Submit an action with authority and evidence context to simulate constitutional runtime
            decisions: ALLOW, DENY, REVIEW, or DEFER.
          </p>
        </header>
        <PlaygroundClient />
      </div>
    </main>
  );
}
