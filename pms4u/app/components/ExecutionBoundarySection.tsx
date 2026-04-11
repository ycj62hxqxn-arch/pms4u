"use client";

import { useState } from "react";

type ScenarioKey = "legal" | "finance";

type ScenarioCopy = {
  bad: string;
  good: string;
};

const SCENARIOS: Record<ScenarioKey, ScenarioCopy> = {
  legal: {
    bad: "Privileged document processed after context change → breach",
    good: "Execution blocked: privilege invalid at runtime",
  },
  finance: {
    bad: "Unauthorized approval executed due to outdated authority",
    good: "Execution denied: authority invalid at execution moment",
  },
};

export default function ExecutionBoundarySection() {
  const [scenario, setScenario] = useState<ScenarioKey>("legal");
  const [result, setResult] = useState<ScenarioCopy | null>(null);

  const runSimulation = () => {
    setResult(SCENARIOS[scenario]);
  };

  return (
    <section className="max-w-6xl mx-auto py-32">
      <div className="text-center">
        <h2 className="text-3xl mb-4">Execution Boundary™</h2>
        <p className="text-sky-400 mb-8">Continuous validity under changing reality</p>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Systems don’t fail when they break the rules. They fail when they follow them in the
          wrong context.
        </p>
        <a
          href="#contact"
          className="inline-block mt-8 bg-sky-500 text-white px-6 py-3 rounded-lg hover:scale-105 hover:shadow-xl transition duration-300"
        >
          Run a 5-minute boundary audit
        </a>
      </div>

      <div className="mt-20 grid md:grid-cols-2 gap-10 items-start">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl mb-3">Structure is not control.</h3>
          <p className="text-gray-400 mb-6">
            If your system needs to evaluate at runtime, it already drifted.
          </p>
          <ul className="space-y-2 text-gray-300 list-disc list-inside">
            <li>Context shifts</li>
            <li>Authority degrades</li>
            <li>New states emerge</li>
          </ul>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl mb-3">Execution Boundary™</h3>
          <p className="text-gray-400">
            Invalid states are not evaluated. They are made impossible.
          </p>
        </div>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Deterministic Validation",
            description: "Every action is checked before it becomes real.",
          },
          {
            title: "Context Awareness",
            description: "Decisions adapt to live conditions.",
          },
          {
            title: "Enforced Boundaries",
            description: "Invalid states are blocked. Not logged.",
          },
        ].map((pillar) => (
          <div
            key={pillar.title}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
          >
            <h4 className="text-lg mb-2">{pillar.title}</h4>
            <p className="text-gray-400 text-sm">{pillar.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-white/[0.03] border border-white/10 rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h3 className="text-xl mb-2">Where Your System Actually Breaks</h3>
            <p className="text-gray-400">
              Simulate runtime drift and see why execution control matters.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm text-gray-300" htmlFor="scenario-select">
              Scenario
            </label>
            <select
              id="scenario-select"
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
              value={scenario}
              onChange={(event) => setScenario(event.target.value as ScenarioKey)}
            >
              <option value="legal">Legal Document</option>
              <option value="finance">Financial Approval</option>
            </select>
            <button
              type="button"
              onClick={runSimulation}
              className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition duration-300"
            >
              Run Simulation
            </button>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="border border-red-500/50 rounded-xl p-5">
            <h4 className="text-base mb-2">Traditional</h4>
            <p className="text-gray-400 text-sm">
              {result?.bad ?? "—"}
            </p>
          </div>
          <div className="border border-sky-400/60 rounded-xl p-5">
            <h4 className="text-base mb-2">Execution Boundary™</h4>
            <p className="text-gray-400 text-sm">
              {result?.good ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl mb-3">Your client privilege does not break in the cloud.</h3>
        <p className="text-sky-400 mb-4">It breaks at execution.</p>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Even secure systems fail when context shifts at runtime. Execution Boundary™ ensures
          invalid actions never execute.
        </p>
        <a
          href="#contact"
          className="inline-block mt-8 bg-sky-500 text-white px-6 py-3 rounded-lg hover:scale-105 hover:shadow-xl transition duration-300"
        >
          Simulate your legal risk
        </a>
      </div>
    </section>
  );
}
