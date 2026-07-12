import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";
import { readPosts, writePosts } from "@/lib/feed";

export async function POST(
  _request: Request,
  context: { params: Promise<{ postId: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  let email = "";
  try {
    const session = await verifySessionToken(token);
    email = session.email;
  } catch {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { postId } = await context.params;
  const posts = await readPosts();
  const target = posts.find((post) => post.id === postId);

  if (!target) {
    return NextResponse.json({ message: "Post not found." }, { status: 404 });
  }

  const alreadyLiked = target.likes.includes(email);
  target.likes = alreadyLiked
    ? target.likes.filter((value) => value !== email)
    : [...target.likes, email];

  await writePosts(posts);

  return NextResponse.json({
    postId: target.id,
    likesCount: target.likes.length,
    liked: !alreadyLiked,
  });
}
