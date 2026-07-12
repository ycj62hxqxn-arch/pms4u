import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionCookieName, verifySessionToken, readUsers, writeUsers, toPublicUser } from "@/lib/auth";

const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
  avatar: z.string().optional(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  const key = decodeURIComponent(userId).toLowerCase();
  const users = await readUsers();
  const user = users.find((u) => u.id === userId || u.email.toLowerCase() === key);

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ profile: toPublicUser(user) });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  let session: { userId: string };
  try {
    const parsed = await verifySessionToken(token);
    session = { userId: parsed.userId };
  } catch {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { userId } = await context.params;
  if (session.userId !== userId) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const result = updateProfileSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ message: "Invalid profile payload." }, { status: 400 });
  }

  const users = await readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  if (result.data.bio !== undefined) user.bio = result.data.bio;
  if (result.data.location !== undefined) user.location = result.data.location;
  if (result.data.website !== undefined) user.website = result.data.website || undefined;
  if (result.data.avatar !== undefined) user.avatar = result.data.avatar;

  await writeUsers(users);

  return NextResponse.json({ profile: toPublicUser(user), message: "Profile updated." });
}
