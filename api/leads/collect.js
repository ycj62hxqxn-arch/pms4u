export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body || {};

  console.log("LEAD_RECEIVED", {
    source: body.source || "unknown",
    name: body.name || "",
    contact: body.contact || "",
    intent: body.intent || "",
    ts: new Date().toISOString()
  });

  return res.status(200).json({
    ok: true,
    status: "received",
    next: "whatsapp_fallback_available"
  });
}
