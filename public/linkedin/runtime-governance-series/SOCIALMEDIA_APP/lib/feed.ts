import { store } from "./store";

function getErrorCode(error: unknown): unknown {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    return (error as { code?: unknown }).code;
  }

  return undefined;
}

export type PostComment = {
  id: string;
  authorId?: string;
  authorName: string;
  authorEmail: string;
  text: string;
  createdAt: string;
};

export type PostRecord = {
  id: string;
  authorId?: string;
  authorName: string;
  authorEmail: string;
  text: string;
  createdAt: string;
  likes: string[];
  comments: PostComment[];
  mediaUrl?: string;
  mediaType?: "image" | "video";
};

export async function readPosts(): Promise<PostRecord[]> {
  try {
    const posts = store.readPosts() as PostRecord[];
    return posts.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error("[FEED] readPosts failed:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}

export async function writePosts(posts: PostRecord[]) {
  try {
    store.writePosts(posts);
  } catch (error) {
    console.error("[FEED] writePosts failed:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      code: getErrorCode(error),
    });
    throw error;
  }
}
