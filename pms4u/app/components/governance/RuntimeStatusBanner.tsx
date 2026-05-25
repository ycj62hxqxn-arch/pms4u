'use client';
import React, { useState, useEffect } from 'react';

interface RuntimeStatus {
  runtime: string;
  event_store: string;
  projection_engine: string;
  signature_verification: string;
  queue_lag_ms: number;
  lineage_integrity: string;
}

export const RuntimeStatusBanner: React.FC = () => {
  const [status, setStatus] = useState<RuntimeStatus | null>(null);
  const [clockDrift, setClockDrift] = useState<boolean>(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const start = Date.now();
        const res = await fetch('http://localhost:8000/runtime/status');
        const end = Date.now();
        
        if (res.ok) {
          const data = await res.json();
          // Simulate simple clock drift detection
          // In a real system, you'd compare Date.parse(res.headers.get('date')) to Date.now()
          // For now, if round trip takes > 1000ms, assume drift/latency risk
          setClockDrift((end - start) > 1000);
          setStatus(data);
        } else {
           throw new Error("unhealthy");
        }
      } catch (e) {
        setStatus({
          runtime: "OFFLINE",
          event_store: "UNREACHABLE",
          projection_engine: "UNKNOWN",
          signature_verification: "DOWN",
          queue_lag_ms: -1,
          lineage_integrity: "UNKNOWN"
        });
      }
    };
    
    fetchStatus();
    // Real Polling Runtime (every 3 seconds)
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  const isOffline = status.runtime === "OFFLINE" || status.event_store === "UNREACHABLE";
  const isHealthy = !isOffline && !clockDrift && status.lineage_integrity === "VALID";

  return (
    <div className={`w-full text-xs font-mono font-bold tracking-widest px-4 py-2 flex justify-between items-center border-b transition-colors ${!isHealthy ? 'bg-red-950 border-red-700 text-red-200' : 'bg-black border-gray-800 text-gray-400'}`}>
      <div className="flex space-x-6 items-center">
        <span className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${isOffline ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
          RUNTIME: {status.runtime}
        </span>
        <span className="opacity-70 border-l border-gray-700 pl-6 hidden sm:block">
          VERIFICATION: {status.signature_verification}
        </span>
        <span className={`border-l border-gray-700 pl-6 hidden md:block ${status.lineage_integrity === "VALID" ? "opacity-70" : "animate-pulse text-red-400 opacity-100"}`}>
          LINEAGE: {status.lineage_integrity}
        </span>
        {clockDrift && !isOffline && (
           <span className="border-l border-red-700 pl-6 text-red-400 animate-pulse">
            CLOCK DRIFT DETECTED
          </span>
        )}
      </div>
      
      {!isHealthy ? (
        <span className="text-white bg-red-600 px-2 py-0.5 rounded animate-pulse">DEGRADED TRUST MODE</span>
      ) : (
        <span className="text-green-500/80">INSTITUTIONAL SUBSTRATE SECURED</span>
      )}
    </div>
  );
};
