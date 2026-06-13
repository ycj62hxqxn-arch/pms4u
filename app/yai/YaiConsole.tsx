"use client";

import { ClipboardCheck, Cpu, RotateCcw, Send, Server, ShieldCheck } from "lucide-react";
import { FormEvent, KeyboardEvent, useMemo, useRef, useState } from "react";

type Role = "user" | "assistant";
type Mode = "governance" | "operator" | "technical";
type Source = "openai" | "local-fallback";

type Message = {
  id: string;
  role: Role;
  content: string;
  traceId?: string;
  source?: Source;
  model?: string;
};

const modes: Array<{ id: Mode; label: string; description: string }> = [
  {
    id: "governance",
    label: "Governance",
    description: "Authority, admissibility, trace, evidence.",
  },
  {
    id: "operator",
    label: "Operator",
    description: "Next actions and controlled execution steps.",
  },
  {
    id: "technical",
    label: "Technical",
    description: "Architecture and integration details.",
  },
];

const starterMessages: Message[] = [
  {
    id: "yai-start",
    role: "assistant",
    content:
      "YAI local console is ready. Choose a mode or start with a demo prompt. On static production hosts, YAI uses a browser MCV fallback. On a server-backed local run with OPENAI_API_KEY, it calls OpenAI through /api/yai.",
    source: "local-fallback",
    model: "yai-local",
    traceId: "YAI-BOOT",
  },
];

const starterPrompts: Array<{ label: string; mode: Mode; prompt: string }> = [
  {
    label: "Gate export",
    mode: "governance",
    prompt:
      "Evaluate whether PMS4U may export a customer evidence bundle to a partner portal. The requester says it is urgent, but authority and rollback evidence are not attached.",
  },
  {
    label: "Operator run",
    mode: "operator",
    prompt:
      "Turn this into a controlled operator run: confirm a booking transition, assign a local operator, record evidence, and avoid irreversible customer notification until checks pass.",
  },
  {
    label: "Explain route",
    mode: "technical",
    prompt:
      "Explain the YAI local route architecture for a demo: UI, API route, OpenAI path, local fallback, trace ID, and env setup.",
  },
];

const operatorGuidance = [
  "Confirm accountable operator",
  "State consequence domain",
  "Attach request and context evidence",
  "Run reversible step first",
  "Record trace ID before handoff",
];

