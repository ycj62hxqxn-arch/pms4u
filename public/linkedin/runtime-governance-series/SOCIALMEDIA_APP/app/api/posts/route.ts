import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";
import { readPosts, writePosts } from "@/lib/feed";

const createPostSchema = z.object({
  text: z.string().trim().min(1).max(500),
  mediaUrl: z.string().max(8_000_000).optional(),
  mediaType: z.enum(["image", "video"]).optional(),
});

export async function GET() {
  const posts = await readPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  let session: { userId: string; name: string; email: string };
  try {
    const parsed = await verifySessionToken(token);
    session = { userId: parsed.userId, name: parsed.name, email: parsed.email };
  } catch {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = createPostSchema.safeParse(body);
  if (!result.success) {
    console.error("Post validation failed:", result.error);
    return NextResponse.json({ message: "Invalid post payload." }, { status: 400 });
  }

  const posts = await readPosts();
  const post = {
    id: randomUUID(),
    authorId: session.userId,
    authorName: session.name,
    authorEmail: session.email,
    text: result.data.text,
    createdAt: new Date().toISOString(),
    likes: [] as string[],
    comments: [] as Array<{
      id: string;
      authorName: string;
      authorEmail: string;
      text: string;
      createdAt: string;
    }>,
    mediaUrl: result.data.mediaUrl,
    mediaType: result.data.mediaType,
  };

  posts.unshift(post);
  await writePosts(posts).catch((err) => {
    console.error("Failed to write posts:", err);
    throw err;
  });

  return NextResponse.json({ post, message: "Post created." }, { status: 201 });
}
