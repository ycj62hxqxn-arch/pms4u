'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ExecutionTraceTimeline } from './ExecutionTraceTimeline';
import { ExecutionTraceData, GovernanceEvent } from './types';
import { ExecutionReceiptCard } from './ExecutionReceiptCard';

interface Props {
  entityId: string;
}

export const LiveExecutionTrace: React.FC<Props> = ({ entityId }) => {
  const [data, setData] = useState<ExecutionTraceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playbackIdx, setPlaybackIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replaySessionId, setReplaySessionId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLineage = async () => {
    try {
      const res = await fetch(`http://localhost:8000/entities/${entityId}/lineage`);
      if (!res.ok) throw new Error('Live introspection connection failed');
      const json: ExecutionTraceData = await res.json();
      
      // Data normalizer (mapping backend schema to frontend)
      const normalizedData = {
        ...json,
        lineage: json.lineage.map((ev: any) => ({
          eventId: ev.event_id,
          eventName: ev.event_name,
          previousState: ev.previous_state,
          nextState: ev.next_state,
          actorId: ev.actor_id,
          authorityLevel: ev.authority_level,
          evidenceId: ev.evidence_id,
          transitionId: ev.transition_id,
          eventHash: ev.event_hash,
          previousEventHash: ev.previous_event_hash,
          signature: ev.signature,
          timestamp: ev.timestamp,
          status: ev.status
        }))
      };
      
      setData(prev => {
        // Only update playbackIdx if we are not actively replaying and not at a specific cursor
        if (!isPlaying && (prev === null || playbackIdx === prev.lineage.length)) {
           setPlaybackIdx(normalizedData.lineage.length);
        }
        return normalizedData;
      });
      // Initialize Session ID if not present
      if (!replaySessionId) {
        setReplaySessionId(`TRACE-${Math.floor(1000 + Math.random() * 9000)}-${entityId.substring(0, 4)}`);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchLineage();
    
    let ws: WebSocket;
    if (replaySessionId) {
       // Upgrade to Constitutional Event Bus
       ws = new WebSocket(`ws://localhost:8000/ws/trace/${replaySessionId}`);
       
       ws.onopen = () => console.log(`[${replaySessionId}] Substrate Connection Estabilished`);

       ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          
          if (msg.frame_type === "INTEGRITY_CHECKPOINT") {
              console.log(`[Integrity Checkpoint] Hash: ${msg.latest_hash} Version: ${msg.projection_version}`);
          } else if (msg.event_type) {
              // Real-time Event Ingestion
              console.log(`[Constitutional Bus] New Execution Detected: ${msg.event_type}`);
              // In production we would append this directly to the Lineage here avoiding the HTTP poll completely
              // For safety we trigger a hard-sync fetch to guarantee DB coherence
              fetchLineage();
              
              // ACK the event over the socket
              ws.send(JSON.stringify({ ack_event: msg.correlation_id || msg.event_hash }));
          }
       };
    }
    
    // Fallback Polling (Every 10 seconds just to heal dropped connections)
    const interval = setInterval(fetchLineage, 10000);
    
    return () => {
      clearInterval(interval);
      if (ws) ws.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [entityId, isPlaying, replaySessionId]);

  const handleReplay = () => {
    if (!data || data.lineage.length === 0) return;
    setIsPlaying(true);
    setPlaybackIdx(0);
    
    // Generate new deterministic debug session ID for the replay
    setReplaySessionId(`TRACE-${Math.floor(1000 + Math.random() * 9000)}-REPLAY`);
    
    let currentIdx = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      currentIdx++;
      if (currentIdx > data.lineage.length) {
        clearInterval(timerRef.current!);
        setIsPlaying(false);
      } else {
        setPlaybackIdx(currentIdx);
      }
    }, 1500); // Replay speed
  };

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-900 p-6 rounded text-red-500 font-mono text-sm max-w-4xl mx-auto">
        ⚠ Introspection Failed: {error}. Is the Constitutional Runtime (FastAPI) running on port 8000?
      </div>
    );
  }

  if (!data) return <div className="text-gray-500 font-mono animate-pulse max-w-4xl mx-auto">Connecting to Institutional Substrate...</div>;

  const visibleEvents = data.lineage.slice(0, playbackIdx);
  const replayedProjectionState = playbackIdx === 0 ? "UNKNOWN" : (visibleEvents[visibleEvents.length - 1]?.nextState || data.currentState);
  const lagDetected = playbackIdx === data.lineage.length && replayedProjectionState !== data.currentState && replayedProjectionState !== "UNKNOWN";
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-blue-500 flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-3 animate-pulse"></span>
            LIVE EXECUTION REPLAY
          </h2>
          <div className="text-xs text-gray-500 font-mono mt-1">Source: Event-Sourced PostgreSQL (via FastAPI 8000)</div>
        </div>
        <div className="flex space-x-4 items-center">
          <div className="text-[10px] font-mono tracking-widest bg-gray-900 border border-gray-800 text-gray-400 px-3 py-1 rounded">
            SESSION: <span className="text-blue-300 font-bold">{replaySessionId}</span>
          </div>
          <button 
            onClick={handleReplay}
            disabled={isPlaying}
            className="px-4 py-2 border border-blue-500 text-blue-400 text-xs font-bold tracking-wider rounded hover:bg-blue-900/30 transition-colors disabled:opacity-50 flex items-center"
          >
            {isPlaying ? '▶ REPLAYING...' : '▶ REPLAY EXECUTION'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 p-3 rounded text-xs font-mono">
            <span className="text-gray-500">PROJECTION STATE:</span>
            <span className="font-bold text-white">{data.currentState}</span>
            {lagDetected && (
              <span className="ml-4 text-yellow-500 bg-yellow-900/40 px-2 py-0.5 rounded animate-pulse">⚠ EVENT QUEUE LAG DETECTED</span>
            )}
          </div>
          <ExecutionTraceTimeline events={visibleEvents} entityId={entityId} />
        </div>
        
        {/* Right Panel: Active Cryptographic Receipt */}
        <div>
           {visibleEvents.length > 0 && (
             <div className="sticky top-8 space-y-4">
                <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Latest Cryptographic Receipt</div>
                <ExecutionReceiptCard event={visibleEvents[visibleEvents.length - 1]} />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
