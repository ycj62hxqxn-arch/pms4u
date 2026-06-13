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

export async function POST(request: Request) {
  const traceId = makeTraceId();

  try {
    const body = (await request.json()) as { messages?: unknown; mode?: unknown };
    const messages = normalizeMessages(body.messages);
    const mode = normalizeMode(body.mode);

    if (messages.length === 0) {
      return Response.json(
        { error: "YAI requires at least one user message.", traceId },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = getYaiModel();

    if (!apiKey) {
      return Response.json(localYaiFallback(messages, mode, traceId));
    }

    const modelValidation = await validateOpenAiModel(apiKey, model);

    if (!modelValidation.ok) {
      return Response.json(
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

      return Response.json(
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

    return Response.json({
      content: extractOpenAiText(payload),
      mode,
      model,
      source: "openai",
      traceId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected YAI runtime error.";

    return Response.json({ error: message, traceId }, { status: 500 });
  }
}
