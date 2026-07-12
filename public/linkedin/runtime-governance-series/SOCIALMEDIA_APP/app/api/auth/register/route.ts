import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSessionToken,
  getSessionCookieName,
  hashPassword,
  readUsers,
  toPublicUser,
  writeUsers,
} from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      console.error("Register validation failed:", result.error);
      return NextResponse.json({ message: "Invalid signup payload." }, { status: 400 });
    }

    const { name, email, password } = result.data;
    const users = await readUsers();
    const exists = users.some((user) => user.email.toLowerCase() === email);

    if (exists) {
      return NextResponse.json({ message: "Email already exists." }, { status: 409 });
    }

    const user = {
      id: randomUUID(),
      name,
      email,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    await writeUsers(users);

    const publicUser = toPublicUser(user);
    const token = await createSessionToken(user as any);

    const response = NextResponse.json({ user: publicUser, message: "Signup successful." }, { status: 201 });
    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("Register exception:", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
