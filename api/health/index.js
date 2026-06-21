export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "BPB Lead Bot API",
    ts: new Date().toISOString()
  });
}
