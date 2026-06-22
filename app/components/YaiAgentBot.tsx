"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { Bot, ChevronDown, MessageCircle, RotateCcw, Send, ShieldCheck, X } from "lucide-react";

type AgentMode = "governance" | "operator" | "technical";

type AgentMessage = {
  role: "yai" | "you";
  text: string;
  traceId?: string;
};

type QuickPrompt = {
  mode: AgentMode;
  label: string;
  prompt: string;
};

const quickPrompts: QuickPrompt[] = [
  {
    mode: "governance",
    label: "Check authority",
    prompt:
      "Evaluate this action before execution: a requester wants to export an evidence pack, but signer authority and rollback evidence are not attached.",
  },
  {
    mode: "operator",
    label: "Build runbook",
    prompt:
      "Turn this into a controlled operator run: confirm owner, record evidence, execute reversible steps first, and hold irreversible customer notification.",
  },
  {
    mode: "technical",
    label: "Explain PMS4U",
    prompt:
      "Explain how PMS4U and YAI Local control execution before consequence, using authority, admissibility, trace, and evidence.",
  },
];

const modeLabels: Record<AgentMode, string> = {
  governance: "Governance",
  operator: "Operator",
  technical: "Technical",
};

function buildBrowserFallback(prompt: string, mode: AgentMode) {
  const normalized = prompt.toLowerCase();

  if (mode === "technical" || normalized.includes("architecture") || normalized.includes("pms4u")) {
    return [
      "YAI TECHNICAL RESPONSE",
      "PMS4U sits between decision and consequence.",
      "1. It checks authority before execution.",
      "2. It tests admissibility before mutation.",
      "3. It binds the decision to trace and evidence.",
      "4. It refuses irreversible action when proof is incomplete.",
    ].join("\n");
  }

  if (mode === "operator" || normalized.includes("runbook") || normalized.includes("booking")) {
    return [
      "YAI OPERATOR RUNBOOK",
      "1. Name the accountable operator.",
      "2. State the consequence domain.",
      "3. Attach request, context, and evidence.",
      "4. Execute a reversible step first.",
      "5. Hold irreversible mutation until checks pass.",
      "6. Record a trace ID before handoff.",
    ].join("\n");
  }

  return [
    "YAI GOVERNANCE RESPONSE",
    "Requester urgency is not authority.",
    "Decision: NEED_REVIEW.",
    "Required before execution: accountable signer, admissible evidence, rollback path, and trace record.",
  ].join("\n");
}

