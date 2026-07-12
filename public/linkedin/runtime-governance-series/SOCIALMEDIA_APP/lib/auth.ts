import { store } from "./store";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  emailVerified?: boolean;
  verificationToken?: string;
  termsAcceptedAt?: string;
  bio?: string;
  location?: string;
  role?: string;
  pmsMemberId?: string;
  pmsWorkspace?: string;
  connectedTo?: string[];
  avatar?: string;
  website?: string;
  followers?: string[];
  following?: string[];
};

type PublicUser = Pick<
  UserRecord,
  "id" | "name" | "createdAt" | "bio" | "location" | "avatar" | "website" | "followers" | "following"
>;

const SESSION_COOKIE = "pulsenet_session";

function getJwtSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "pulsenet-dev-secret-change-in-prod";
  return new TextEncoder().encode(secret);
}

export async function readUsers(): Promise<UserRecord[]> {
  try {
    return store.readUsers() as UserRecord[];
  } catch (error) {
    console.error("[AUTH] readUsers failed:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}

export async function writeUsers(users: UserRecord[]) {
  try {
    store.writeUsers(users as any);
  } catch (error) {
    console.error("[AUTH] writeUsers failed:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      code: error instanceof Error && "code" in error ? (error as any).code : undefined,
    });
    throw error;
  }
}

export function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt,
    bio: user.bio,
    location: user.location,
    avatar: user.avatar,
    website: user.website,
    followers: user.followers,
    following: user.following,
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSessionToken(user: UserRecord) {
  return new SignJWT({ sub: user.id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return {
    userId: String(payload.sub ?? ""),
    email: String(payload.email ?? ""),
    name: String(payload.name ?? ""),
  };
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}
