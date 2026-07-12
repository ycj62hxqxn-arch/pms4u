import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FeedClient from "./feed-client";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";

export default async function FeedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) redirect("/login");

  let session: { userId: string; name: string; email: string } | null = null;
  try {
    const verified = await verifySessionToken(token);
    session = { userId: verified.userId, name: verified.name, email: verified.email };
  } catch {
    redirect("/login");
  }

  return (
    <FeedClient
      currentUserId={session.userId}
      currentUserEmail={session.email}
      currentUserName={session.name}
    />
  );
}
