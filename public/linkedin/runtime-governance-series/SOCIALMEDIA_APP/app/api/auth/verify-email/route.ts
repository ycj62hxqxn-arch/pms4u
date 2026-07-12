import { NextResponse } from "next/server";
import { createSessionToken, getSessionCookieName, readUsers, writeUsers } from "@/lib/auth";

function getRedirectBase() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${getRedirectBase()}/login?verified=0&reason=missing_token`);
  }

  const users = await readUsers();
  const user = users.find((u) => u.verificationToken === token);

  if (!user) {
    return NextResponse.redirect(`${getRedirectBase()}/login?verified=0&reason=invalid_token`);
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  await writeUsers(users);

  const sessionToken = await createSessionToken(user);
  const response = NextResponse.redirect(`${getRedirectBase()}/feed?verified=1`);
  response.cookies.set(getSessionCookieName(), sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
