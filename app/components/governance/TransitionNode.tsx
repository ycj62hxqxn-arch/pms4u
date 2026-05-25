import React from 'react';
import { GovernanceEvent } from './types';
import { AuthoritySeal } from './AuthoritySeal';
import { EvidenceBadge } from './EvidenceBadge';
import { EventHashViewer } from './EventHashViewer';

interface Props {
  event: GovernanceEvent;
  isLast: boolean;
}

const getStatusColor = (status: GovernanceEvent['status']) => {
  switch (status) {
    case 'VERIFIED': return 'border-blue-500 bg-blue-500/10 text-blue-400';
    case 'AUTHORITY_GRANTED': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
    case 'EXECUTED': return 'border-green-500 bg-green-500/10 text-green-400';
    case 'REJECTED': return 'border-red-500 bg-red-500/10 text-red-400';
    case 'PENDING': default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
  }
};

export const TransitionNode: React.FC<Props> = ({ event, isLast }) => {
  const colorClass = getStatusColor(event.status);

  return (
    <div className="relative flex items-start space-x-6 w-full">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-800 -ml-px z-0"></div>
      )}

      {/* Node Dot */}
      <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-black ${colorClass}`}>
        <div className="w-2 h-2 rounded-full bg-current"></div>
      </div>

      {/* Card Content */}
      <div className="flex-1 pb-8">
        <div className={`border rounded-md p-4 text-sm bg-black/40 ${colorClass.replace('bg-', 'border-').split(' ')[0]} border-opacity-30`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold tracking-widest">{event.eventName}</h3>
              <div className="text-xs text-gray-400 mt-1 font-mono">
                {new Date(event.timestamp).toISOString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 font-mono">ACTOR: {event.actorId}</div>
              <div className="text-[10px] text-gray-600 font-mono mt-1">TX: {event.transitionId}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 items-center">
            {event.authorityLevel && (
              <AuthoritySeal level={event.authorityLevel} signature={event.signature} />
            )}
            
            {event.evidenceId && (
              <EvidenceBadge evidenceId={event.evidenceId} />
            )}
          </div>

          <div className="mt-4 border-t border-gray-800/50 pt-3 flex justify-between items-end">
            <div className="font-mono text-xs">
              <span className="text-gray-500 line-through mr-2">{event.previousState || 'NONE'}</span>
              <span className="text-white">→ {event.nextState}</span>
            </div>
            <EventHashViewer hash={event.eventHash} previousHash={event.previousEventHash} />
          </div>
        </div>
      </div>
    </div>
  );
};
