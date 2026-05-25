import React from 'react';
import { GovernanceEvent } from './types';
import { AuthoritySeal } from './AuthoritySeal';
import { EvidenceBadge } from './EvidenceBadge';
import { EventHashViewer } from './EventHashViewer';

interface Props {
  event: GovernanceEvent;
}

export const ExecutionReceiptCard: React.FC<Props> = ({ event }) => {
  return (
    <div className="w-full max-w-sm border border-yellow-900/50 bg-black rounded-lg p-5 font-mono shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-600/20 to-transparent"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-yellow-500 font-bold tracking-widest text-sm mb-1">EXECUTION APPROVED</h4>
          <div className="text-[10px] text-gray-500">{new Date(event.timestamp).toLocaleString()}</div>
        </div>
        <div className="border border-green-500 text-green-500 text-[9px] px-1.5 py-0.5 rounded tracking-widest">
          COMMITTED
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {event.evidenceId && (
          <div>
            <div className="text-gray-600 mb-1">Evidence ID:</div>
            <EvidenceBadge evidenceId={event.evidenceId} />
          </div>
        )}
        
        <div>
          <div className="text-gray-600 mb-1">Transition:</div>
          <div className="text-gray-300">
            <span className="line-through text-gray-600 mr-2">{event.previousState || 'NONE'}</span> 
            → {event.nextState}
          </div>
        </div>

        {event.authorityLevel && (
          <div>
            <div className="text-gray-600 mb-1">Authority:</div>
            <AuthoritySeal level={event.authorityLevel} signature={event.signature} />
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="text-gray-600 mb-2 text-[10px]">Cryptographic Chain:</div>
        <EventHashViewer hash={event.eventHash} previousHash={event.previousEventHash} />
      </div>
    </div>
  );
};
