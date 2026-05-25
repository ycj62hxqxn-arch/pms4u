'use client';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Activity, Key } from 'lucide-react';

interface AuthorityContext {
  actor_id: string;
  authority_level: string;
  delegation_scope: string[];
  runtime_mode: string;
  signature_validity: 'VALID' | 'INVALIDATED';
  expires_at: string;
}

export function AuthorityContextViewer() {
  const [context, setContext] = useState<AuthorityContext>(() => ({
    actor_id: 'OPS_L2_07',
    authority_level: 'L2',
    delegation_scope: ['VERIFY', 'COMPLIANCE_REVIEW'],
    runtime_mode: 'STRICT_ENFORCEMENT',
    signature_validity: 'VALID',
    expires_at: new Date(Date.now() + 1000 * 15).toISOString(),
  }));

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    const checkExpiry = setInterval(() => {
      setContext(prev => {
        if (prev.expires_at && new Date() > new Date(prev.expires_at) && prev.signature_validity === 'VALID') {
          return { ...prev, signature_validity: 'INVALIDATED' };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(checkExpiry);
  }, []);

  if (!mounted) return null;

  const isValid = context.signature_validity === 'VALID';

  return (
    <div className={`p-4 rounded-md border-l-4 font-mono text-sm shadow-md transition-colors ${
      isValid 
        ? 'bg-blue-950/20 border-blue-500 text-blue-300' 
        : 'bg-red-950/20 border-red-600 text-red-500'
    }`}>
      <div className="flex items-center justify-between mb-4 border-b border-gray-800/50 pb-2">
        <div className="flex items-center space-x-2">
          {isValid ? <ShieldCheck size={20} className="text-blue-400" /> : <ShieldAlert size={20} className="text-red-500" />}
          <h2 className="font-bold tracking-widest text-[16px] text-white">CURRENT AUTHORITY CONTEXT</h2>
        </div>
        {isValid ? (
          <span className="bg-blue-900/40 text-blue-200 px-3 py-1 rounded-full text-xs animate-pulse">CRYPTOGRAPHIC SESSION ACTIVE</span>
        ) : (
          <span className="bg-red-900/60 text-red-300 px-3 py-1 rounded-full text-xs animate-pulse font-bold">AUTHORITY INVALIDATED MODE</span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-gray-500 text-xs uppercase mb-1">Actor Identity</p>
          <p className="font-semibold text-gray-200">{context.actor_id}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase mb-1">Authority Level</p>
          <p className="font-semibold text-gray-200">{context.authority_level}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500 text-xs uppercase mb-1">Execution Scope</p>
          <div className="flex flex-wrap gap-2">
            {context.delegation_scope.map(scope => (
              <span key={scope} className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs">
                {scope}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase mb-1 flex items-center"><Activity size={12} className="mr-1"/> Runtime Mode</p>
          <p className="font-semibold text-gray-200">{context.runtime_mode}</p>
        </div>
        <div className="col-span-3">
          <p className="text-gray-500 text-xs uppercase mb-1 flex items-center"><Key size={12} className="mr-1"/> Signature Validity</p>
          <p className={`font-semibold ${isValid ? 'text-green-400' : 'text-red-500'}`}>
            {context.signature_validity} 
            {isValid && <span className="text-gray-500 font-normal ml-2">(Expires in 15 seconds)</span>}
          </p>
        </div>
      </div>
    </div>
  );
}