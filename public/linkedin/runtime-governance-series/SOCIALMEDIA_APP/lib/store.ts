import type { UserRecord } from "./auth";
import type { PostRecord } from "./feed";

/**
 * In-memory user store for development and Vercel ephemeral environment.
 * For persistent production, migrate to Vercel Postgres, Neon, Supabase, or PostgreSQL.
 * 
 * WARNING: This store is ephemeral. Data is lost when the Lambda function is removed.
 * Each new deployment resets the store unless env is properly configured with a real database.
 */

const userStore = new Map<string, UserRecord>();
const postStore = new Map<string, PostRecord>();

// Seed initial data
const seedUsers: UserRecord[] = [
  {
    id: "e93c1547-816a-442a-a002-2ef674ef2968",
    name: "QA User",
    email: "qa+1783816206@example.com",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T00:30:07.483Z",
    bio: "QA Tester",
    role: "qa",
  },
  {
    id: "5d96f731-9653-48ec-9a0d-1b93f4ce6001",
    name: "Alex Rivera",
    email: "agent01@pulsenet.ai",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T02:00:00.000Z",
    role: "agent",
  },
  {
    id: "6d96f731-9653-48ec-9a0d-1b93f4ce6002",
    name: "Jordan Hayes",
    email: "agent02@pulsenet.ai",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T02:00:00.000Z",
    role: "agent",
  },
  {
    id: "7d96f731-9653-48ec-9a0d-1b93f4ce6003",
    name: "Casey Morgan",
    email: "agent03@pulsenet.ai",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T02:00:00.000Z",
    role: "agent",
  },
  {
    id: "8d96f731-9653-48ec-9a0d-1b93f4ce6004",
    name: "Taylor Chen",
    email: "agent04@pulsenet.ai",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T02:00:00.000Z",
    role: "agent",
  },
  {
    id: "9d96f731-9653-48ec-9a0d-1b93f4ce6005",
    name: "Morgan Lee",
    email: "agent05@pulsenet.ai",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T02:00:00.000Z",
    role: "agent",
  },
  {
    id: "ad96f731-9653-48ec-9a0d-1b93f4ce6006",
    name: "Jordan Patel",
    email: "agent06@pulsenet.ai",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T02:00:00.000Z",
    role: "agent",
  },
  {
    id: "bd96f731-9653-48ec-9a0d-1b93f4ce6007",
    name: "Sam Rodriguez",
    email: "agent07@pulsenet.ai",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T02:00:00.000Z",
    role: "agent",
  },
  {
    id: "cd96f731-9653-48ec-9a0d-1b93f4ce6008",
    name: "Riley Thompson",
    email: "agent08@pulsenet.ai",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T02:00:00.000Z",
    role: "agent",
  },
  {
    id: "dd96f731-9653-48ec-9a0d-1b93f4ce6009",
    name: "Avery Kim",
    email: "agent09@pulsenet.ai",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T02:00:00.000Z",
    role: "agent",
  },
  {
    id: "ed96f731-9653-48ec-9a0d-1b93f4ce600a",
    name: "Quinn Davis",
    email: "agent10@pulsenet.ai",
    passwordHash: "$2b$10$lz63w.b5Hc5BpNkmzqbbq.axNEJCjxpNTRkwxcUnRfoud0I/76px6",
    createdAt: "2026-07-12T02:00:00.000Z",
    role: "agent",
  },
];

// Initialize store with seed data
function initializeStore() {
  if (userStore.size === 0) {
    seedUsers.forEach((user) => {
      userStore.set(user.id, user);
    });
  }
}

initializeStore();

// Export store object for centralized access
export const store = {
  readUsers: () => Array.from(userStore.values()),
  writeUsers: (users: UserRecord[]) => {
    userStore.clear();
    users.forEach((u) => userStore.set(u.id, u));
  },
  readPosts: () => Array.from(postStore.values()),
  writePosts: (posts: PostRecord[]) => {
    postStore.clear();
    posts.forEach((p) => postStore.set(p.id, p));
  },
  getUserByEmail: (email: string) =>
    Array.from(userStore.values()).find((u) => u.email === email),
  getUserById: (id: string) => userStore.get(id),
  createUser: (user: UserRecord) => {
    userStore.set(user.id, user);
    return user;
  },
  updateUser: (id: string, updates: Partial<UserRecord>) => {
    const user = userStore.get(id);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...updates };
    userStore.set(id, updated);
    return updated;
  },
};
