import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

type YaiRequest = {
  prompt?: unknown;
  mode?: unknown;
  messages?: unknown;
  session?: unknown;
};

type YaiHistoryMessage = {
  role: "user" | "assistant";
  content: string;
  traceId?: string;
};

type YaiSessionContext = {
  sessionId?: string;
  lastIntent?: string;
  lastTopic?: string;
  lastTraceId?: string;
  pendingQuestion?: string;
};

function asText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return "";
}

function asHistoryMessages(value: unknown): YaiHistoryMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Record<string, unknown>;
      const role: YaiHistoryMessage["role"] | null =
        candidate.role === "user" || candidate.role === "assistant" ? candidate.role : null;
      const content = asText(candidate.content).slice(0, 4000);
      const traceId = asText(candidate.traceId);
      if (!role || !content) return null;
      const message: YaiHistoryMessage = { role, content, traceId: traceId || undefined };
      return message;
    })
    .filter((item): item is YaiHistoryMessage => Boolean(item))
    .slice(-16);
}

function asSessionContext(value: unknown): YaiSessionContext {
  if (!value || typeof value !== "object") return {};
  const candidate = value as Record<string, unknown>;
  return {
    sessionId: asText(candidate.sessionId),
    lastIntent: asText(candidate.lastIntent),
    lastTopic: asText(candidate.lastTopic),
    lastTraceId: asText(candidate.lastTraceId),
    pendingQuestion: asText(candidate.pendingQuestion),
  };
}

function isShortFollowUp(prompt: string) {
  return /^(yes|yeah|yep|ok|okay|this|that|the app|continue|go on|do it|both|same)$/i.test(prompt.trim());
}

