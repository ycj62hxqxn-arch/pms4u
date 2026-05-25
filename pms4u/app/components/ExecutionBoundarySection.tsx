"use client";

import { useState } from "react";

type ScenarioKey = "carshunter" | "ai_pipeline" | "autonomous_system";

type ScenarioData = {
  system: string;
  state: string;
  context: string;
  withoutSET: string;
  withSET: string;
};

const SCENARIOS: Record<ScenarioKey, ScenarioData> = {
  carshunter: {
    system: "Vehicle Trade Pipeline (CARSHUNTER)",
    state: "VERIFIED → LIVE",
    context: "Verification: vehicle data confirmed | Invariance: constraints satisfied",
    withoutSET: "Transition would not be permitted (or uncontrolled without execution authority).",
    withSET: "Execution Authority: ALLOW → Transition COMMITTED.",
  },
  ai_pipeline: {
    system: "High-Stakes Decision Pipeline",
    state: "DECISION → EXECUTION",
    context: "AI assumes: if (correct) → execute",
    withoutSET: "Execution is not controlled. Action cannot be refused after validation.",
    withSET: "Execution Authority intercepts validation. Admissibility evaluates DENY. Execution Blocked.",
  },
  autonomous_system: {
    system: "Autonomous Action Agent",
    state: "VALIDATED → REAL",
    context: "Agent proceeds without confirming final execution authority.",
    withoutSET: "Uncontrolled transition. Continues executing correctly on a state that is no longer valid.",
    withSET: "Only execution authority decides what becomes real. Invalid transitions impossible by construction.",
  },
};

export default function ExecutionBoundarySection() {
  const [scenario, setScenario] = useState<ScenarioKey>("carshunter");
  const [result, setResult] = useState<ScenarioData | null>(null);

  const runSimulation = () => {
    setResult(SCENARIOS[scenario]);
  };

  return (
    <section className="max-w-6xl mx-auto py-32 px-5">
      <div className="text-center">
        <h2 className="text-4xl mb-4 font-light tracking-tight text-white">SET — Execution Governance</h2>
        <p className="mb-8 font-mono tracking-widest text-sm text-[var(--accent,#d4af37)] uppercase">The Missing Layer in AI Systems</p>
        
        <div className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed border-l-2 border-[var(--accent,#d4af37)] pl-6 text-left">
          <p className="mb-4">
            AI systems today optimize for: <strong className="text-white">correctness</strong>, <strong className="text-white">performance</strong>, and <strong className="text-white">alignment</strong>.
            But they assume <code className="text-[#00fa9a] bg-black/50 px-2 py-1 rounded text-sm font-mono">if (correct) &rarr; execute</code>. 
            <br/><span className="text-gray-200 mt-2 block">This assumption is false.</span>
          </p>
          <p>
            Between <strong className="text-white">decision</strong> and <strong className="text-white">execution</strong> there exists a control boundary. Right now, it is unmanaged.
          </p>
        </div>
      </div>

      <div className="mt-20 grid md:grid-cols-2 gap-10 items-start">
        <div className="bg-[#111] border border-[#333] rounded-2xl p-8 hover:border-[var(--accent,#d4af37)] transition-all">
          <h3 className="text-xl mb-3 text-white">What SET Does</h3>
          <p className="text-gray-400 mb-6">
            SET defines the conditions under which execution is allowed to become real.
          </p>
          <ul className="space-y-2 text-gray-300 list-disc list-inside font-mono text-sm">
            <li>Whether execution is allowed</li>
            <li>When execution is blocked</li>
            <li>How authority governs action</li>
          </ul>
        </div>

        <div className="bg-[#111] border border-[#333] rounded-2xl p-8 hover:border-[#00fa9a] transition-all">
          <h3 className="text-xl mb-3 text-white">Core Principle</h3>
          <p className="text-gray-200 text-lg mb-4">
            Execution is not automatic. <br/>
            Execution is <strong className="text-[#00fa9a]">admissible</strong>.
          </p>
          <div className="border-t border-[#333] pt-4 mt-4">
             <span className="text-red-400 text-xs uppercase tracking-widest font-mono">Failure Condition</span>
             <p className="text-gray-400 text-sm mt-2">A system that allows execution without authority is uncontrolled, cannot guarantee correctness, and cannot prevent invalid state transitions.</p>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-[#111] border border-[#333] rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h3 className="text-xl mb-2 text-white">Verify Your System</h3>
            <p className="text-gray-400 text-sm max-w-md">
              Can an action be refused AFTER it is validated but BEFORE it executes? If not — you don’t control execution.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <select
              id="scenario-select"
              aria-label="Select evaluation scenario"
              className="bg-black border border-[#333] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-[var(--accent,#d4af37)] focus:outline-none"
              value={scenario}
              onChange={(event) => setScenario(event.target.value as ScenarioKey)}
            >
              <option value="carshunter">Vehicle Trade Pipeline</option>
              <option value="ai_pipeline">AI Decision Pipeline</option>
              <option value="autonomous_system">Autonomous Agents</option>
            </select>
            <button
              type="button"
              onClick={runSimulation}
              className="bg-[var(--accent,#d4af37)] text-black font-semibold border border-transparent px-6 py-2 rounded-lg hover:bg-yellow-400 font-mono text-sm transition duration-300"
            >
              EVALUATE SET
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 bg-[#050505] p-6 rounded-xl border border-[#222]">
          <div className="border-l-2 border-red-500/50 pl-5 py-2">
            <h4 className="text-xs text-red-500 font-mono tracking-widest mb-2">WITHOUT EXECUTION AUTHORITY</h4>
            <p className="text-gray-400 text-sm font-mono whitespace-pre-line leading-relaxed">
              {result?.withoutSET ?? "Waiting for simulation payload..."}
            </p>
          </div>
          <div className="border-l-2 border-[#00fa9a]/60 pl-5 py-2">
            <h4 className="text-xs text-[#00fa9a] font-mono tracking-widest mb-2">WITH SET GOVERNANCE</h4>
            <p className="text-gray-300 text-sm font-mono whitespace-pre-line leading-relaxed">
              {result?.withSET ?? "Awaiting governance protocol..."}
            </p>
          </div>
        </div>
        {result && (
            <div className="mt-6 text-center text-xs text-gray-500 font-mono bg-[#111] p-3 rounded border border-[#222]">
                <span className="text-[var(--accent,#d4af37)]">[SYSTEM]:</span> {result.system} <span className="mx-2">|</span> 
                <span className="text-[var(--accent,#d4af37)]">[STATE]:</span> {result.state} <br/> 
                <span className="text-[#00fa9a] mt-1 inline-block">{result.context}</span>
            </div>
        )}
      </div>

      <div className="mt-20 text-center">
        <h3 className="text-xl mb-4 text-white">Statement of Authority</h3>
        <div className="text-gray-400 max-w-3xl mx-auto font-mono text-sm leading-relaxed border-l-2 border-[#333] bg-[#0a0a0a] p-6 rounded-r text-left">
          &quot;Any system that cannot refuse execution after validation does not control execution. Systems don’t fail because they break. They fail because they continue executing correctly on a state that is no longer valid.&quot;
        </div>
      </div>
    </section>
  );
}
