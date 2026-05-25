import React from 'react';
import { ExecutionCompareViewer } from '../components/governance/ExecutionCompareViewer';
import { LiveExecutionTrace } from '../components/governance/LiveExecutionTrace';
import { AuthorityContextViewer } from '../components/governance/AuthorityContextViewer';

export default function ExecutionTracePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-8 pt-16 font-sans selection:bg-yellow-500/30">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <header className="border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-widest text-white mb-4">CONSTITUTIONAL EXECUTION VIEWER</h1>
          <p className="text-gray-400 max-w-2xl text-lg leading-relaxed mb-8">
            Evidence-bound validation tracing. This interface does not fetch a single mutated status string.
            Instead, it derives the truth by visually replaying the tamper-evident cryptographic hash chain of state jumps.
          </p>
          <AuthorityContextViewer />
        </header>

        {/* The Live Introspection (FastAPI) section */}
        <section>
          <LiveExecutionTrace entityId="HUNT-88A9B" />
        </section>

        {/* The Pedagogy Concept Section */}
        <section className="pt-16 border-t border-gray-900">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold tracking-widest text-gray-600">EXECUTION SUBSTRATE PEDAGOGY</h2>
            <p className="text-gray-600 font-mono text-xs mt-1">Standard CRUD architecture vs Constitutional Event-Sourced Lineage.</p>
          </div>
          <ExecutionCompareViewer />
        </section>

      </div>
    </div>
  );
}