function resolvePrompt(prompt: string, session: YaiSessionContext) {
  if (!isShortFollowUp(prompt)) return prompt;

  const context = [
    session.lastTopic ? `Last topic: ${session.lastTopic}` : "",
    session.pendingQuestion ? `Pending question: ${session.pendingQuestion}` : "",
    session.lastIntent ? `Last user intent: ${session.lastIntent}` : "",
    session.lastTraceId ? `Continue trace: ${session.lastTraceId}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (!context) return prompt;

  return [
    `The user sent a short follow-up: "${prompt}". Resolve it against the stored session context.`,
    context,
    "Continue the prior topic directly. Do not ask for clarification unless the context is still insufficient.",
  ].join("\n");
}

function buildLocalFallbackReply(prompt: string, mode: string, session: YaiSessionContext): string {
  const resolvedPrompt = resolvePrompt(prompt, session);
  const p = prompt.toLowerCase();
  const continuity = session.lastTraceId ? [`Continuing trace: ${session.lastTraceId}`, ""] : [];

  if (isShortFollowUp(prompt) && session.lastTopic) {
    const pending = `${session.pendingQuestion ?? ""} ${session.lastTopic ?? ""}`.toLowerCase();
    if (pending.includes("step-by-step") || pending.includes("feature list") || pending.includes("ride-hailing")) {
      return [
        ...continuity,
        "CONTEXT CONTINUED",
        `Topic: ${session.lastTopic}`,
        "Understood. You want to continue the driver/rider app idea.",
        "",
        "STEP-BY-STEP LAUNCH PLAN",
        "1) Pick one pilot city and define the legal operating model for cars and motorbikes.",
        "2) Validate driver economics: fixed monthly fee, low commission, or hybrid plan.",
        "3) Build driver onboarding: identity, license, vehicle, insurance, and safety checks.",
        "4) Build rider flow: pickup, destination, transparent fare, driver selection, and support.",
        "5) Add governance controls: operator review, incident trace, payment evidence, and reversible admin actions.",
        "6) Run a closed pilot with limited drivers before public launch.",
        "",
        "PRIORITY FEATURE LIST",
        "- Driver app: onboarding, availability, trip offers, wallet, subscription/commission status.",
        "- Rider app: fare estimate, vehicle type, live tracking, ratings, support.",
        "- Admin console: driver verification, dispute handling, pricing controls, trace logs.",
        "- Governance layer: authority checks before payouts, account suspensions, refunds, or data exports.",
      ].join("\n");
    }

    return [
      ...continuity,
      "CONTEXT CONTINUED",
      `Topic: ${session.lastTopic}`,
      session.pendingQuestion ? `Pending question: ${session.pendingQuestion}` : "Pending question: continue the previous request.",
      "Next response:",
      buildLocalFallbackReply(resolvedPrompt, mode, { ...session, lastTraceId: "" }),
    ].join("\n");
  }

  if (mode === "governance" || p.includes("export") || p.includes("evidence")) {
    return [
      ...continuity,
      "GOVERNANCE RESPONSE",
      "1) Authority: requester urgency is not authority. Require accountable operator + signer scope.",
      "2) Admissibility: block export until request, legal basis, and rollback evidence are attached.",
      "3) Trace: create trace ID before any transfer and bind all artifacts to it.",
      "4) Decision: NEED_REVIEW (no irreversible action allowed).",
    ].join("\n");
  }

  if (mode === "operator" || p.includes("operator") || p.includes("booking")) {
    return [
      ...continuity,
      "OPERATOR RUNBOOK",
      "1) Confirm accountable operator and role.",
      "2) Record consequence domain and impacted customer objects.",
      "3) Attach request + context evidence in one bundle.",
      "4) Execute reversible step first (dry-run / draft only).",
      "5) Hold irreversible notification until checks pass.",
      "6) Record trace ID before handoff.",
    ].join("\n");
  }

  if (mode === "technical" || p.includes("route") || p.includes("architecture")) {
    return [
      ...continuity,
      "YAI LOCAL ROUTE ARCHITECTURE",
      "- UI: /yai (client console) with mode presets and controlled prompt entry.",
      "- API: POST /api/yai for governed response generation.",
      "- OpenAI path: used when OPENAI_API_KEY exists.",
      "- Local fallback: deterministic governance/runbook response when key is absent or call fails.",
      "- Trace ID: generated per request and returned to UI.",
      "- Env: OPENAI_API_KEY and optional OPENAI_MODEL.",
    ].join("\n");
  }

  return [
    ...continuity,
    "YAI LOCAL",
    "I can operate in Governance, Operator, or Technical mode.",
    "Provide the target action and consequence domain, and I will return controlled next steps.",
  ].join("\n");
}

async function callOpenAI(
  prompt: string,
  mode: string,
  history: YaiHistoryMessage[],
  session: YaiSessionContext
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const systemPrompt = [
    "You are YAI Local, a private execution assistant.",
    "Always prioritize authority, admissibility, trace, and evidence.",
    "Never instruct irreversible execution before checks pass.",
    "Use the provided session memory to preserve conversational continuity.",
    "When the user sends a short follow-up such as yes, this, that, or the app, resolve it against lastTopic, pendingQuestion, and prior messages.",
    "Preserve trace continuity by mentioning the previous trace when supplied.",
    "Return concise, operator-safe text.",
    `Active mode: ${mode || "general"}`,
    session.lastTraceId ? `Previous trace ID: ${session.lastTraceId}` : "",
    session.lastTopic ? `Last topic: ${session.lastTopic}` : "",
    session.pendingQuestion ? `Pending question: ${session.pendingQuestion}` : "",
  ].join(" ");

  const input = [
    { role: "system", content: systemPrompt },
    ...history.map((message) => ({
      role: message.role,
      content: message.traceId ? `${message.content}\n\nTrace ID: ${message.traceId}` : message.content,
    })),
    { role: "user", content: resolvePrompt(prompt, session) },
  ];

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      input,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed (${response.status})`);
  }

  const payload = (await response.json()) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };

  const outputText =
    payload.output_text ??
    payload.output
      ?.flatMap((block) => block.content ?? [])
      .filter((item) => item.type === "output_text" || item.type === "text")
      .map((item) => item.text ?? "")
      .join("\n")
      .trim();

  if (!outputText) {
    throw new Error("OpenAI returned no text output");
  }

  return { outputText, model };
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = ((await request.json().catch(() => ({}))) ?? {}) as YaiRequest;
    const prompt = asText(body.prompt);
    const mode = asText(body.mode).toLowerCase();
    const history = asHistoryMessages(body.messages);
    const session = asSessionContext(body.session);

    if (!prompt) {
      return NextResponse.json({ message: "Prompt is required." }, { status: 400 });
    }

    const traceId = `yai-${randomUUID()}`;

    try {
      const openai = await callOpenAI(prompt, mode, history, session);
      if (openai) {
        return NextResponse.json(
          {
            traceId,
            previousTraceId: session.lastTraceId || null,
            continuingTraceId: session.lastTraceId || null,
            runtimeSource: "openai",
            model: openai.model,
            reply: openai.outputText,
          },
          { status: 200 }
        );
      }
    } catch {
      // fall through to local fallback
    }

    return NextResponse.json(
      {
        traceId,
        previousTraceId: session.lastTraceId || null,
        continuingTraceId: session.lastTraceId || null,
        runtimeSource: "local-fallback",
        model: "yai-local",
        reply: buildLocalFallbackReply(prompt, mode, session),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "YAI request failed.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
