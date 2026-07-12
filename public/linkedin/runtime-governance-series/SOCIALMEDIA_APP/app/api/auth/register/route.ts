import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  hashPassword,
  readUsers,
  toPublicUser,
  writeUsers,
} from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
  acceptTerms: z.literal(true),
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
      emailVerified: false,
      verificationToken: randomUUID(),
      termsAcceptedAt: new Date().toISOString(),
    };

    users.push(user);
    await writeUsers(users);
    const mailResult = await sendVerificationEmail({
      to: user.email,
      name: user.name,
      token: user.verificationToken,
    });

    const publicUser = toPublicUser(user);
    return NextResponse.json(
      {
        user: publicUser,
        message: "Signup successful. Please verify your email to activate your member profile.",
        verificationLink: mailResult.fallback ? mailResult.verifyUrl : undefined,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Register exception:", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
