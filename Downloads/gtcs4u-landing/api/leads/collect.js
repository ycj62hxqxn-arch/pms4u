export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body || {};

  console.log("LEAD_RECEIVED", {
    source: body.source || "unknown",
    name: body.name || "",
    contact: body.contact || "",
    service: body.service || "",
    intent: body.intent || "",
    ts: new Date().toISOString(),
  });

  return res.status(200).json({
    ok: true,
    status: "received",
    next: "whatsapp_fallback_available",
  });
}
