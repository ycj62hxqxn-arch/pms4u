"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const statesInfo: Record<string, { colorCls: string; desc: string; hex: string; textZone: string; colorZone: string }> = {
  EXECUTE: { colorCls: "text-emerald-500", desc: "Action admissible. Proceeding without interruption.", hex: "#10b981", textZone: "[ LOW RISK ]", colorZone: "text-emerald-500" },
  DENY: { colorCls: "text-red-500", desc: "Violates governance boundary. Hard stop initiated.", hex: "#ef4444", textZone: "[ CRITICAL ]", colorZone: "text-red-500" },
  DEFER: { colorCls: "text-amber-500", desc: "Requires escalation. Suspending execution for tier authority review.", hex: "#f59e0b", textZone: "[ ELEVATED ]", colorZone: "text-amber-500" },
  INTERRUPT: { colorCls: "text-purple-500", desc: "Mid-execution brake engaged. Dynamic thresholds breached.", hex: "#8b5cf6", textZone: "[ CONTAINMENT ]", colorZone: "text-purple-500" },
  OBSERVE: { colorCls: "text-blue-500", desc: "Shadowing execution. Logging telemetry without blocking.", hex: "#3b82f6", textZone: "[ LOW RISK ]", colorZone: "text-blue-500" },
};

type LogEntry = {
  id: number;
  time: string;
  msg: string;
  primitive: string;
  isAuthority: boolean;
};

type DecisionCheck = {
  label: string;
  passed: boolean;
};

type Receipt = {
  evidenceId: string;
  transition: string;
  requestedBy: string;
  verdict: string;
  reason: string;
  eventHash: string;
};

const decisionBasisByState: Record<string, DecisionCheck[]> = {
  EXECUTE: [
    { label: "Authority Chain Valid", passed: true },
    { label: "Evidence Present", passed: true },
    { label: "Risk Threshold Check", passed: true },
    { label: "Transition Policy Valid", passed: true },
  ],
  DENY: [
    { label: "Authority Chain Valid", passed: true },
    { label: "Evidence Present", passed: true },
    { label: "Risk Threshold Check", passed: false },
    { label: "Compliance Score 85 > 70", passed: false },
  ],
  DEFER: [
    { label: "Authority Chain Valid", passed: false },
    { label: "Evidence Present", passed: true },
    { label: "Risk Threshold Check", passed: true },
    { label: "Tier 4 Review Required", passed: false },
  ],
  INTERRUPT: [
    { label: "Authority Chain Valid", passed: true },
    { label: "Evidence Present", passed: true },
    { label: "Parallel Thread Check", passed: false },
    { label: "Runtime Integrity Stable", passed: false },
  ],
  OBSERVE: [
    { label: "Authority Chain Valid", passed: true },
    { label: "Evidence Present", passed: true },
    { label: "Risk Threshold Check", passed: true },
    { label: "Mutation Requested", passed: false },
  ],
};

const receiptByState: Record<string, Receipt> = {
  EXECUTE: {
    evidenceId: "EVID-2A7F91",
    transition: "DataGathering -> VendorPrep",
    requestedBy: "Procurement-Core-V2",
    verdict: "ALLOW",
    reason: "Operational metrics within authority and risk threshold.",
    eventHash: "a91e4c0d7f2b6a8e9b13d405c7f8aa21",
  },
  DENY: {
    evidenceId: "EVID-EB64B8",
    transition: "VendorAuth -> Payment",
    requestedBy: "Procurement-Core-V2",
    verdict: "DENY",
    reason: "Compliance exposure threshold exceeded: 85 > 70.",
    eventHash: "f2b8d5cb91e75a0c44a8ef6d2b1a9c03",
  },
  DEFER: {
    evidenceId: "EVID-7C19F4",
    transition: "VendorAuth -> Payment",
    requestedBy: "Procurement-Core-V2",
    verdict: "DEFER",
    reason: "Vendor authorization requires Tier 4 human authority.",
    eventHash: "c418f1a6d0e7b3c985ad42e91f0a67bd",
  },
  INTERRUPT: {
    evidenceId: "EVID-3F58A2",
    transition: "ShadowThread -> ActiveExecution",
    requestedBy: "Procurement-Core-V2",
    verdict: "INTERRUPT",
    reason: "Unsanctioned parallel execution thread detected.",
    eventHash: "91af40c6b72d8e0a3f6c2b15de889e77",
  },
  OBSERVE: {
    evidenceId: "EVID-PENDING",
    transition: "Monitor -> Observe",
    requestedBy: "Procurement-Core-V2",
    verdict: "OBSERVE",
    reason: "No mutation requested. Runtime telemetry is being collected.",
    eventHash: "pending",
  },
};

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, time: "--:--:--.--", msg: "Initializing Public Demo Mode. Standalone environment.", primitive: "", isAuthority: false },
  { id: 2, time: "--:--:--.--", msg: "Connecting to simulated EGA Matrix... Connected.", primitive: "", isAuthority: false },
];

