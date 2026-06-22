import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

type YaiRequest = {
  prompt?: unknown;
  mode?: unknown;
};

function asText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return "";
}

function buildLocalFallbackReply(prompt: string, mode: string): string {
  const p = prompt.toLowerCase();

  if (mode === "governance" || p.includes("export") || p.includes("evidence")) {
    return [
      "GOVERNANCE RESPONSE",
      "1) Authority: requester urgency is not authority. Require accountable operator + signer scope.",
      "2) Admissibility: block export until request, legal basis, and rollback evidence are attached.",
      "3) Trace: create trace ID before any transfer and bind all artifacts to it.",
      "4) Decision: NEED_REVIEW (no irreversible action allowed).",
    ].join("\n");
  }

  if (mode === "operator" || p.includes("operator") || p.includes("booking")) {
    return [
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
    "YAI LOCAL",
    "I can operate in Governance, Operator, or Technical mode.",
    "Provide the target action and consequence domain, and I will return controlled next steps.",
  ].join("\n");
}

async function callOpenAI(prompt: string, mode: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
  const systemPrompt = [
    "You are YAI Local, a private execution assistant.",
    "Always prioritize authority, admissibility, trace, and evidence.",
    "Never instruct irreversible execution before checks pass.",
    "Return concise, operator-safe text.",
    `Active mode: ${mode || "general"}`,
  ].join(" ");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
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

    if (!prompt) {
      return NextResponse.json({ message: "Prompt is required." }, { status: 400 });
    }

    const traceId = `yai-${randomUUID()}`;

    try {
      const openai = await callOpenAI(prompt, mode);
      if (openai) {
        return NextResponse.json(
          {
            traceId,
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
        runtimeSource: "local-fallback",
        model: "yai-local",
        reply: buildLocalFallbackReply(prompt, mode),
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
