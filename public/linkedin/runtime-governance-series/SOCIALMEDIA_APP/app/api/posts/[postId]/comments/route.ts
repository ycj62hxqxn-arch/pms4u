import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";
import { readPosts, writePosts } from "@/lib/feed";

const commentSchema = z.object({
  text: z.string().trim().min(1).max(280),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ postId: string }> },
) {
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
  const result = commentSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ message: "Invalid comment payload." }, { status: 400 });
  }

  const { postId } = await context.params;
  const posts = await readPosts();
  const target = posts.find((post) => post.id === postId);

  if (!target) {
    return NextResponse.json({ message: "Post not found." }, { status: 404 });
  }

  const comment = {
    id: randomUUID(),
    authorId: session.userId,
    authorName: session.name,
    authorEmail: session.email,
    text: result.data.text,
    createdAt: new Date().toISOString(),
  };

  target.comments = [...target.comments, comment];
  await writePosts(posts);

  return NextResponse.json({ comment, commentsCount: target.comments.length }, { status: 201 });
}
