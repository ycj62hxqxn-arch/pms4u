import {
  extractOpenAiText,
  getYaiModel,
  localYaiFallback,
  makeTraceId,
  normalizeMessages,
  normalizeMode,
  YAI_SYSTEM_PROMPT,
  validateOpenAiModel,
  yaiModes,
} from "@/lib/yai/model";

export const runtime = "nodejs";

const allowedOrigins = new Set([
  "https://pms.bpbsolutionsltd.com",
  "https://pms4u.vercel.app",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const allowOrigin = origin && allowedOrigins.has(origin) ? origin : "https://pms4u.vercel.app";

  return {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Origin": allowOrigin,
    Vary: "Origin",
  };
}

function json(request: Request, payload: unknown, init?: ResponseInit) {
  return Response.json(payload, {
    ...init,
    headers: {
      ...corsHeaders(request),
      ...init?.headers,
    },
  });
}

export function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export async function POST(request: Request) {
  const traceId = makeTraceId();

  try {
    const body = (await request.json()) as { messages?: unknown; mode?: unknown };
    const messages = normalizeMessages(body.messages);
    const mode = normalizeMode(body.mode);

    if (messages.length === 0) {
      return json(
        request,
        { error: "YAI requires at least one user message.", traceId },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = getYaiModel();

    if (!apiKey) {
      return json(request, localYaiFallback(messages, mode, traceId));
    }

    const modelValidation = await validateOpenAiModel(apiKey, model);

    if (!modelValidation.ok) {
      return json(
        request,
        {
          error: modelValidation.message,
          mode,
          model,
          source: "openai",
          suggestions: modelValidation.suggestions,
          traceId,
        },
        { status: 500 },
      );
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: `${YAI_SYSTEM_PROMPT}\n\nActive mode: ${yaiModes[mode].instruction}`,
        input: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      const message =
        typeof payload?.error?.message === "string"
          ? payload.error.message
          : "OpenAI request failed.";

      return json(
        request,
        {
          error: message,
          mode,
          model,
          source: "openai",
          traceId,
        },
        { status: response.status },
      );
    }

    return json(request, {
      content: extractOpenAiText(payload),
      mode,
      model,
      source: "openai",
      traceId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected YAI runtime error.";

    return json(request, { error: message, traceId }, { status: 500 });
  }
}
