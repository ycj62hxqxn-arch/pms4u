# BPB Governance Bot — MVP

تم تجهيز بداية عملية بالترتيب المطلوب.

## ما تم تنفيذه الآن

1) **Chatbot بسيط**
- Endpoint: `POST /chat`
- يرد على أسئلة PMS4U / GTCS4U / Carshunter من ملف FAQ.

2) **BPB Governance Bot (MVP)**
- Endpoint: `POST /governance/check`
- القرار: `GO / DENY / NEEDS REVIEW` حسب authority + evidence + risk.

3) **Telegram جاهز للربط**
- تم التفعيل فعليًا الآن عبر Telegram Bot API.
- تنبيهات تلقائية عند:
  - lead جديد من `/chat`
  - قرار من `/governance/check` (GO / DENY / NEEDS REVIEW)
- Endpoint إضافي يدوي: `POST /events/notify`
- Webhook endpoint: `POST /telegram/webhook` (يدعم `/status` بشكل أساسي)

## إعداد Telegram

ضع متغيرات البيئة قبل التشغيل:

```bash
export TELEGRAM_BOT_TOKEN="<YOUR_BOT_TOKEN>"
export TELEGRAM_CHAT_ID="<YOUR_CHAT_ID>"
```

بدون هذه المتغيرات، البوت يعمل عادي لكن بدون إرسال تنبيهات Telegram.

## تشغيل سريع

```bash
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8080 --reload
```

## اختبار سريع

### Chat
```bash
curl -X POST http://127.0.0.1:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"what is pms4u"}'
```

### Governance
```bash
curl -X POST http://127.0.0.1:8080/governance/check \
  -H "Content-Type: application/json" \
  -d '{"authority":true,"evidence":true,"risk":"low"}'
```

### Event notify (manual)
```bash
curl -X POST http://127.0.0.1:8080/events/notify \
  -H "Content-Type: application/json" \
  -d '{"event_type":"error","message":"payment webhook failed","meta":{"code":500}}'
```

## الخطة بعد الـ MVP

1. ✅ Telegram alerts
2. ✅ WhatsApp Business flows (lead + booking + follow-up)
3. Website widget: **Ask BPB / Ask Carshunter**
4. AI Agent layer (authority/evidence/risk pipeline)
5. Hardware layer (اختياري لاحقًا): Arduino / Raspberry Pi

## إعداد WhatsApp Business (Meta Cloud API)

ضع متغيرات البيئة:

```bash
export WHATSAPP_TOKEN="<META_CLOUD_API_TOKEN>"
export WHATSAPP_PHONE_NUMBER_ID="<PHONE_NUMBER_ID>"
export WHATSAPP_VERIFY_TOKEN="<ANY_SECRET_VERIFY_TOKEN>"
export WHATSAPP_GRAPH_VERSION="v20.0"
```

Endpoints الجديدة:
- `GET /whatsapp/webhook` (Webhook verification)
- `POST /whatsapp/webhook` (Inbound messages)
- `POST /whatsapp/send` (Outbound manual follow-up)

سلوك تلقائي:
- أي رسالة WhatsApp واردة يتم الرد عليها تلقائيًا.
- إذا الرسالة فيها booking/حجز → يرسل نموذج حجز سريع.
- يتم إرسال تنبيه Telegram عن كل رسالة WhatsApp واردة.

### اختبار إرسال WhatsApp يدوي
```bash
curl -X POST http://127.0.0.1:8080/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"to":"201001112233","message":"Hello from BPB bot"}'
```

## Ask Widget تم تركيبه فعليًا

- AegyptenHautnah: [ÄgyptenHautnah/index-4.html](ÄgyptenHautnah/index-4.html)
- Carshunter BMW Drops: [gtcs4u-landing/CARSHUNTER_BMW_BIG_DAY_DROPS_2026-06-17.html](gtcs4u-landing/CARSHUNTER_BMW_BIG_DAY_DROPS_2026-06-17.html)

الـ Widget يرسل إلى:
- `POST /leads/collect`

Fallback:
- لو API غير متاح، يتم التحويل تلقائيًا إلى WhatsApp برسالة جاهزة.

---

## أنواع حساسات الحركة والاستشعار (ملخص)
- PIR (حركة أشخاص)
- Ultrasonic (مسافة)
- IR (قرب/خط)
- Radar (حركة بدقة أعلى)
- GPS (موقع)
- Gyroscope + Accelerometer (اتجاه/تسارع)
- Camera / Depth / LiDAR (رؤية)
- Microphone (صوت)

## تكلفة تقريبية (منتصف 2026)
- PIR: 2–5$
- Ultrasonic: 2–8$
- GPS NEO-6M: 8–20$
- MPU6050: 2–10$
- Microphone module: 1–10$
- LiDAR بسيط: 50–150$
- Raspberry Pi 5: 80–150$
- Arduino Uno: 10–30$
