export type YaiRole = "user" | "assistant";

export type YaiMessage = {
  role: YaiRole;
  content: string;
};

export type YaiMode = "governance" | "operator" | "technical";

export type YaiResponse = {
  content: string;
  mode: YaiMode;
  model: string;
  source: "openai" | "local-fallback";
  traceId: string;
};

export type OpenAiModelValidation = {
  ok: boolean;
  message?: string;
  suggestions?: string[];
};

export const DEFAULT_YAI_MODEL = "gpt-4.1";

export function getYaiModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_YAI_MODEL;
}

export const yaiModes: Record<YaiMode, { label: string; instruction: string }> = {
  governance: {
    label: "Governance",
    instruction:
      "Prioritize authority, admissibility, execution boundaries, traceability, and evidence. Keep answers concise and operational.",
  },
  operator: {
    label: "Operator",
    instruction:
      "Act like a local operations assistant. Convert requests into next actions, checks, and controlled execution steps.",
  },
  technical: {
    label: "Technical",
    instruction:
      "Explain system architecture, implementation details, API surfaces, and integration risks with concrete engineering language.",
  },
};

export const YAI_SYSTEM_PROMPT = `
You are YAI, a private local assistant for PMS4U and BPB Solutions LTD.
You are not generic ChatGPT branding. You are an execution-governance assistant.

Operating doctrine:
- Authority before execution.
- Evidence before consequence.
- Prevent unauthorized actions before they create consequences.
- If a request needs external execution, identify the required authority and evidence first.
- If uncertain, state the missing input and suggest the smallest safe next step.

Style:
- Direct, concise, practical.
- No hype.
- Use clear operational language.
`.trim();

export function normalizeMode(value: unknown): YaiMode {
  if (value === "operator" || value === "technical" || value === "governance") {
    return value;
  }

  return "governance";
}

export function normalizeMessages(value: unknown): YaiMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as { role?: unknown; content?: unknown };
      if (candidate.role !== "user" && candidate.role !== "assistant") return null;
      if (typeof candidate.content !== "string") return null;
      const content = candidate.content.trim();
      if (!content) return null;
      return { role: candidate.role, content };
    })
    .filter((item): item is YaiMessage => Boolean(item))
    .slice(-12);
}

export function makeTraceId() {
  return `YAI-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
}

function summarizePrompt(prompt: string) {
  return prompt.length > 280 ? `${prompt.slice(0, 277)}...` : prompt;
}

function fallbackGuidanceFor(mode: YaiMode): string[] {
  if (mode === "operator") {
    return [
      "Operator guidance:",
      "1. Name the action, owner, system, and consequence before execution.",
      "2. Confirm authority is current, explicit, and scoped to this action.",
      "3. Collect minimum evidence: request, context, expected mutation, rollback path.",
      "4. Run the smallest reversible step first; block irreversible mutation until evidence is complete.",
      "5. Record the trace ID with the operator note before handing off or continuing.",
    ];
  }

  if (mode === "technical") {
    return [
      "Technical guidance:",
      "1. UI sends mode plus normalized messages to /api/yai.",
      "2. The route uses OPENAI_API_KEY when present and returns this local MCV fallback when absent.",
      "3. The fallback keeps the demo usable without network calls, secrets, or external mutation.",
      "4. For live model execution, set OPENAI_API_KEY and optionally OPENAI_MODEL, then restart the dev server.",
    ];
  }

  return [
    "Governance guidance:",
    "1. Provisional decision: DEFER external execution until authority and evidence are confirmed.",
    "2. Required authority: named accountable operator plus approved consequence domain.",
    "3. Required evidence: requested action, current context, expected mutation, rollback option, trace record.",
    "4. Safe next step: draft or simulate the action locally; do not mutate production state from fallback mode.",
  ];
}

export function localYaiFallback(messages: YaiMessage[], mode: YaiMode, traceId: string): YaiResponse {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const prompt = lastUserMessage?.content || "No request received.";

  return {
    mode,
    model: "yai-local-mcv",
    source: "local-fallback",
    traceId,
    content: [
      "YAI local fallback is active.",
      "",
      "No OpenAI API key is configured in this server process, so no external model call was made. This response is demo-safe and does not execute, mutate, or approve external actions.",
      "",
      `Mode: ${yaiModes[mode].label}`,
      `Trace: ${traceId}`,
      `Received: ${summarizePrompt(prompt)}`,
      "",
      ...fallbackGuidanceFor(mode),
      "",
      "Live model path: add OPENAI_API_KEY to .env.local, optionally set OPENAI_MODEL, then restart npm run dev.",
    ].join("\n"),
  };
}

type OpenAiModelListPayload = {
  data?: Array<{ id?: string }>;
  error?: { message?: string };
};

export async function validateOpenAiModel(apiKey: string, model: string): Promise<OpenAiModelValidation> {
  const response = await fetch("https://api.openai.com/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const payload = (await response.json()) as OpenAiModelListPayload;

  if (!response.ok) {
    return {
      ok: false,
      message: payload.error?.message || "OpenAI model validation failed.",
    };
  }

  const availableModels = (payload.data || [])
    .map((item) => item.id)
    .filter((item): item is string => typeof item === "string" && item.length > 0);

  if (availableModels.includes(model)) {
    return { ok: true };
  }

  return {
    ok: false,
    message: `Configured OPENAI_MODEL "${model}" is not available to this OpenAI API key.`,
    suggestions: availableModels
      .filter((item) => item.startsWith("gpt-") || item.startsWith("o"))
      .sort()
      .slice(0, 8),
  };
}

type ResponseContentItem = {
  type?: string;
  text?: string;
};

type ResponseOutputItem = {
  type?: string;
  content?: ResponseContentItem[];
};

type OpenAiResponsePayload = {
  output_text?: string;
  output?: ResponseOutputItem[];
};

export function extractOpenAiText(payload: OpenAiResponsePayload): string {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const text = payload.output
    ?.flatMap((item) => item.content || [])
    .map((item) => item.text)
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .join("\n")
    .trim();

  return text || "YAI received an empty model response.";
}
