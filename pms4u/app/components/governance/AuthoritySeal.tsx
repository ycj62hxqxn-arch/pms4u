import React from 'react';

interface Props {
  level: string;
  signature?: string;
}

export const AuthoritySeal: React.FC<Props> = ({ level, signature }) => {
  return (
    <div className="flex flex-col space-y-1 bg-yellow-50/10 border border-yellow-500/30 rounded px-2 py-1 text-xs font-mono w-fit">
      <div className="flex items-center space-x-2 text-yellow-600">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5a1 1 0 112 0v4a1 1 0 11-2 0V5zm1 8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
        <span className="font-bold tracking-wider">AUTHORITY LEVEL: {level}</span>
      </div>
      {signature && (
        <div className="text-[10px] text-gray-500 truncate max-w-[150px]" title={signature}>
          SIG: {signature.substring(0, 12)}...
        </div>
      )}
    </div>
  );
};