export function YaiAgentBot() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AgentMode>("governance");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [runtimeSource, setRuntimeSource] = useState("standby");
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      role: "yai",
      text: "YAI website agent is online. Ask about authority, execution risk, operator next steps, or PMS4U architecture.",
      traceId: "YAI-WEB-BOOT",
    },
  ]);

  const currentPrompt = useMemo(
    () => quickPrompts.find((prompt) => prompt.mode === mode) ?? quickPrompts[0],
    [mode]
  );

  function resetSession() {
    setInput("");
    setRuntimeSource("standby");
    setMessages([
      {
        role: "yai",
        text: "YAI website agent is online. Ask about authority, execution risk, operator next steps, or PMS4U architecture.",
        traceId: "YAI-WEB-BOOT",
      },
    ]);
  }

  function usePrompt(prompt: QuickPrompt) {
    setMode(prompt.mode);
    setInput(prompt.prompt);
    setOpen(true);
  }

  async function sendPrompt(prompt: string) {
    const pageContext =
      typeof window === "undefined"
        ? ""
        : `\n\nWebsite context: ${window.location.hostname}${window.location.pathname}`;

    const response = await fetch("/api/yai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `${prompt}${pageContext}`, mode }),
    });

    if (!response.ok) {
      throw new Error(`YAI request failed (${response.status})`);
    }

    return (await response.json()) as {
      reply?: string;
      traceId?: string;
      runtimeSource?: string;
      model?: string;
    };
  }

  async function onSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const prompt = input.trim();
    if (!prompt || sending) return;

    setSending(true);
    setInput("");
    setMessages((prev) => [...prev, { role: "you", text: prompt }]);

    try {
      const data = await sendPrompt(prompt);
      setRuntimeSource(data.runtimeSource ?? "yai-api");
      setMessages((prev) => [
        ...prev,
        {
          role: "yai",
          text: (data.reply ?? "").trim() || "YAI returned no response.",
          traceId: data.traceId,
        },
      ]);
    } catch {
      const traceId = `YAI-BROWSER-${Date.now().toString(36).toUpperCase()}`;
      setRuntimeSource("browser-fallback");
      setMessages((prev) => [
        ...prev,
        {
          role: "yai",
          text: buildBrowserFallback(prompt, mode),
          traceId,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void onSubmit();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex max-w-[calc(100vw-2rem)] flex-col items-end font-sans text-white sm:bottom-5 sm:right-5">
      {open && (
        <section
          aria-label="YAI website agent"
          className="mb-3 flex h-[min(640px,calc(100vh-7rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden border border-white/15 bg-[#080b0f] shadow-2xl shadow-black/50"
        >
          <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#0f172a] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center border border-emerald-300/30 bg-emerald-950/30 text-emerald-200">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold tracking-normal text-white">YAI Agent Bot</h2>
                <p className="truncate text-xs text-slate-400">Authority before execution</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={resetSession}
                className="grid size-9 place-items-center border border-white/10 text-slate-300 transition hover:border-white/30 hover:text-white"
                aria-label="Reset YAI session"
                title="Reset session"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center border border-white/10 text-slate-300 transition hover:border-white/30 hover:text-white"
                aria-label="Close YAI agent"
                title="Close"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="border-b border-white/10 bg-black px-4 py-3">
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(modeLabels) as AgentMode[]).map((key) => {
                const active = key === mode;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMode(key)}
                    className={`min-h-10 border px-2 text-xs font-semibold transition ${
                      active
                        ? "border-emerald-300/50 bg-emerald-950/40 text-emerald-100"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25"
                    }`}
                  >
                    {modeLabels[key]}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => usePrompt(currentPrompt)}
              className="mt-3 flex w-full items-center justify-between gap-3 border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-slate-300 transition hover:border-emerald-300/40"
            >
              <span className="min-w-0 truncate">{currentPrompt.label}</span>
              <ChevronDown className="size-4 shrink-0 text-emerald-300" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <article
                key={`${message.role}-${index}-${message.traceId ?? "msg"}`}
                className={`max-w-[92%] border p-3 ${
                  message.role === "you"
                    ? "ml-auto border-emerald-300/25 bg-emerald-950/20"
                    : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <span>{message.role === "you" ? "You" : "YAI"}</span>
                  {message.traceId && <span className="truncate font-mono">{message.traceId}</span>}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-100">{message.text}</p>
              </article>
            ))}
            {sending && (
              <div className="max-w-[92%] border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
                YAI is checking authority, admissibility, trace, and evidence...
              </div>
            )}
          </div>

          <footer className="border-t border-white/10 bg-black p-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
              <span>Mode: {modeLabels[mode]}</span>
              <span className="truncate">Runtime: {runtimeSource}</span>
            </div>
            <form onSubmit={onSubmit} className="grid grid-cols-[1fr_auto] gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onInputKeyDown}
                rows={2}
                placeholder="Ask YAI before execution..."
                className="max-h-32 min-h-12 resize-none border border-white/10 bg-[#050505] px-3 py-2 text-sm leading-5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/60"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="grid size-12 place-items-center border border-emerald-300/40 bg-emerald-950/40 text-emerald-100 transition hover:border-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message to YAI"
                title="Send"
              >
                <Send className="size-4" aria-hidden="true" />
              </button>
            </form>
          </footer>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex min-h-14 items-center gap-3 border border-emerald-300/40 bg-[#0f172a] px-4 py-3 text-left shadow-2xl shadow-black/40 transition hover:border-emerald-200"
        aria-label={open ? "Collapse YAI agent" : "Open YAI agent"}
      >
        <span className="grid size-9 place-items-center bg-emerald-300 text-black">
          {open ? <Bot className="size-5" aria-hidden="true" /> : <MessageCircle className="size-5" aria-hidden="true" />}
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-semibold text-white">Ask YAI</span>
          <span className="block text-xs text-slate-400">Governed execution agent</span>
        </span>
      </button>
    </div>
  );
}
