import React from 'react';
import { ExecutionTraceTimeline } from './ExecutionTraceTimeline';
import { GovernanceEvent } from './types';

// Mock data for pedagogy
const mockEventsWithGovernance: GovernanceEvent[] = [
  {
    eventId: "ev-1",
    eventName: "INTAKE",
    previousState: null,
    nextState: "DRAFT",
    actorId: "USER-92",
    transitionId: "tx-1",
    eventHash: "a1b2c3d4e5f6",
    timestamp: new Date(Date.now() - 100000).toISOString(),
    status: "PENDING"
  },
  {
    eventId: "ev-2",
    eventName: "VERIFIED",
    previousState: "DRAFT",
    nextState: "KYC_PASSED",
    actorId: "SYSTEM-KYC",
    transitionId: "tx-2",
    eventHash: "f6e5d4c3b2a1",
    previousEventHash: "a1b2c3d4e5f6",
    timestamp: new Date(Date.now() - 50000).toISOString(),
    status: "VERIFIED"
  },
  {
    eventId: "ev-3",
    eventName: "AUTHORITY_GRANTED",
    previousState: "KYC_PASSED",
    nextState: "READY_FOR_EXPORT",
    actorId: "AUTH-L3-GATEWAY",
    authorityLevel: "L3-EXPORT",
    evidenceId: "EVID-88219-A",
    transitionId: "tx-3",
    eventHash: "998877665544",
    previousEventHash: "f6e5d4c3b2a1",
    signature: "0x1234abcd5678ef901234abcd5678ef90",
    timestamp: new Date().toISOString(),
    status: "AUTHORITY_GRANTED"
  }
];

export const ExecutionCompareViewer: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
      {/* WITHOUT GOVERNANCE */}
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
        <h3 className="text-red-500 font-bold mb-4 tracking-wider flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          WITHOUT GOVERNANCE
        </h3>
        
        <div className="space-y-4 font-mono text-sm">
          <div className="bg-black p-4 rounded text-gray-400 border border-red-900/30">
            <div className="text-red-400 mb-2">{`// Direct DB Mutation (CRUD)`}</div>
            <code>{"UPDATE hunts SET status = 'EXPORTED' WHERE id = 123;"}</code>
          </div>
          
          <ul className="text-gray-500 space-y-2 mt-6">
            <li className="flex items-center text-red-400/80"><span className="mr-2">✗</span> No Evidence Generated</li>
            <li className="flex items-center text-red-400/80"><span className="mr-2">✗</span> No Signature / Tamper-evident hash</li>
            <li className="flex items-center text-red-400/80"><span className="mr-2">✗</span> No Authority Boundary Checks</li>
            <li className="flex items-center text-red-400/80"><span className="mr-2">✗</span> Row Mutated (History Destroyed)</li>
          </ul>
        </div>
      </div>

      {/* WITH GOVERNANCE */}
      <div className="border border-green-900 rounded-lg relative overflow-hidden bg-black shadow-[0_0_30px_rgba(0,255,0,0.05)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-blue-500"></div>
        <div className="p-6">
          <h3 className="text-green-500 font-bold mb-6 tracking-wider flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            WITH GOVERNANCE (Institutional Execution)
          </h3>
          <ExecutionTraceTimeline events={mockEventsWithGovernance} entityId="HUNT-88A9B" />
        </div>
      </div>
    </div>
  );
};
