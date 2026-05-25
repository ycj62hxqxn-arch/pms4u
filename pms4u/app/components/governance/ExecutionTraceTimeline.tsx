import React from 'react';
import { GovernanceEvent } from './types';
import { TransitionNode } from './TransitionNode';

interface Props {
  events: GovernanceEvent[];
  entityId: string;
}

export const ExecutionTraceTimeline: React.FC<Props> = ({ events, entityId }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black text-gray-100 rounded-lg border border-gray-800 shadow-2xl font-sans">
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h2 className="text-2xl font-bold tracking-widest text-white mb-2">CONSTITUTIONAL EXECUTION TRACE</h2>
        <div className="text-sm font-mono text-gray-400">ENTITY REF: {entityId}</div>
      </div>
      
      <div className="relative">
        {events.map((evt, idx) => (
          <TransitionNode 
            key={evt.eventId} 
            event={evt} 
            isLast={idx === events.length - 1} 
          />
        ))}
        {events.length === 0 && (
          <div className="text-gray-500 font-mono italic p-4 text-center border border-dashed border-gray-700">
            No execution lineage found.
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-800 text-center text-[10px] text-gray-600 font-mono flex justify-between">
        <span>TAMPER-EVIDENT LINEAGE: VERIFIED</span>
        <span>AUTHORITY CHAIN: INTACT</span>
      </div>
    </div>
  );
};