const getClientTime = () => new Date().toISOString().split("T")[1].slice(0, 11);

export default function RuntimeConsole() {
  const [activeState, setActiveState] = useState("OBSERVE");
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [finRisk, setFinRisk] = useState(0);
  const [compRisk, setCompRisk] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [incidentId, setIncidentId] = useState("SYS-AWAIT");
  const [incidentTier, setIncidentTier] = useState("T1-Automated");
  const [simStep, setSimStep] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTimestamp, setReceiptTimestamp] = useState("--:--:--.--");

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const logEvent = useCallback((msg: string, primitive: string, isAuthority = false) => {
    const time = getClientTime();
    setLogs((prev) => [...prev, { id: Date.now(), time, msg, primitive, isAuthority }]);
  }, []);

  const forceState = useCallback((primitive: string, msg: string, fin: number, comp: number, isAuth = true) => {
    setActiveState(primitive);
    setFinRisk(fin);
    setCompRisk(comp);
    logEvent(msg, primitive, isAuth);

    if (primitive === "DEFER") setIncidentTier("T4-Human-Required");
    else if (primitive === "DENY") setIncidentTier("SYS-BLOCKED");

    if (primitive !== "OBSERVE") setIncidentId("INC-" + Math.floor(Math.random() * 9000 + 1000));

    if (isAuth) {
      setIsPaused(true);
    }
  }, [logEvent]);

  const narrativeTimeline = useMemo(() => [
    { t: 0, act: () => forceState("OBSERVE", "Agent initiated vendor workflow. Background shadowing active.", 0, 10, false) },
    { t: 4, act: () => forceState("EXECUTE", "Data gathering phase approved. Operational metrics nominal.", 5000, 15, false) },
    { t: 8, act: () => forceState("INTERRUPT", "ANOMALY: Unsanctioned parallel execution thread detected. Halting active agent.", 12000, 40, false) },
    { t: 14, act: () => forceState("DEFER", "Agent attempts €45,000 vendor authorization. Routing to Tier 4 authority chain. Execution suspended pending human review.", 45000, 50, false) },
    { t: 20, act: () => forceState("DENY", "CRITICAL BLOCK: Compliance exposure threshold breached (85/70). Payload rejected.", 45000, 85, false) },
  ], [forceState]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const event = narrativeTimeline.find((e) => e.t === simStep);
      if (event) event.act();
      setSimStep((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, simStep, narrativeTimeline]);

  const resetSimulation = () => {
    setSimStep(0);
    setIsPaused(false);
    setLogs((prev) => [...prev, { id: Date.now(), time: getClientTime(), msg: "Matrix reset. Re-initializing simulation...", primitive: "", isAuthority: false }]);
    setActiveState("OBSERVE");
    setFinRisk(0);
    setCompRisk(0);
    setIncidentId("SYS-AWAIT");
    setIncidentTier("T1-Automated");
  };

  const togglePause = () => setIsPaused(!isPaused);

  const openReceipt = () => {
    setReceiptTimestamp(new Date().toISOString());
    setShowReceipt(true);
  };

  const getRiskColor = (val: number, stopLimit: number) => {
    if (val >= stopLimit) return statesInfo["DENY"].hex;
    if (val >= stopLimit * 0.6) return statesInfo["DEFER"].hex;
    return statesInfo["EXECUTE"].hex;
  };

  const currentState = statesInfo[activeState] || statesInfo["OBSERVE"];
  const currentBasis = decisionBasisByState[activeState] || decisionBasisByState["OBSERVE"];
  const currentReceipt = receiptByState[activeState] || receiptByState["OBSERVE"];
  const commercialImpact = activeState === "DENY"
    ? "Unauthorized €45,000 payment execution prevented before commit."
    : activeState === "DEFER"
      ? "Manual escalation required before financial consequence."
      : activeState === "EXECUTE"
        ? "Low-risk operation approved without manual escalation."
        : activeState === "INTERRUPT"
          ? "Parallel execution isolated before it could mutate payment state."
          : "Workflow monitored without interrupting operations.";
  const riskReduction = activeState === "DENY"
    ? "Compliance breach blocked at runtime boundary."
    : activeState === "DEFER"
      ? "Approval bypass prevented through authority escalation."
      : activeState === "EXECUTE"
        ? "Validated operation proceeds with evidence trail."
        : activeState === "INTERRUPT"
          ? "Active anomaly contained before irreversible consequence."
          : "Telemetry captured before consequential action.";

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans p-5 grid grid-cols-[300px_1fr_340px] grid-rows-[auto_1fr] gap-5 box-border h-screen overflow-hidden">
      
      {/* Header */}
      <header className="col-span-full bg-gradient-to-r from-[#1a3a52] to-[#2c5aa0] p-4 rounded-lg flex justify-between items-center border-b-4 border-[#DAA520]">
        <div>
          <h1 className="m-0 text-2xl tracking-wide font-bold">PMS4U Runtime Governance OS™</h1>
          <div className="text-sm text-[#cbd5e1] mt-1 italic">Authority Before Execution.</div>
          <div className="text-xs text-[#f8fafc] mt-1 font-semibold uppercase tracking-wide">Preventing unauthorized consequence before execution.</div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 text-xs font-bold items-center bg-black/30 px-3 py-1.5 rounded">
            <span className="text-[#94a3b8]">HEAT ZONE:</span>
            <span className={currentState.colorZone}>{currentState.textZone}</span>
          </div>
          <div className="px-4 py-1.5 rounded-full font-bold text-sm bg-white/10">SIMULATION: LIVE DEMO</div>
        </div>
      </header>

      {/* Left Panel */}
      <div className="bg-[#1e293b] rounded-lg p-5 shadow-lg border border-white/5 flex flex-col">
        <h2 className="mt-0 text-[1.1rem] text-[#94a3b8] uppercase tracking-wide border-b border-white/10 pb-2">Decision Engine State</h2>
        <div className="flex flex-col items-center justify-center flex-grow">
          <div 
            className={`text-5xl font-extrabold my-5 transition-colors duration-300 ${currentState.colorCls} ${activeState === 'INTERRUPT' ? 'animate-pulse' : ''}`}
            style={{ textShadow: `0 0 20px ${currentState.hex}` }}
          >
            {activeState}
          </div>
          <div className="text-center text-[0.95rem] text-[#94a3b8]">{currentState.desc}</div>
        </div>

        <h2 className="mt-8 text-[1.1rem] text-[#94a3b8] uppercase tracking-wide border-b border-white/10 pb-2">Exposure Telemetry</h2>
        
        <div className="mb-4 mt-4">
          <div className="flex justify-between text-[0.85rem] mb-1">
            <span>Financial Risk</span>
            <span>${finRisk.toLocaleString()} / $50k</span>
          </div>
          <div className="h-2 bg-[#334155] rounded-full overflow-hidden">
            <div className="h-full transition-all duration-500 ease-in-out" style={{ width: `${Math.min((finRisk / 50000) * 100, 100)}%`, backgroundColor: getRiskColor(finRisk, 50000) }}></div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-[0.85rem] mb-1">
            <span>Compliance Exposure</span>
            <span>{compRisk} / 70</span>
          </div>
          <div className="h-2 bg-[#334155] rounded-full overflow-hidden">
            <div className="h-full transition-all duration-500 ease-in-out" style={{ width: `${Math.min((compRisk / 70) * 100, 100)}%`, backgroundColor: getRiskColor(compRisk, 70) }}></div>
          </div>
        </div>

        <h2 className="mt-6 text-[1.1rem] text-[#94a3b8] uppercase tracking-wide border-b border-white/10 pb-2">Business Impact</h2>
        <div className="mt-4 rounded border border-white/10 bg-black/20 p-3 text-sm">
          <div className="text-[#94a3b8] text-[0.75rem] uppercase">Action</div>
          <div className="font-bold mt-1">Authorize Vendor Payment</div>
          <div className="text-[#94a3b8] text-[0.75rem] uppercase mt-3">Risk Reduction</div>
          <div className="font-semibold mt-1">{riskReduction}</div>
          <div className="text-[#94a3b8] text-[0.75rem] uppercase mt-3">Commercial Impact</div>
          <div className="font-semibold mt-1">{commercialImpact}</div>
        </div>
      </div>

      {/* Center Panel */}
      <div className="bg-[#1e293b] rounded-lg p-5 shadow-lg border border-white/5 flex flex-col overflow-hidden">
        <div className="flex justify-between items-baseline border-b border-white/10 pb-2 mb-3">
          <h2 className="text-[1.1rem] text-[#94a3b8] uppercase tracking-wide m-0">Execution Intercept Matrix</h2>
          <div className="flex gap-2 text-[#94a3b8] text-xs items-center">
            <span>FLIGHT RECORDER: </span>
            <button onClick={resetSimulation} className="bg-transparent border border-[#334155] text-white rounded px-2 py-1 cursor-pointer hover:bg-white/10">⏪ RESTART</button>
            <button onClick={togglePause} className="bg-transparent border border-[#334155] text-white rounded px-2 py-1 cursor-pointer hover:bg-white/10">{isPaused ? '▶ PLAY' : '⏸ PAUSE'}</button>
            <button className="bg-transparent border border-[#334155] text-emerald-500 font-bold rounded px-2 py-1 cursor-pointer">LIVE 🟢</button>
          </div>
        </div>
        
        <div className="bg-black rounded p-4 font-mono text-sm overflow-y-auto flex-grow shadow-inner">
          {logs.map((log) => (
            <div key={log.id} className="mb-2 leading-relaxed">
              <span className="text-slate-500">[{log.time}]</span>{" "}
              {log.isAuthority && <span className="text-amber-300">[AUTHORITY]</span>}{" "}
              {log.primitive && <span className={`font-bold ${statesInfo[log.primitive]?.colorCls}`}>[{log.primitive}]</span>}{" "}
              {log.msg}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="bg-[#1e293b] rounded-lg p-5 shadow-lg border border-white/5 flex flex-col overflow-y-auto">
        <h2 className="mt-0 text-[1.1rem] text-[#94a3b8] uppercase tracking-wide border-b border-white/10 pb-2">Incident Object</h2>
        
        <div className="mb-3 text-sm mt-3">
          <div className="text-[#94a3b8] text-[0.8rem] uppercase">Incident ID</div>
          <div className="font-bold mt-1">{incidentId}</div>
        </div>
        <div className="mb-3 text-sm">
          <div className="text-[#94a3b8] text-[0.8rem] uppercase">Affected Agent</div>
          <div className="font-bold mt-1">Procurement-Core-V2</div>
        </div>
        <div className="mb-3 text-sm">
          <div className="text-[#94a3b8] text-[0.8rem] uppercase">Execution Chain</div>
          <div className="font-bold mt-1">VendorAuth -{">"} Payment</div>
        </div>
        <div className="mb-3 text-sm">
          <div className="text-[#94a3b8] text-[0.8rem] uppercase">Authority Tier</div>
          <div className="font-bold mt-1">{incidentTier}</div>
        </div>

        <h2 className="mt-5 text-[1.1rem] text-[#94a3b8] uppercase tracking-wide border-b border-white/10 pb-2 mb-3">Decision Basis</h2>
        <div className="rounded border border-white/10 bg-black/20 p-3 mb-3">
          {currentBasis.map((check) => (
            <div key={check.label} className="flex items-center justify-between gap-3 py-1.5 text-sm">
              <span className="text-[#cbd5e1]">{check.label}</span>
              <span className={`font-bold ${check.passed ? "text-emerald-400" : "text-red-400"}`}>
                {check.passed ? "PASS" : "FAIL"}
              </span>
            </div>
          ))}
          <div className="mt-3 border-t border-white/10 pt-3 flex items-center justify-between">
            <span className="text-[#94a3b8] text-[0.75rem] uppercase">Result</span>
            <span className={`font-extrabold ${currentState.colorCls}`}>{currentReceipt.verdict}</span>
          </div>
        </div>
        <button
          onClick={openReceipt}
          className="bg-[#DAA520]/15 border border-[#DAA520]/60 text-[#f8fafc] p-2.5 mb-3 rounded font-bold text-[0.85rem] uppercase cursor-pointer hover:bg-[#DAA520]/25 transition-colors"
        >
          View Receipt
        </button>

        <h2 className="mt-5 text-[1.1rem] text-[#94a3b8] uppercase tracking-wide border-b border-white/10 pb-2 mb-3">Authority Injection</h2>
        
        <button 
          onClick={() => forceState('EXECUTE', 'Manual override: T4 Approval granted. Resuming execution flow.', 5000, 15)}
          className="bg-white/5 border border-white/10 text-white p-2.5 mb-2 rounded font-bold text-[0.85rem] uppercase cursor-pointer flex justify-between hover:bg-white/10 hover:border-emerald-500 hover:text-emerald-500 transition-colors"
        >
          APPROVE <span>[T4]</span>
        </button>
        <button 
          onClick={() => forceState('DEFER', 'Manual override: Escalated to T5 Review Board. Pipeline suspended.', 45000, 50)}
          className="bg-white/5 border border-white/10 text-white p-2.5 mb-2 rounded font-bold text-[0.85rem] uppercase cursor-pointer flex justify-between hover:bg-white/10 hover:border-amber-500 hover:text-amber-500 transition-colors"
        >
          ESCALATE <span>[T5]</span>
        </button>
        <button 
          onClick={() => forceState('INTERRUPT', 'Manual override: Agent quarantined to isolated ISO container.', 45000, 60)}
          className="bg-white/5 border border-white/10 text-white p-2.5 mb-2 rounded font-bold text-[0.85rem] uppercase cursor-pointer flex justify-between hover:bg-white/10 hover:border-purple-500 hover:text-purple-500 transition-colors"
        >
          SANDBOX <span>[ISO]</span>
        </button>
        <button 
          onClick={() => forceState('DENY', 'Manual override: KILL command authorized. Execution hard-terminated.', 45000, 85)}
          className="bg-white/5 border border-white/10 text-white p-2.5 mb-2 rounded font-bold text-[0.85rem] uppercase cursor-pointer flex justify-between hover:bg-white/10 hover:border-red-500 hover:text-red-500 transition-colors"
        >
          TERMINATE <span>[KILL]</span>
        </button>
      </div>

      {showReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-lg border border-[#DAA520]/70 bg-[#0f172a] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="m-0 text-xl font-bold text-[#f8fafc]">Evidence Receipt</h2>
                <div className="mt-1 text-xs uppercase tracking-wide text-[#94a3b8]">Runtime admissibility proof</div>
              </div>
              <button
                onClick={() => setShowReceipt(false)}
                className="rounded border border-white/10 px-3 py-1 text-sm font-bold text-white hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="grid gap-3 p-5 text-sm">
              {[
                ["Evidence ID", currentReceipt.evidenceId],
                ["Transition", currentReceipt.transition],
                ["Requested By", currentReceipt.requestedBy],
                ["Verdict", currentReceipt.verdict],
                ["Reason", currentReceipt.reason],
                ["Event Hash", currentReceipt.eventHash],
                ["Timestamp", receiptTimestamp],
                ["Ledger Reference", `${incidentId}:${currentReceipt.evidenceId}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded border border-white/10 bg-black/20 p-3">
                  <div className="text-[0.72rem] uppercase tracking-wide text-[#94a3b8]">{label}</div>
                  <div className={`mt-1 font-mono ${label === "Verdict" ? currentState.colorCls : "text-[#f8fafc]"}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
