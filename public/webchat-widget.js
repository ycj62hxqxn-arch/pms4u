(function () {
  const cfg = window.PMS4U_WEBCHAT_CONFIG || {};
  const apiUrl = cfg.apiUrl || "https://www.gtcs4u.com/api/agent/inbound/webchat";
  const title = cfg.title || "Egypt Booking Assistant";
  const placeholder = cfg.placeholder || "Type your question...";
  const brandColor = cfg.brandColor || "#34d399";
  const intro =
    cfg.intro ||
    "Hi. I can support tourism, real-estate, and investment-intent requests for Egypt. What do you need?";

  const sessionId = `sess_${Math.random().toString(36).slice(2, 10)}`;

  const root = document.createElement("div");
  root.style.position = "fixed";
  root.style.right = "16px";
  root.style.bottom = "16px";
  root.style.zIndex = "99999";
  root.style.fontFamily = "Inter, Arial, sans-serif";

  const panel = document.createElement("div");
  panel.style.display = "none";
  panel.style.width = "420px";
  panel.style.maxWidth = "92vw";
  panel.style.height = "min(640px, calc(100vh - 7rem))";
  panel.style.background = "#080b0f";
  panel.style.border = "1px solid rgba(255,255,255,.15)";
  panel.style.borderRadius = "0";
  panel.style.overflow = "hidden";
  panel.style.boxShadow = "0 24px 48px rgba(0,0,0,.5)";
  panel.style.marginBottom = "10px";

  const header = document.createElement("div");
  header.style.padding = "12px 14px";
  header.style.background = "#0f172a";
  header.style.color = "#e2e8f0";
  header.style.fontWeight = "700";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  const headerTitleWrap = document.createElement("div");
  const headerTitle = document.createElement("div");
  headerTitle.textContent = title;
  headerTitle.style.fontSize = "14px";
  headerTitle.style.fontWeight = "700";
  const headerSub = document.createElement("div");
  headerSub.textContent = "Pre-contract request qualification";
  headerSub.style.fontSize = "11px";
  headerSub.style.color = "#94a3b8";
  headerTitleWrap.appendChild(headerTitle);
  headerTitleWrap.appendChild(headerSub);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.textContent = "✕";
  closeBtn.style.border = "1px solid rgba(255,255,255,.15)";
  closeBtn.style.background = "transparent";
  closeBtn.style.color = "#cbd5e1";
  closeBtn.style.width = "30px";
  closeBtn.style.height = "30px";
  closeBtn.style.cursor = "pointer";

  header.appendChild(headerTitleWrap);
  header.appendChild(closeBtn);

  const messages = document.createElement("div");
  messages.style.height = "calc(100% - 118px)";
  messages.style.overflowY = "auto";
  messages.style.padding = "12px";
  messages.style.background = "#020617";

  const inputWrap = document.createElement("div");
  inputWrap.style.display = "flex";
  inputWrap.style.gap = "8px";
  inputWrap.style.padding = "10px";
  inputWrap.style.borderTop = "1px solid rgba(255,255,255,.1)";
  inputWrap.style.background = "#000";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = placeholder;
  input.style.flex = "1";
  input.style.borderRadius = "0";
  input.style.border = "1px solid rgba(255,255,255,.2)";
  input.style.background = "#050505";
  input.style.color = "#fff";
  input.style.padding = "10px";
  input.style.fontSize = "14px";

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";
  sendBtn.style.border = "none";
  sendBtn.style.background = "rgba(16,185,129,.25)";
  sendBtn.style.border = "1px solid rgba(52,211,153,.4)";
  sendBtn.style.color = "#d1fae5";
  sendBtn.style.fontWeight = "700";
  sendBtn.style.padding = "0 14px";
  sendBtn.style.borderRadius = "0";
  sendBtn.style.cursor = "pointer";

  const toggle = document.createElement("button");
  toggle.style.display = "flex";
  toggle.style.alignItems = "center";
  toggle.style.gap = "10px";
  toggle.style.marginTop = "10px";
  toggle.style.border = "1px solid rgba(52,211,153,.4)";
  toggle.style.background = "#0f172a";
  toggle.style.color = "#fff";
  toggle.style.fontWeight = "700";
  toggle.style.padding = "10px 12px";
  toggle.style.borderRadius = "0";
  toggle.style.cursor = "pointer";
  toggle.style.boxShadow = "0 10px 20px rgba(0,0,0,.35)";

  const toggleIcon = document.createElement("span");
  toggleIcon.textContent = "💬";
  toggleIcon.style.display = "grid";
  toggleIcon.style.placeItems = "center";
  toggleIcon.style.width = "34px";
  toggleIcon.style.height = "34px";
  toggleIcon.style.background = brandColor;
  toggleIcon.style.color = "#00131f";

  const toggleTextWrap = document.createElement("span");
  const toggleMain = document.createElement("span");
  toggleMain.textContent = "Ask Assistant";
  toggleMain.style.display = "block";
  toggleMain.style.fontSize = "14px";
  const toggleSub = document.createElement("span");
  toggleSub.textContent = "Egypt Booking Assistant";
  toggleSub.style.display = "block";
  toggleSub.style.fontSize = "11px";
  toggleSub.style.color = "#94a3b8";
  toggleTextWrap.appendChild(toggleMain);
  toggleTextWrap.appendChild(toggleSub);
  toggle.appendChild(toggleIcon);
  toggle.appendChild(toggleTextWrap);

  function addMessage(text, mine) {
    const bubble = document.createElement("div");
    bubble.textContent = text;
    bubble.style.maxWidth = "88%";
    bubble.style.margin = mine ? "0 0 10px auto" : "0 auto 10px 0";
    bubble.style.padding = "10px 12px";
    bubble.style.borderRadius = "0";
    bubble.style.fontSize = "13px";
    bubble.style.lineHeight = "1.5";
    bubble.style.whiteSpace = "pre-wrap";
    bubble.style.background = mine ? "rgba(16,185,129,.2)" : "#172036";
    bubble.style.color = mine ? "#d1fae5" : "#e2e8f0";
    bubble.style.border = mine ? "1px solid rgba(52,211,153,.25)" : "1px solid rgba(255,255,255,.1)";
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
    const text = (input.value || "").trim();
    if (!text) return;
    input.value = "";
    addMessage(text, true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          sourceHost: window.location.host,
          channel: "webchat-widget",
        }),
      });

      const data = await res.json().catch(function () { return {}; });
      if (!res.ok) throw new Error("api_error");
      const responseText = [
        data.reply || "Request received.",
        data.nextStep ? `\n${data.nextStep}` : "",
        "\nCompliance: pre-contract request qualification only. No final booking, legal advice, financial advice, or guaranteed ROI.",
      ]
        .filter(Boolean)
        .join("\n");
      addMessage(responseText, false);
    } catch (e) {
      addMessage("Temporary issue. Please continue on WhatsApp for direct support.", false);
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  toggle.addEventListener("click", function () {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    if (panel.style.display === "block") {
      messages.innerHTML = "";
      addMessage(intro, false);
      addMessage(
        "Please share: objective, location (Hurghada / El Gouna / Makadi / Sahl Hasheesh), timeframe, budget range, and contact preference. I will suggest the next governed step and WhatsApp handoff.",
        false
      );
    }
  });

  closeBtn.addEventListener("click", function () {
    panel.style.display = "none";
  });

  inputWrap.appendChild(input);
  inputWrap.appendChild(sendBtn);
  panel.appendChild(header);
  panel.appendChild(messages);
  panel.appendChild(inputWrap);
  root.appendChild(panel);
  root.appendChild(toggle);
  document.body.appendChild(root);
})();
