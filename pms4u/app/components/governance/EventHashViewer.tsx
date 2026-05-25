import React from 'react';

interface Props {
  hash: string;
  previousHash?: string;
  // Compute inline or pass down if we strictly validate
  previousEventRealHash?: string; 
}

export const EventHashViewer: React.FC<Props> = ({ hash, previousHash, previousEventRealHash }) => {
  const isMatch = !previousHash || !previousEventRealHash || previousHash === previousEventRealHash;
  
  return (
    <div className="text-[10px] font-mono mt-2 space-y-1">
      {previousHash && (
        <div className="flex items-center space-x-1">
          <span className="text-gray-600">prev:</span>
          <span className={`truncate w-32 ${isMatch ? 'text-gray-500' : 'text-red-500 font-bold line-through'}`} title={previousHash}>
            {previousHash}
          </span>
          {!isMatch && (
            <span className="text-red-500 font-bold ml-2 animate-pulse whitespace-nowrap">
              ⚠ LINEAGE INTEGRITY VIOLATION
            </span>
          )}
        </div>
      )}
      <div className="text-gray-400 flex items-center space-x-1">
        <span className="text-blue-500">hash:</span>
        <span className="truncate w-32 font-bold" title={hash}>{hash}</span>
      </div>
    </div>
  );
};
