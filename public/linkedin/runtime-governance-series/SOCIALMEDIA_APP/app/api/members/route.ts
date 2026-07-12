import { NextResponse } from "next/server";
import { readUsers, toPublicUser } from "@/lib/auth";

export async function GET() {
  try {
    const users = await readUsers();
    const members = users.map(toPublicUser);
    return NextResponse.json({ members, total: members.length });
  } catch (err) {
    console.error("Members list error:", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
