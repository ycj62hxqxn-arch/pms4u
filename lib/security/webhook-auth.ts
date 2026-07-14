import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

type SharedSecretAuthOptions = {
  envVarName?: string;
  headerName?: string;
};

type SharedSecretAuthResult =
  | { ok: true }
  | { ok: false; response: NextResponse };

const DEFAULT_ENV_VAR = "PMS_INBOUND_SHARED_SECRET";
const DEFAULT_HEADER = "x-pms-inbound-secret";

function equalSecrets(expected: string, received: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  try {
    return timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch {
    return false;
  }
}

export function requireSharedSecretAuth(
  request: Request,
  options?: SharedSecretAuthOptions
): SharedSecretAuthResult {
  const envVarName = options?.envVarName ?? DEFAULT_ENV_VAR;
  const headerName = (options?.headerName ?? DEFAULT_HEADER).toLowerCase();
  const configuredSecret = process.env[envVarName]?.trim();

  if (!configuredSecret) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          message: `${envVarName} is not configured.`,
          code: "AUTH_SECRET_UNAVAILABLE",
        },
        { status: 503 }
      ),
    };
  }

  const providedSecret = request.headers.get(headerName)?.trim() ?? "";
  if (!providedSecret || !equalSecrets(configuredSecret, providedSecret)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          message: "Unauthorized.",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      ),
    };
  }

  return { ok: true };
}