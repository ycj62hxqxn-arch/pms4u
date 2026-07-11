(function () {
  const cfg = window.PMS4U_WEBCHAT_CONFIG || {};
  const apiUrl = cfg.apiUrl || "/api/yai";
  const title = cfg.title || "YAI Egypt Access Bot";
  const subtitle = cfg.subtitle || "Authority before booking";
  const contextLabel = cfg.contextLabel || "Ägypten Hautnah / Local Egypt Access";
  const placeholder = cfg.placeholder || "Ask YAI before booking...";
  const brandColor = cfg.brandColor || "#86efac";
  const intro =
    cfg.intro ||
    "Hi. I can support tourism, real-estate, and investment-intent requests for Egypt. What do you need?";

  const memoryStorageKey = "yai.website.agent.memory";
  const maxMessages = 16;
  const modeLabels = {
    tourism: "🌍 Tourism",
    property: "🏡 Property",
    investment: "💰 Investment",
    operator: "Operator",
    technical: "Technical",
  };

  const quickPrompts = [
    {
      mode: "tourism",
      label: "Qualify tourism request",
      prompt:
        "Qualify this Egypt tourism request for Hurghada. Extract timeframe and budget range, ask missing qualifiers, then route to operator review + WhatsApp handoff.",
    },
    {
      mode: "property",
      label: "Qualify property request",
      prompt:
        "Qualify a sale-unit viewing/acquisition request in El Gouna, Makadi, or Sahl Hasheesh. Capture objective, budget range, residency intent, and contact preference. Do not request exact address or private media.",
    },
    {
      mode: "investment",
      label: "Qualify investment-intent",
      prompt:
        "Run investment-intent qualification for Egypt real-estate access. Ask for objective, budget range, timeline, and risk assumptions. No financial advice or guaranteed ROI.",
    },
    {
      mode: "operator",
      label: "Route property viewing",
      prompt:
        "Create an operator-safe route for property viewing in El Gouna or Makadi, including rental screening and pre-contract qualification only.",
    },
    {
      mode: "technical",
      label: "Explain governed access",
      prompt:
        "Explain how Authority before booking works for Ägypten Hautnah: qualification, operator review, evidence, and no final booking commitment in chat.",
    },
  ];

  function createSessionId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function displaySessionId(sessionId) {
    const raw = String(sessionId || "").replace(/^yai-egy-?/i, "");
    const compact = raw.slice(0, 12).replace(/[^a-z0-9]/gi, "").toUpperCase();
    return `YAI-EGY-${compact || "SESSION"}`;
  }

  function createMemory(prefix) {
    const now = new Date().toISOString();
    return {
      sessionId: createSessionId(prefix || "yai-agent"),
      messages: [],
      createdAt: now,
      updatedAt: now,
      lastIntent: "",
      lastTopic: "",
      lastTraceId: "",
      pendingQuestion: "",
    };
  }

  function loadMemory() {
    try {
      const raw = window.localStorage.getItem(memoryStorageKey);
      if (!raw) return createMemory("yai-egy");
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.sessionId || !Array.isArray(parsed.messages)) return createMemory("yai-egy");

      return {
        sessionId: parsed.sessionId,
        messages: parsed.messages
          .filter((m) => m && (m.role === "user" || m.role === "assistant"))
          .map((m) => ({ role: m.role, content: String(m.content || "").slice(0, 4000), traceId: m.traceId }))
          .slice(-maxMessages),
        createdAt: parsed.createdAt || new Date().toISOString(),
        updatedAt: parsed.updatedAt || new Date().toISOString(),
        lastIntent: parsed.lastIntent || "",
        lastTopic: parsed.lastTopic || "",
        lastTraceId: parsed.lastTraceId || "",
        pendingQuestion: parsed.pendingQuestion || "",
      };
    } catch (_e) {
      return createMemory("yai-egy");
    }
  }

  function saveMemory(memory) {
    window.localStorage.setItem(
      memoryStorageKey,
      JSON.stringify({
        ...memory,
        messages: memory.messages.slice(-maxMessages),
        updatedAt: new Date().toISOString(),
      })
    );
  }

  function clearMemory() {
    window.localStorage.removeItem(memoryStorageKey);
    return createMemory("yai-egy");
  }

  function isShortFollowUp(text) {
    return /^(yes|yeah|yep|ok|okay|this|that|the app|continue|go on|do it|both|same)$/i.test((text || "").trim());
  }

  function inferTopic(prompt, previousTopic) {
    const normalized = (prompt || "").trim();
    if (!normalized) return previousTopic;
    if (isShortFollowUp(normalized)) return previousTopic;
    return normalized.length > 140 ? `${normalized.slice(0, 137)}...` : normalized;
  }

  function inferPendingQuestion(reply) {
    const lines = String(reply || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const question = [...lines].reverse().find((line) => line.includes("?"));
    return question ? question.slice(0, 280) : "";
  }

  function updateMemory(memory, prompt, reply, traceId) {
    const next = {
      ...memory,
      messages: [
        ...memory.messages,
        { role: "user", content: prompt },
        { role: "assistant", content: reply, traceId: traceId || undefined },
      ].slice(-maxMessages),
      lastIntent: prompt,
      lastTopic: inferTopic(prompt, memory.lastTopic),
      lastTraceId: traceId || memory.lastTraceId,
      pendingQuestion: inferPendingQuestion(reply),
      updatedAt: new Date().toISOString(),
    };
    return next;
  }

  function memoryToRequest(memory) {
    return {
      sessionId: memory.sessionId,
      lastIntent: memory.lastIntent,
      lastTopic: memory.lastTopic,
      lastTraceId: memory.lastTraceId,
      pendingQuestion: memory.pendingQuestion,
    };
  }

  function buildEgyptContext() {
    return [
      "Bot identity: YAI Egypt Access Bot.",
      "Context: Ägypten Hautnah / Local Egypt Access.",
      "Use case domains: Egypt tourism, Hurghada, El Gouna, Makadi, Sahl Hasheesh, sale screening, property viewing, apartment/villa buying intent, investment-intent routing, consultation booking, operator review, WhatsApp handoff.",
      "Guardrails: no final booking confirmation, no legal advice, no financial advice, no guaranteed ROI, no property purchase commitment, no exact address disclosure, no full video disclosure.",
      "Policy: qualify request first, then route to operator.",
      `Website context: ${window.location.hostname}${window.location.pathname}`,
    ].join("\n");
  }

  function extractAnalysis(prompt, mode) {
    const text = String(prompt || "").toLowerCase();
    const intents = [];
    const asks = [];

    const hasTourism = /(tour|trip|days|day|hotel|dive|diving|safari|luxor|cairo|excursion|pickup|vacation|holiday)/i.test(text);
    const hasProperty = /(apartment|villa|property|viewing|rent|rental|sale|sell|for\s*sale|compound|buy|purchase|real\s*estate|unit)/i.test(text);
    const hasInvestment = /(invest|investment|yield|roi|portfolio|capital|return)/i.test(text);
    const hasRelocation = /(relocat|move|live in egypt|long stay|winter stay|residency)/i.test(text);

    if (hasTourism || mode === "tourism") intents.push("Tourism");
    if (hasProperty || mode === "property") intents.push("Property");
    if (hasInvestment || mode === "investment") intents.push("Investment");
    if (hasRelocation) intents.push("Relocation");
    if (intents.length === 0) intents.push("General");

    let location = "Unknown";
    if (/(hurghada)/i.test(text)) location = "Hurghada";
    else if (/(el\s*gouna|gouna)/i.test(text)) location = "El Gouna";
    else if (/(makadi)/i.test(text)) location = "Makadi";
    else if (/(sahl\s*hasheesh)/i.test(text)) location = "Sahl Hasheesh";
    else if (/(soma\s*bay)/i.test(text)) location = "Soma Bay";
    else if (intents.includes("Tourism")) location = "Hurghada";

    const timeframeMatch = text.match(/(\d+)\s*(day|days|week|weeks|month|months)/i);
    const timeframe = timeframeMatch ? `${timeframeMatch[1]} ${timeframeMatch[2]}` : "Unknown";

    const budgetMatch = text.match(/(?:€|eur|euro|\$)?\s?(\d{2,6}(?:[\.,]\d{3})?\s?(?:k|m)?)/i);
    const budget = budgetMatch ? budgetMatch[1] : "Unknown";

    if (timeframe === "Unknown") asks.push("timeframe");
    if (budget === "Unknown") asks.push("budget range");
    if (location === "Unknown") asks.push("preferred location");

    let nextStep = "Run qualification and route to operator review.";
    if (intents.includes("Tourism")) nextStep = "Build itinerary draft, then operator review, then WhatsApp handoff.";
    if (intents.includes("Property")) nextStep = "Run sale-unit qualification (budget, residency, finance/cash), then operator review.";
    if (intents.includes("Investment")) nextStep = "Run investment-intent qualification, then governed operator routing.";

    const confidenceBase = 100 - asks.length * 18;
    const confidence = Math.max(30, Math.min(98, confidenceBase));
    const needsClarification = confidence < 70;

    return {
      intents,
      location,
      timeframe,
      budget,
      needsClarification,
      clarificationPrompt:
        asks.length > 0
          ? `Before routing, I need ${asks.join(", ")}. Please provide missing details so I can qualify your request safely.`
          : "",
      nextStep,
      confidence,
    };
  }

  function buildBrowserFallback(prompt, mode, memory) {
    const normalized = String(prompt || "").toLowerCase();
    const continuity = memory.lastTraceId ? [`Continuing trace: ${memory.lastTraceId}`, ""] : [];

    if (isShortFollowUp(prompt) && memory.lastTopic) {
      return [
        ...continuity,
        "YAI CONTINUED CONTEXT",
        `Topic: ${memory.lastTopic}`,
        memory.pendingQuestion
          ? `Pending question: ${memory.pendingQuestion}`
          : "Pending question: continue the previous request.",
        "I will continue from stored context.",
      ].join("\n");
    }

    if (mode === "technical" || normalized.includes("architecture") || normalized.includes("api")) {
      return [
        ...continuity,
        "YAI EGYPT TECHNICAL RESPONSE",
        "1. Capture objective, area, timeframe, budget range, and contact preference.",
        "2. Run qualification under authority-before-booking controls.",
        "3. Route to operator review and WhatsApp handoff.",
        "4. Keep chat in pre-contract mode only.",
      ].join("\n");
    }

    if (
      mode === "operator" ||
      mode === "tourism" ||
      mode === "property" ||
      mode === "investment" ||
      normalized.includes("viewing") ||
      normalized.includes("sale") ||
      normalized.includes("sell") ||
      normalized.includes("rental") ||
      normalized.includes("tour")
    ) {
      return [
        ...continuity,
        "YAI EGYPT OPERATOR RUNBOOK",
        "1. Identify objective: tourism / sale screening / property viewing / investment-intent.",
        "2. Confirm area: Hurghada, El Gouna, Makadi, Sahl Hasheesh, or other.",
        "3. Capture timeframe and budget range.",
        "4. Confirm contact preference and prepare WhatsApp handoff brief.",
        "5. Mark request as pre-contract qualification pending operator review.",
      ].join("\n");
    }

    return [
      ...continuity,
      "YAI EGYPT GOVERNANCE RESPONSE",
      "Authority before booking.",
      "Decision: NEED_REVIEW.",
      "Required: qualification details, operator review, and WhatsApp handoff.",
      "No final booking, legal advice, financial advice, guaranteed ROI, or purchase commitment in chat.",
    ].join("\n");
  }

  const state = {
    open: false,
    mode: "tourism",
    sending: false,
    runtimeSource: "standby",
    continuingTraceId: "",
    analysis: extractAnalysis("", "tourism"),
    memory: loadMemory(),
    messages: [
      {
        role: "yai",
        text: intro,
        traceId: "YAI-WEB-BOOT",
      },
    ],
  };

  if (state.memory.messages.length > 0) {
    state.messages = [
      {
        role: "yai",
        text: "YAI Egypt Access Bot memory restored. Continue the previous topic or reset the session.",
        traceId: state.memory.lastTraceId || "YAI-WEB-BOOT",
      },
      ...state.memory.messages.map((msg) => ({
        role: msg.role === "user" ? "you" : "yai",
        text: msg.content,
        traceId: msg.traceId,
      })),
    ];
    state.continuingTraceId = state.memory.lastTraceId || "";
  }

  const root = document.createElement("div");
  root.style.position = "fixed";
  root.style.right = "8px";
  root.style.bottom = "8px";
  root.style.zIndex = "99999";
  root.style.display = "flex";
  root.style.flexDirection = "column";
  root.style.alignItems = "flex-end";
  root.style.maxWidth = "calc(100vw - 1rem)";
  root.style.fontFamily = "Inter, Arial, sans-serif";

  const panel = document.createElement("section");
  panel.style.display = "none";
  panel.style.marginBottom = "12px";
  panel.style.width = "min(420px, calc(100vw - 1rem))";
  panel.style.height = "min(640px, calc(100vh - 7rem))";
  panel.style.background = "#080b0f";
  panel.style.border = "1px solid rgba(255,255,255,.15)";
  panel.style.boxShadow = "0 25px 55px rgba(0,0,0,.5)";
  panel.style.overflow = "hidden";
  panel.style.color = "#fff";

  const header = document.createElement("header");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.gap = "10px";
  header.style.borderBottom = "1px solid rgba(255,255,255,.1)";
  header.style.background = "#0f172a";
  header.style.padding = "12px 14px";

  const left = document.createElement("div");
  left.style.display = "flex";
  left.style.gap = "10px";
  left.style.alignItems = "center";

  const icon = document.createElement("div");
  icon.style.display = "grid";
  icon.style.placeItems = "center";
  icon.style.width = "40px";
  icon.style.height = "40px";
  icon.style.border = "1px solid rgba(134,239,172,.3)";
  icon.style.background = "rgba(6,78,59,.35)";
  icon.style.color = "#bbf7d0";
  icon.textContent = "🛡️";

  const titleWrap = document.createElement("div");
  const h2 = document.createElement("h2");
  h2.textContent = title;
  h2.style.margin = "0";
  h2.style.fontSize = "14px";
  h2.style.fontWeight = "700";
  const sub = document.createElement("p");
  sub.textContent = subtitle;
  sub.style.margin = "2px 0 0";
  sub.style.color = "#94a3b8";
  sub.style.fontSize = "12px";
  titleWrap.appendChild(h2);
  titleWrap.appendChild(sub);

  left.appendChild(icon);
  left.appendChild(titleWrap);

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "6px";

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.textContent = "↺";
  resetBtn.title = "Reset session";
  resetBtn.style.width = "34px";
  resetBtn.style.height = "34px";
  resetBtn.style.border = "1px solid rgba(255,255,255,.15)";
  resetBtn.style.background = "transparent";
  resetBtn.style.color = "#cbd5e1";
  resetBtn.style.cursor = "pointer";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "✕";
  closeBtn.style.width = "34px";
  closeBtn.style.height = "34px";
  closeBtn.style.border = "1px solid rgba(255,255,255,.15)";
  closeBtn.style.background = "transparent";
  closeBtn.style.color = "#cbd5e1";
  closeBtn.style.cursor = "pointer";

  actions.appendChild(resetBtn);
  actions.appendChild(closeBtn);
  header.appendChild(left);
  header.appendChild(actions);

  const modeBar = document.createElement("div");
  modeBar.style.borderBottom = "1px solid rgba(255,255,255,.1)";
  modeBar.style.background = "#000";
  modeBar.style.padding = "10px 12px";

  const modeGrid = document.createElement("div");
  modeGrid.style.display = "grid";
  modeGrid.style.gridTemplateColumns = "repeat(5, minmax(0, 1fr))";
  modeGrid.style.gap = "8px";

  const modeButtons = {};
  Object.keys(modeLabels).forEach((mode) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = modeLabels[mode];
    btn.style.minHeight = "40px";
    btn.style.border = "1px solid rgba(255,255,255,.1)";
    btn.style.background = "rgba(255,255,255,.03)";
    btn.style.color = "#cbd5e1";
    btn.style.fontSize = "12px";
    btn.style.fontWeight = "700";
    btn.style.cursor = "pointer";
    btn.addEventListener("click", function () {
      state.mode = mode;
      paintModes();
    });
    modeButtons[mode] = btn;
    modeGrid.appendChild(btn);
  });

  const quickBtn = document.createElement("button");
  quickBtn.type = "button";
  quickBtn.style.marginTop = "8px";
  quickBtn.style.width = "100%";
  quickBtn.style.border = "1px solid rgba(255,255,255,.1)";
  quickBtn.style.background = "rgba(255,255,255,.03)";
  quickBtn.style.color = "#cbd5e1";
  quickBtn.style.fontSize = "12px";
  quickBtn.style.textAlign = "left";
  quickBtn.style.padding = "10px";
  quickBtn.style.cursor = "pointer";

  modeBar.appendChild(modeGrid);
  modeBar.appendChild(quickBtn);

  const runtimePanel = document.createElement("div");
  runtimePanel.style.borderBottom = "1px solid rgba(255,255,255,.1)";
  runtimePanel.style.background = "rgba(15,23,42,.55)";
  runtimePanel.style.padding = "10px 12px";

  const runtimeTitle = document.createElement("div");
  runtimeTitle.textContent = "Governed runtime snapshot";
  runtimeTitle.style.fontSize = "11px";
  runtimeTitle.style.textTransform = "uppercase";
  runtimeTitle.style.letterSpacing = "0.12em";
  runtimeTitle.style.color = "#94a3b8";
  runtimeTitle.style.marginBottom = "8px";

  const runtimeGrid = document.createElement("div");
  runtimeGrid.style.display = "grid";
  runtimeGrid.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
  runtimeGrid.style.gap = "8px";

  function createMetricCard(label) {
    const card = document.createElement("div");
    card.style.border = "1px solid rgba(255,255,255,.1)";
    card.style.background = "rgba(255,255,255,.03)";
    card.style.padding = "8px";

    const l = document.createElement("div");
    l.textContent = label;
    l.style.fontSize = "10px";
    l.style.textTransform = "uppercase";
    l.style.letterSpacing = "0.1em";
    l.style.color = "#64748b";

    const v = document.createElement("div");
    v.style.marginTop = "4px";
    v.style.fontSize = "12px";
    v.style.color = "#e2e8f0";
    v.style.whiteSpace = "nowrap";
    v.style.overflow = "hidden";
    v.style.textOverflow = "ellipsis";

    card.appendChild(l);
    card.appendChild(v);
    return { card, value: v };
  }

  const metricContext = createMetricCard("Context detected");
  const metricMode = createMetricCard("Mode");
  const metricSession = createMetricCard("Session");
  const metricIntent = createMetricCard("Detected intent");
  const metricStep = createMetricCard("Suggested next step");
  const metricReceipt = createMetricCard("Evidence receipt");

  runtimeGrid.appendChild(metricContext.card);
  runtimeGrid.appendChild(metricMode.card);
  runtimeGrid.appendChild(metricSession.card);
  runtimeGrid.appendChild(metricIntent.card);
  runtimeGrid.appendChild(metricStep.card);
  runtimeGrid.appendChild(metricReceipt.card);

  const pipeline = document.createElement("div");
  pipeline.style.marginTop = "8px";
  pipeline.style.fontSize = "11px";
  pipeline.style.color = "#94a3b8";
  pipeline.textContent = "Suggested next governed step ↓ Operator review ↓ WhatsApp handoff ↓ Evidence receipt";

  runtimePanel.appendChild(runtimeTitle);
  runtimePanel.appendChild(runtimeGrid);
  runtimePanel.appendChild(pipeline);

  const messages = document.createElement("div");
  messages.style.flex = "1";
  messages.style.overflowY = "auto";
  messages.style.padding = "12px";
  messages.style.background = "#020617";
  messages.style.height = "calc(100% - 214px)";

  const footer = document.createElement("footer");
  footer.style.borderTop = "1px solid rgba(255,255,255,.1)";
  footer.style.background = "#000";
  footer.style.padding = "10px";

  const statusRow = document.createElement("div");
  statusRow.style.display = "flex";
  statusRow.style.justifyContent = "space-between";
  statusRow.style.gap = "8px";
  statusRow.style.color = "#64748b";
  statusRow.style.fontSize = "11px";
  statusRow.style.textTransform = "uppercase";
  statusRow.style.marginBottom = "8px";

  const statusMode = document.createElement("span");
  const statusTrace = document.createElement("span");
  statusTrace.style.whiteSpace = "nowrap";
  statusTrace.style.overflow = "hidden";
  statusTrace.style.textOverflow = "ellipsis";

  statusRow.appendChild(statusMode);
  statusRow.appendChild(statusTrace);

  const formRow = document.createElement("div");
  formRow.style.display = "grid";
  formRow.style.gridTemplateColumns = "1fr auto";
  formRow.style.gap = "8px";

  const input = document.createElement("textarea");
  input.rows = 2;
  input.placeholder = placeholder;
  input.style.minHeight = "48px";
  input.style.maxHeight = "128px";
  input.style.resize = "none";
  input.style.border = "1px solid rgba(255,255,255,.1)";
  input.style.background = "#050505";
  input.style.color = "#fff";
  input.style.padding = "8px 10px";
  input.style.outline = "none";
  input.style.fontSize = "14px";

  const sendBtn = document.createElement("button");
  sendBtn.type = "button";
  sendBtn.textContent = "➤";
  sendBtn.style.width = "48px";
  sendBtn.style.height = "48px";
  sendBtn.style.border = "1px solid rgba(134,239,172,.4)";
  sendBtn.style.background = "rgba(6,78,59,.35)";
  sendBtn.style.color = "#d1fae5";
  sendBtn.style.cursor = "pointer";

  formRow.appendChild(input);
  formRow.appendChild(sendBtn);
  footer.appendChild(statusRow);
  footer.appendChild(formRow);

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.style.display = "flex";
  toggle.style.alignItems = "center";
  toggle.style.gap = "10px";
  toggle.style.minHeight = "52px";
  toggle.style.border = "1px solid rgba(134,239,172,.4)";
  toggle.style.background = "#0f172a";
  toggle.style.color = "#fff";
  toggle.style.padding = "10px 12px";
  toggle.style.textAlign = "left";
  toggle.style.boxShadow = "0 18px 30px rgba(0,0,0,.4)";
  toggle.style.cursor = "pointer";

  const tIcon = document.createElement("span");
  tIcon.style.display = "grid";
  tIcon.style.placeItems = "center";
  tIcon.style.width = "34px";
  tIcon.style.height = "34px";
  tIcon.style.background = brandColor;
  tIcon.style.color = "#00131f";
  tIcon.textContent = "💬";

  const tText = document.createElement("span");
  const tMain = document.createElement("span");
  tMain.style.display = "block";
  tMain.style.fontSize = "14px";
  tMain.style.fontWeight = "700";
  tMain.textContent = "Ask YAI";
  const tSub = document.createElement("span");
  tSub.style.display = "block";
  tSub.style.fontSize = "11px";
  tSub.style.color = "#94a3b8";
  tSub.textContent = "Governed Egypt access agent";
  tText.appendChild(tMain);
  tText.appendChild(tSub);
  toggle.appendChild(tIcon);
  toggle.appendChild(tText);

  function renderMessage(message) {
    const article = document.createElement("article");
    article.style.maxWidth = "92%";
    article.style.border = "1px solid rgba(255,255,255,.1)";
    article.style.padding = "10px";
    article.style.margin = message.role === "you" ? "0 0 10px auto" : "0 auto 10px 0";
    article.style.background = message.role === "you" ? "rgba(6,78,59,.35)" : "rgba(255,255,255,.04)";

    const meta = document.createElement("div");
    meta.style.display = "flex";
    meta.style.justifyContent = "space-between";
    meta.style.gap = "8px";
    meta.style.fontSize = "11px";
    meta.style.textTransform = "uppercase";
    meta.style.color = "#64748b";
    meta.style.marginBottom = "6px";

    const role = document.createElement("span");
    role.textContent = message.role === "you" ? "You" : "YAI";
    const trace = document.createElement("span");
    trace.textContent = message.traceId || "";
    trace.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
    trace.style.whiteSpace = "nowrap";
    trace.style.overflow = "hidden";
    trace.style.textOverflow = "ellipsis";

    meta.appendChild(role);
    if (message.traceId) meta.appendChild(trace);

    const body = document.createElement("p");
    body.style.margin = "0";
    body.style.whiteSpace = "pre-wrap";
    body.style.fontSize = "14px";
    body.style.lineHeight = "1.6";
    body.style.color = "#f1f5f9";
    body.textContent = message.text;

    article.appendChild(meta);
    article.appendChild(body);
    return article;
  }

  function paintModes() {
    Object.keys(modeButtons).forEach((mode) => {
      const active = mode === state.mode;
      const btn = modeButtons[mode];
      btn.style.border = active ? "1px solid rgba(134,239,172,.5)" : "1px solid rgba(255,255,255,.1)";
      btn.style.background = active ? "rgba(6,78,59,.35)" : "rgba(255,255,255,.03)";
      btn.style.color = active ? "#dcfce7" : "#cbd5e1";
    });

    const qp = quickPrompts.find((item) => item.mode === state.mode) || quickPrompts[0];
    quickBtn.textContent = qp.label;
    quickBtn.onclick = function () {
      input.value = qp.prompt;
      input.focus();
    };
  }

  function paintRuntimePanel() {
    metricContext.value.textContent = window.location.hostname || "aegyptenhautnah.com";
    metricMode.value.textContent = modeLabels[state.mode] || state.mode;
    metricSession.value.textContent = displaySessionId(state.memory.sessionId);
    metricIntent.value.textContent = (state.analysis.intents || ["General"]).join(" / ");
    metricStep.value.textContent = state.analysis.nextStep || "Qualification pending";
    metricReceipt.value.textContent = state.continuingTraceId || "Pending";
  }

  function paintStatus() {
    statusMode.textContent = `Mode: ${modeLabels[state.mode] || "Governance"}`;
    statusTrace.textContent = state.continuingTraceId
      ? `Continuing: ${state.continuingTraceId}`
      : `Runtime: ${state.runtimeSource}`;
  }

  function paintMessages() {
    messages.innerHTML = "";
    state.messages.forEach((msg) => {
      messages.appendChild(renderMessage(msg));
    });
    messages.scrollTop = messages.scrollHeight;
  }

  function resetSession() {
    state.memory = clearMemory();
    state.analysis = extractAnalysis("", state.mode);
    state.runtimeSource = "standby";
    state.continuingTraceId = "";
    state.messages = [
      {
        role: "yai",
        text: intro,
        traceId: "YAI-WEB-BOOT",
      },
      {
        role: "yai",
        text: `${contextLabel}\n\nShare objective, area, timeframe, budget range, and contact preference. Please do not share an exact address or private video files. I will route the next governed step.`,
      },
    ];
    paintStatus();
    paintRuntimePanel();
    paintMessages();
  }

  async function sendPrompt() {
    const prompt = (input.value || "").trim();
    if (!prompt || state.sending) return;

    state.sending = true;
    input.value = "";
    state.messages.push({ role: "you", text: prompt });
    state.analysis = extractAnalysis(prompt, state.mode);
    paintRuntimePanel();
    paintMessages();

    try {
      const memory = loadMemory();

      if (state.analysis.needsClarification) {
        const traceId = `YAI-CLARIFY-${Date.now().toString(36).toUpperCase()}`;
        const clarification = [
          `Detected intent: ${(state.analysis.intents || []).join(" / ")}`,
          `Area: ${state.analysis.location}`,
          `Timeframe: ${state.analysis.timeframe}`,
          `Budget: ${state.analysis.budget}`,
          "",
          state.analysis.clarificationPrompt,
          "No routing yet. I will qualify first, then suggest operator review and WhatsApp handoff.",
        ].join("\n");

        const updatedMemory = updateMemory(memory, prompt, clarification, traceId);
        saveMemory(updatedMemory);
        state.runtimeSource = "governed-clarification";
        state.continuingTraceId = traceId;
        state.memory = updatedMemory;
        state.messages.push({ role: "yai", text: clarification, traceId });
        return;
      }

      const contextualPrompt = [
        prompt,
        "",
        "=== EGYPT ACCESS GOVERNANCE CONTEXT ===",
        buildEgyptContext(),
        "",
        "=== AUTO QUALIFICATION ===",
        `Detected intents: ${(state.analysis.intents || []).join(" / ")}`,
        `Detected area: ${state.analysis.location}`,
        `Detected timeframe: ${state.analysis.timeframe}`,
        `Detected budget: ${state.analysis.budget}`,
        `Confidence: ${state.analysis.confidence}`,
        "Required flow: suggested next governed step -> operator review -> WhatsApp handoff -> evidence receipt.",
        "Guardrails: no final booking confirmation, no legal advice, no financial advice, no guaranteed ROI, no property purchase commitment.",
      ].join("\n");

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: contextualPrompt,
          mode: state.mode === "tourism" || state.mode === "property" || state.mode === "investment" ? "operator" : state.mode,
          messages: memory.messages,
          session: memoryToRequest(memory),
        }),
      });

      if (!response.ok) throw new Error(`YAI request failed (${response.status})`);

      const data = await response.json();
      const reply = (data.reply || "YAI returned no response.").trim();
      const traceId = data.traceId;

      const updatedMemory = updateMemory(memory, prompt, reply, traceId);
      saveMemory(updatedMemory);

      state.runtimeSource = data.runtimeSource || "yai-api";
      state.continuingTraceId = data.continuingTraceId || updatedMemory.lastTraceId || "";
      state.memory = updatedMemory;
      state.messages.push({ role: "yai", text: reply, traceId });
    } catch (_e) {
      const memory = loadMemory();
      const traceId = `YAI-BROWSER-${Date.now().toString(36).toUpperCase()}`;
      const reply = buildBrowserFallback(prompt, state.mode, memory);
      const updatedMemory = updateMemory(memory, prompt, reply, traceId);
      saveMemory(updatedMemory);

      state.runtimeSource = "browser-fallback";
      state.continuingTraceId = updatedMemory.lastTraceId || "";
      state.memory = updatedMemory;
      state.messages.push({ role: "yai", text: reply, traceId });
    } finally {
      state.sending = false;
      paintStatus();
      paintRuntimePanel();
      paintMessages();
    }
  }

  sendBtn.addEventListener("click", sendPrompt);
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendPrompt();
    }
  });

  toggle.addEventListener("click", function () {
    state.open = !state.open;
    panel.style.display = state.open ? "flex" : "none";
    if (state.open) {
      if (state.messages.length === 0) resetSession();
      paintMessages();
      paintStatus();
    }
  });

  closeBtn.addEventListener("click", function () {
    state.open = false;
    panel.style.display = "none";
  });

  resetBtn.addEventListener("click", resetSession);

  panel.style.display = "none";
  panel.style.flexDirection = "column";
  panel.appendChild(header);
  panel.appendChild(modeBar);
  panel.appendChild(runtimePanel);
  panel.appendChild(messages);
  panel.appendChild(footer);
  root.appendChild(panel);
  root.appendChild(toggle);
  document.body.appendChild(root);

  paintModes();
  paintStatus();
  paintRuntimePanel();
  if (state.messages.length === 1) {
    state.messages.push({
      role: "yai",
      text: `${contextLabel}\n\nShare objective, location, timeframe, budget range, and contact preference. I will route the next governed step.`,
    });
  }
  paintMessages();
})();
