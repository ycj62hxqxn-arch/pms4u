export type YaiMemoryRole = "user" | "assistant";

export type YaiMemoryMessage = {
  role: YaiMemoryRole;
  content: string;
  traceId?: string;
};

export type YaiBrowserMemory = {
  sessionId: string;
  messages: YaiMemoryMessage[];
  lastIntent?: string;
  lastTopic?: string;
  lastTraceId?: string;
  pendingQuestion?: string;
  createdAt: string;
  updatedAt: string;
};

const maxMessages = 16;

export function createYaiSessionId(prefix = "yai-session") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createYaiMemory(prefix?: string): YaiBrowserMemory {
  const now = new Date().toISOString();
  return {
    sessionId: createYaiSessionId(prefix),
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function loadYaiMemory(storageKey: string, prefix?: string): YaiBrowserMemory {
  if (typeof window === "undefined") {
    return createYaiMemory(prefix);
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return createYaiMemory(prefix);

    const parsed = JSON.parse(raw) as Partial<YaiBrowserMemory>;
    if (!parsed.sessionId || !Array.isArray(parsed.messages)) {
      return createYaiMemory(prefix);
    }

    return {
      sessionId: parsed.sessionId,
      messages: parsed.messages
        .filter((message) => message.role === "user" || message.role === "assistant")
        .map((message) => ({
          role: message.role,
          content: String(message.content ?? "").slice(0, 4000),
          traceId: message.traceId,
        }))
        .slice(-maxMessages),
      lastIntent: parsed.lastIntent,
      lastTopic: parsed.lastTopic,
      lastTraceId: parsed.lastTraceId,
      pendingQuestion: parsed.pendingQuestion,
      createdAt: parsed.createdAt ?? new Date().toISOString(),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return createYaiMemory(prefix);
  }
}

export function saveYaiMemory(storageKey: string, memory: YaiBrowserMemory) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    storageKey,
    JSON.stringify({
      ...memory,
      messages: memory.messages.slice(-maxMessages),
      updatedAt: new Date().toISOString(),
    })
  );
}

export function clearYaiMemory(storageKey: string, prefix?: string) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(storageKey);
  }
  return createYaiMemory(prefix);
}

export function isShortFollowUp(text: string) {
  const normalized = text.trim().toLowerCase();
  return /^(yes|yeah|yep|ok|okay|this|that|the app|continue|go on|do it|both|same)$/i.test(normalized);
}

export function inferTopic(prompt: string, previousTopic?: string) {
  const normalized = prompt.trim();
  if (!normalized) return previousTopic;
  if (isShortFollowUp(normalized)) return previousTopic;
  return normalized.length > 140 ? `${normalized.slice(0, 137)}...` : normalized;
}

export function inferPendingQuestion(reply: string) {
  const sentences = reply
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const question = [...sentences].reverse().find((line) => line.includes("?"));
  return question?.slice(0, 280);
}

export function updateYaiMemory(
  memory: YaiBrowserMemory,
  prompt: string,
  reply: string,
  traceId?: string
): YaiBrowserMemory {
  const now = new Date().toISOString();
  const nextMessages = [
    ...memory.messages,
    { role: "user" as const, content: prompt },
    { role: "assistant" as const, content: reply, traceId },
  ].slice(-maxMessages);

  return {
    ...memory,
    messages: nextMessages,
    lastIntent: prompt,
    lastTopic: inferTopic(prompt, memory.lastTopic),
    lastTraceId: traceId ?? memory.lastTraceId,
    pendingQuestion: inferPendingQuestion(reply),
    updatedAt: now,
  };
}

export function memoryToRequest(memory: YaiBrowserMemory) {
  return {
    sessionId: memory.sessionId,
    lastIntent: memory.lastIntent,
    lastTopic: memory.lastTopic,
    lastTraceId: memory.lastTraceId,
    pendingQuestion: memory.pendingQuestion,
  };
}
