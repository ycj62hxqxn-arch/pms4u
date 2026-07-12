import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  getSessionCookieName,
  readUsers,
  toPublicUser,
  verifyPassword,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ message: "Invalid login payload." }, { status: 400 });
  }

  const { email, password } = result.data;
  const users = await readUsers();
  const user = users.find((row) => row.email.toLowerCase() === email);

  if (!user) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
  }

  const publicUser = toPublicUser(user);
  const token = await createSessionToken(user);

  const response = NextResponse.json({ user: publicUser, message: "Login successful." });
  response.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