function newId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeTraceId() {
  return `YAI-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
}

function summarizePrompt(prompt: string) {
  return prompt.length > 240 ? `${prompt.slice(0, 237)}...` : prompt;
}

function normalizePrompt(prompt: string) {
  return prompt.toLowerCase().replace(/\s+/g, " ").trim();
}

function fallbackAnswerFor(prompt: string, activeMode: Mode): string[] {
  const normalized = normalizePrompt(prompt);
  const asksMeaning =
    normalized.includes("what u mean") ||
    normalized.includes("what you mean") ||
    normalized.includes("what do you mean") ||
    normalized.includes("meaning") ||
    normalized === "what";
  const asksRoute =
    normalized === "expl" ||
    normalized.includes("explain") ||
    normalized.includes("route") ||
    normalized.includes("api") ||
    normalized.includes("architecture") ||
    normalized.includes("openai");

  if (asksMeaning) {
    return [
      "Plain meaning:",
      "YAI is saying it cannot safely approve or execute a real action unless the basics are clear.",
      "",
      "It needs to know:",
      "1. Who is the accountable operator?",
      "2. What system or customer record will change?",
      "3. What evidence proves the request is allowed?",
      "4. What is the rollback path if the action is wrong?",
      "",
      "Until those are attached, the safe answer is: simulate or draft the step, but do not mutate production or notify a customer yet.",
    ];
  }

  if (asksRoute) {
    return [
      "YAI route explanation:",
      "1. The page you see is the browser UI.",
      "2. In a server-backed Next.js run, the UI sends your message to /api/yai.",
      "3. /api/yai reads OPENAI_API_KEY, calls the OpenAI Responses API, then returns the answer with a trace ID.",
      "4. On this static production export, /api/yai is not available, so the browser answers with this local MCV fallback.",
      "5. The fallback is useful for demos, but it is not an external model call.",
      "",
      "For real OpenAI reasoning: run the app with OPENAI_API_KEY on a server-backed deployment, or point NEXT_PUBLIC_YAI_API_BASE to a live YAI API host.",
    ];
  }

  if (activeMode === "operator") {
    return [
      "Operator answer:",
      "Convert the request into a controlled run before acting.",
      "1. Name the action, owner, target system, and expected consequence.",
      "2. Confirm the operator has current authority for this exact action.",
      "3. Attach request evidence, current context, expected mutation, and rollback path.",
      "4. Execute the smallest reversible step first.",
      "5. Record the trace ID before handoff or customer notification.",
    ];
  }

  if (activeMode === "technical") {
    return [
      "Technical answer:",
      "This production page is currently static, so it cannot run the Next.js API route that would call OpenAI.",
      "The UI still stays reactive through a browser fallback, but the response is generated locally from built-in MCV rules.",
      "",
      "To make it fully OpenAI-backed in production, deploy a server endpoint for /api/yai or set NEXT_PUBLIC_YAI_API_BASE to a live YAI API service.",
    ];
  }

  return [
    "Governance answer:",
    "Do not execute the external action yet.",
    "Missing items usually are: accountable operator, consequence domain, request evidence, target system, intended mutation, rollback path, and operator note.",
    "",
    "Safe next step: draft the action locally, attach evidence, and only then allow a production mutation or customer-facing notification.",
  ];
}

function localBrowserFallback(prompt: string, activeMode: Mode, reason: string): Message {
  const traceId = makeTraceId();

  return {
    id: newId(),
    role: "assistant",
    source: "local-fallback",
    model: "yai-browser-mcv",
    traceId,
    content: [
      "YAI browser fallback is active.",
      "",
      reason,
      "No external OpenAI model call was made from this browser fallback.",
      "",
      `Mode: ${modes.find((item) => item.id === activeMode)?.label || "Governance"}`,
      `Trace: ${traceId}`,
      `Received: ${summarizePrompt(prompt)}`,
      "",
      ...fallbackAnswerFor(prompt, activeMode),
    ].join("\n"),
  };
}

function getYaiApiUrl() {
  const configuredBase = process.env.NEXT_PUBLIC_YAI_API_BASE?.trim();

  if (configuredBase) {
    return `${configuredBase.replace(/\/$/, "")}/api/yai`;
  }

  return "/api/yai";
}

export default function YaiConsole() {
  const [mode, setMode] = useState<Mode>("governance");
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const lastRuntime = useMemo(() => {
    const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
    return {
      source: lastAssistant?.source || "local-fallback",
      model: lastAssistant?.model || "yai-local",
      traceId: lastAssistant?.traceId || "YAI-BOOT",
    };
  }, [messages]);

  const reset = () => {
    setMessages(starterMessages);
    setInput("");
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.focus();
  };

  const applyStarterPrompt = (starter: (typeof starterPrompts)[number]) => {
    setMode(starter.mode);
    setInput(starter.prompt);
    if (inputRef.current) inputRef.current.value = starter.prompt;
    inputRef.current?.focus();
  };

  const sendCurrentMessage = async () => {
    const content = (inputRef.current?.value || input).trim();
    if (!content || isSending) return;

    const userMessage: Message = { id: newId(), role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    if (inputRef.current) inputRef.current.value = "";
    setIsSending(true);

    try {
      const response = await fetch(getYaiApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const isJson = response.headers.get("content-type")?.includes("application/json");
      const payload = isJson ? await response.json() : null;

      if (!response.ok && (response.status === 404 || response.status === 405 || !isJson)) {
        setMessages((current) => [
          ...current,
          localBrowserFallback(
            content,
            mode,
            "The YAI API route is not available on this host, which can happen on static production exports.",
          ),
        ]);
        return;
      }

      if (!response.ok) {
        const reason = payload?.error || "YAI request failed.";
        throw new Error(
          `${reason}\n\nIf this is an OpenAI key error, rotate the key, restart the local server, and try again.`,
        );
      }

      setMessages((current) => [
        ...current,
        {
          id: newId(),
          role: "assistant",
          content: payload.content,
          traceId: payload.traceId,
          source: payload.source,
          model: payload.model,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        error instanceof SyntaxError
          ? localBrowserFallback(
              content,
              mode,
              "The YAI endpoint returned a non-JSON response, so the local demo fallback handled the request.",
            )
          : {
              id: newId(),
              role: "assistant",
              content:
                error instanceof Error
                  ? `YAI request failed.\n\n${error.message}`
                  : "YAI runtime error.",
              source: "local-fallback",
              model: "yai-error",
              traceId: "YAI-ERROR",
            },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendCurrentMessage();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    void sendCurrentMessage();
  };

  return (
    <main className="min-h-screen bg-[#070707] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="border border-white/10 bg-black p-5">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="grid size-11 place-items-center border border-emerald-300/30 bg-emerald-950/30 text-emerald-200">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-normal">YAI Local</h1>
              <p className="text-xs uppercase tracking-[0.22em] text-gray-500">OpenAI-ready MCV</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`w-full border p-4 text-left transition ${
                  mode === item.id
                    ? "border-emerald-300/50 bg-emerald-950/20"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
              >
                <span className="block text-sm font-semibold text-white">{item.label}</span>
                <span className="mt-1 block text-xs leading-5 text-gray-400">{item.description}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 border-t border-white/10 pt-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <ClipboardCheck className="size-4 text-emerald-300" aria-hidden="true" />
              Operator runbook
            </div>
            <ul className="space-y-2 text-xs leading-5 text-gray-400">
              {operatorGuidance.map((item) => (
                <li key={item} className="border border-white/10 bg-white/[0.02] px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
            <div className="flex items-start gap-3">
              <Server className="mt-0.5 size-4 text-emerald-300" aria-hidden="true" />
              <div>
                <div className="font-medium">Runtime source</div>
                <div className="text-gray-400">{lastRuntime.source}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Cpu className="mt-0.5 size-4 text-orange-300" aria-hidden="true" />
              <div>
                <div className="font-medium">Model</div>
                <div className="break-all text-gray-400">{lastRuntime.model}</div>
              </div>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-3 font-mono text-xs text-gray-400">
              {lastRuntime.traceId}
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-white"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset session
          </button>
        </aside>

        <section className="flex min-h-[calc(100vh-48px)] flex-col border border-white/10 bg-black">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Private execution assistant
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-white">
              Your local OpenAI/YAI surface
            </h2>
          </div>

          <div className="grid gap-3 border-b border-white/10 p-4 md:grid-cols-3">
            {starterPrompts.map((starter) => (
              <button
                key={starter.label}
                type="button"
                onClick={() => applyStarterPrompt(starter)}
                className="border border-white/10 bg-white/[0.02] p-3 text-left transition hover:border-emerald-300/40 hover:bg-emerald-950/10"
              >
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  {starter.mode}
                </span>
                <span className="mt-2 block text-sm font-semibold text-white">{starter.label}</span>
                <span className="mt-2 line-clamp-3 block text-xs leading-5 text-gray-400">
                  {starter.prompt}
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-3xl border p-4 ${
                  message.role === "user"
                    ? "ml-auto border-emerald-300/30 bg-emerald-950/20"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                  <span>{message.role === "user" ? "You" : "YAI"}</span>
                  {message.traceId && <span className="font-mono">{message.traceId}</span>}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7 text-gray-200">{message.content}</p>
              </div>
            ))}
            {isSending && (
              <div className="max-w-3xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-400">
                YAI is evaluating authority, context, and response...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-white/10 p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <textarea
                ref={inputRef}
                defaultValue={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask YAI to evaluate an action, draft a controlled execution step, or explain PMS4U architecture."
                className="min-h-24 resize-none border border-white/10 bg-[#050505] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-300/60"
              />
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-emerald-300/40 bg-emerald-950/40 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.02] disabled:text-gray-600"
              >
                <Send className="size-4" aria-hidden="true" />
                Send
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
