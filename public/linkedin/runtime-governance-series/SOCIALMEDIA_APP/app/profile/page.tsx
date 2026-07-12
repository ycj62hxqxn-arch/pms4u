import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";

export default async function MyProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const session = await verifySessionToken(token);
    redirect(`/profile/${session.userId}`);
  } catch {
    redirect("/login");
  }
}
