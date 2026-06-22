"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Cpu,
  RotateCcw,
  Server,
  ShieldCheck,
} from "lucide-react";

type Mode = "governance" | "operator" | "technical";

type ChatMessage = {
  role: "yai" | "you";
  tag: string;
  text: string;
};

type ModeCard = {
  mode: Mode;
  title: string;
  summary: string;
  promptTitle: string;
  promptText: string;
};

const modeCards: ModeCard[] = [
  {
    mode: "governance",
    title: "Governance",
    summary: "Authority, admissibility, trace, evidence.",
    promptTitle: "Gate export",
    promptText:
      "Evaluate whether PMS4U may export a customer evidence bundle to a partner portal. The requester says it is urgent, but authority and rollback evidence are not attached.",
  },
  {
    mode: "operator",
    title: "Operator",
    summary: "Next actions and controlled execution steps.",
    promptTitle: "Operator run",
    promptText:
      "Turn this into a controlled operator run: confirm a booking transition, assign a local operator, record evidence, and avoid irreversible customer notification until checks pass.",
  },
  {
    mode: "technical",
    title: "Technical",
    summary: "Architecture and integration details.",
    promptTitle: "Explain route",
    promptText:
      "Explain the YAI local route architecture for a demo: UI, API route, OpenAI path, local fallback, trace ID, and env setup.",
  },
];

const bootMessage: ChatMessage = {
  role: "yai",
  tag: "YAI-BOOT",
  text:
    "YAI local console is ready. Choose a mode or start with a demo prompt. On static production hosts, YAI uses a browser MCV fallback. On a server-backed local run with OPENAI_API_KEY, it calls OpenAI through /api/yai.",
};

export function YaiConsole() {
  const [mode, setMode] = useState<Mode>("governance");
  const [messages, setMessages] = useState<ChatMessage[]>([bootMessage]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [runtimeSource, setRuntimeSource] = useState("local-fallback");
  const [model, setModel] = useState("yai-local");

  const activeCard = useMemo(() => modeCards.find((card) => card.mode === mode) ?? modeCards[0], [mode]);

  function onReset() {
    setMessages([bootMessage]);
    setInput("");
    setRuntimeSource("local-fallback");
    setModel("yai-local");
  }

  function useModePrompt(card: ModeCard) {
    setMode(card.mode);
    setInput(card.promptText);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || sending) return;

    setSending(true);
    setMessages((prev) => [...prev, { role: "you", tag: "YOU", text: prompt }]);
    setInput("");

    try {
      const response = await fetch("/api/yai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mode }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = (await response.json()) as {
        reply?: string;
        traceId?: string;
        runtimeSource?: string;
        model?: string;
      };

      const reply = (data.reply ?? "").trim() || "YAI returned no response.";
      const traceId = data.traceId ? `\n\nTrace ID: ${data.traceId}` : "";

      setRuntimeSource(data.runtimeSource ?? "local-fallback");
      setModel(data.model ?? "yai-local");
      setMessages((prev) => [...prev, { role: "yai", tag: "YAI", text: `${reply}${traceId}` }]);
    } catch {
      const failedUrl = `${window.location.origin}${window.location.pathname}`;
      setModel("yai-error");
      setMessages((prev) => [
        ...prev,
        {
          role: "yai",
          tag: "YAI-ERROR",
          text: `YAI request failed.\n\nLoad failed${failedUrl}`,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="border border-white/10 bg-black p-5">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="grid size-11 place-items-center border border-emerald-300/30 bg-emerald-950/30 text-emerald-200">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-normal">YAI Local</h1>
              <p className="text-xs uppercase tracking-[0.22em] text-gray-500">OpenAI-ready MCV</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {modeCards.map((card) => {
              const active = card.mode === mode;
              return (
                <button
                  key={card.mode}
                  type="button"
                  onClick={() => setMode(card.mode)}
                  className={`w-full border p-4 text-left transition ${
                    active
                      ? "border-emerald-300/50 bg-emerald-950/20"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <span className="block text-sm font-semibold text-white">{card.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-gray-400">{card.summary}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 border border-white/10 bg-white/[0.02] p-3 text-xs">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Operator runbook</div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-gray-300">
              <li>Confirm accountable operator</li>
              <li>State consequence domain</li>
              <li>Attach request and context evidence</li>
              <li>Run reversible step first</li>
              <li>Record trace ID before handoff</li>
            </ul>
            <div className="mt-4 space-y-2 text-gray-300">
              <div className="flex items-start gap-3">
                <Server className="mt-0.5 size-4 text-emerald-300" />
                <div>
                  <div className="font-medium">Runtime source</div>
                  <div className="text-gray-400">{runtimeSource}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Cpu className="mt-0.5 size-4 text-orange-300" />
                <div>
                  <div className="font-medium">Model</div>
                  <div className="break-all text-gray-400">{model}</div>
                </div>
              </div>
              <div className="border border-white/10 bg-white/[0.02] p-3 font-mono text-xs text-gray-400">YAI-BOOT</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-white"
          >
            <RotateCcw className="size-4" />
            Reset session
          </button>
        </aside>

        <section className="flex min-h-[calc(100vh-48px)] flex-col border border-white/10 bg-black">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">PRIVATE EXECUTION ASSISTANT</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-white">Your local OpenAI/YAI surface</h2>
          </div>

          <div className="grid gap-3 border-b border-white/10 p-4 md:grid-cols-3">
            {modeCards.map((card) => (
              <button
                key={`prompt-${card.mode}`}
                type="button"
                onClick={() => useModePrompt(card)}
                className="border border-white/10 bg-white/[0.02] p-3 text-left transition hover:border-emerald-300/40 hover:bg-emerald-950/10"
              >
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">{card.mode}</span>
                <span className="mt-2 block text-sm font-semibold text-white">{card.promptTitle}</span>
                <span className="mt-2 line-clamp-3 block text-xs leading-5 text-gray-400">{card.promptText}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((message, index) => (
              <div
                key={`${message.tag}-${index}`}
                className={`max-w-3xl border p-4 ${
                  message.role === "yai" ? "border-white/10 bg-white/[0.03]" : "ml-auto border-emerald-300/25 bg-emerald-950/20"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                  <span>{message.role === "yai" ? "YAI" : "YOU"}</span>
                  <span className="font-mono">{message.tag}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-200">{message.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="border-t border-white/10 p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask YAI to evaluate an action, draft a controlled execution step, or explain PMS4U architecture."
                className="min-h-24 resize-none border border-white/10 bg-[#050505] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-300/60"
              />
              <button
                type="submit"
                disabled={sending}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-emerald-300/40 bg-emerald-950/40 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Running..." : "Send"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
