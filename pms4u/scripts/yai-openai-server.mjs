import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

loadLocalEnv(".env.local");
loadLocalEnv(".env");

const HOST = process.env.YAI_HOST || "127.0.0.1";
const PORT = Number(process.env.YAI_PORT || 3001);
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1";

function loadLocalEnv(fileName) {
  const path = resolve(process.cwd(), fileName);
  if (!existsSync(path)) return;

  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function json(response, status, payload) {
  response.writeHead(status, {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Origin": process.env.YAI_ALLOWED_ORIGIN || "http://127.0.0.1:3000",
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(payload));
}

function makeTraceId() {
  return `YAI-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
}

function normalizeMode(value) {
  return value === "operator" || value === "technical" || value === "governance"
    ? value
    : "governance";
}

function normalizeMessages(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      if (item.role !== "user" && item.role !== "assistant") return null;
      if (typeof item.content !== "string") return null;
      const content = item.content.trim();
      return content ? { role: item.role, content } : null;
    })
    .filter(Boolean)
    .slice(-12);
}

function extractOpenAiText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const text = payload.output
    ?.flatMap((item) => item.content || [])
    .map((item) => item.text)
    .filter((item) => typeof item === "string" && item.trim().length > 0)
    .join("\n")
    .trim();

  return text || "YAI received an empty model response.";
}

function summarizePrompt(prompt) {
  return prompt.length > 280 ? `${prompt.slice(0, 277)}...` : prompt;
}

const modeInstructions = {
  governance:
    "Prioritize authority, admissibility, execution boundaries, traceability, and evidence. Keep answers concise and operational.",
  operator:
    "Act like a local operations assistant. Convert requests into next actions, checks, and controlled execution steps.",
  technical:
    "Explain system architecture, implementation details, API surfaces, and integration risks with concrete engineering language.",
};

const modeLabels = {
  governance: "Governance",
  operator: "Operator",
  technical: "Technical",
};

function fallbackGuidanceFor(mode) {
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
      "4. For live model execution, set OPENAI_API_KEY and optionally OPENAI_MODEL, then restart the server.",
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

function localYaiFallback(messages, mode, traceId) {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const prompt = lastUserMessage?.content || "No request received.";

  return {
    content: [
      "YAI local fallback is active.",
      "",
      "No OpenAI API key is configured in this server process, so no external model call was made. This response is demo-safe and does not execute, mutate, or approve external actions.",
      "",
      `Mode: ${modeLabels[mode]}`,
      `Trace: ${traceId}`,
      `Received: ${summarizePrompt(prompt)}`,
      "",
      ...fallbackGuidanceFor(mode),
      "",
      "Live model path: add OPENAI_API_KEY to .env.local, optionally set OPENAI_MODEL, then restart npm run dev:yai.",
    ].join("\n"),
    mode,
    model: "yai-local-mcv",
    source: "local-fallback",
    traceId,
  };
}

const systemPrompt = `
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

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    return json(response, 204, {});
  }

  if (request.method === "GET" && request.url === "/health") {
    return json(response, 200, {
      ok: true,
      service: "yai-openai",
      model: MODEL,
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    });
  }

  if (request.method !== "POST" || request.url !== "/api/yai") {
    return json(response, 404, { error: "Not found" });
  }

  const traceId = makeTraceId();

  try {
    const body = JSON.parse(await readBody(request));
    const messages = normalizeMessages(body.messages);
    const mode = normalizeMode(body.mode);

    if (messages.length === 0) {
      return json(response, 400, { error: "YAI requires at least one user message.", traceId });
    }

    if (!process.env.OPENAI_API_KEY) {
      return json(response, 200, localYaiFallback(messages, mode, traceId));
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        instructions: `${systemPrompt}\n\nActive mode: ${modeInstructions[mode]}`,
        input: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      }),
    });

    const payload = await openAiResponse.json();

    if (!openAiResponse.ok) {
      return json(response, openAiResponse.status, {
        error:
          typeof payload?.error?.message === "string"
            ? payload.error.message
            : "OpenAI request failed.",
        mode,
        model: MODEL,
        source: "openai",
        traceId,
      });
    }

    return json(response, 200, {
      content: extractOpenAiText(payload),
      mode,
      model: MODEL,
      source: "openai",
      traceId,
    });
  } catch (error) {
    return json(response, 500, {
      error: error instanceof Error ? error.message : "Unexpected YAI runtime error.",
      traceId,
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`YAI OpenAI server listening on http://${HOST}:${PORT}`);
});
