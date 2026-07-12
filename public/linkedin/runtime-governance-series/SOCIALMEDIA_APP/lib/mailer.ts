type VerificationPayload = {
  to: string;
  name: string;
  token: string;
};

function getAppUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function sendVerificationEmail(payload: VerificationPayload) {
  const verifyUrl = `${getAppUrl()}/api/auth/verify-email?token=${encodeURIComponent(payload.token)}`;

  // Minimal and reliable default path for serverless: log link if SMTP is not configured.
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM;
  const hasPlaceholderCreds = [smtpUser, smtpPass, smtpFrom]
    .filter(Boolean)
    .some((value) => String(value).includes("replace-with-real"));

  if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom || hasPlaceholderCreds) {
    console.info("[MAIL] Verification link (SMTP not configured):", {
      to: payload.to,
      verifyUrl,
    });
    return { delivered: false, fallback: true, verifyUrl };
  }

  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transport.sendMail({
      from: smtpFrom,
      to: payload.to,
      subject: "PulseNet: Confirm your email",
      text: `Hi ${payload.name},\n\nPlease confirm your email and activate your member account:\n${verifyUrl}\n\nBy continuing, you agree to the platform regulations accepted during signup.\n\nPulseNet Team`,
      html: `<p>Hi ${payload.name},</p><p>Please confirm your email and activate your member account:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>By continuing, you agree to the platform regulations accepted during signup.</p><p>PulseNet Team</p>`,
    });

    return { delivered: true, fallback: false, verifyUrl };
  } catch (error) {
    console.error("[MAIL] Delivery failed, using fallback verification link:", {
      to: payload.to,
      message: error instanceof Error ? error.message : String(error),
      verifyUrl,
    });
    return { delivered: false, fallback: true, verifyUrl };
  }
}
