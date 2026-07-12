"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Comment = {
  id: string;
  authorName: string;
  authorEmail: string;
  text: string;
  createdAt: string;
};

type Post = {
  id: string;
  authorName: string;
  authorEmail: string;
  text: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
  mediaUrl?: string;
  mediaType?: "image" | "video";
};

type Props = {
  currentUserEmail: string;
};

export default function FeedClient({ currentUserEmail }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerText, setComposerText] = useState("");
  const [error, setError] = useState("");
  const [commentTextByPost, setCommentTextByPost] = useState<Record<string, string>>({});
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  async function loadPosts() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/posts", { cache: "no-store" });
      const json = (await res.json()) as { posts?: Post[] };
      setPosts(Array.isArray(json.posts) ? json.posts : []);
    } catch {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  const canSubmitPost = useMemo(() => composerText.trim().length > 0, [composerText]);

  async function createPost() {
    if (!canSubmitPost && !mediaFile) return;
    setError("");

    let mediaUrl: string | undefined;
    let mediaType: "image" | "video" | undefined;

    if (mediaFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        mediaUrl = e.target?.result as string;
        mediaType = mediaFile.type.startsWith("image") ? "image" : "video";

        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: composerText.trim(), mediaUrl, mediaType }),
        });

        if (!res.ok) {
          const errData = (await res.json().catch(() => ({}))) as { message?: string };
          setError(errData.message || "Could not create post.");
          console.error("Post creation failed:", res.status, errData);
          return;
        }

        setComposerText("");
        setMediaFile(null);
        setMediaPreview(null);
        await loadPosts();
      };
      reader.readAsDataURL(mediaFile);
    } else {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: composerText.trim() }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { message?: string };
        setError(errData.message || "Could not create post.");
        console.error("Post creation failed:", res.status, errData);
        return;
      }

      setComposerText("");
      await loadPosts();
    }
  }

  async function toggleLike(postId: string) {
    setError("");
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (!res.ok) {
      setError("Could not update like.");
      return;
    }
    await loadPosts();
  }

  async function addComment(postId: string) {
    const text = (commentTextByPost[postId] ?? "").trim();
    if (!text) return;

    setError("");
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      setError("Could not add comment.");
      return;
    }

    setCommentTextByPost((prev) => ({ ...prev, [postId]: "" }));
    await loadPosts();
  }

  return (
    <section className="mt-6 grid gap-4">
      <article className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-5">
        <p className="text-sm font-semibold text-cyan-200">Create Post</p>
        <textarea
          value={composerText}
          onChange={(e) => setComposerText(e.target.value)}
          placeholder="Share a mission update with your agent network..."
          className="mt-3 w-full rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-slate-400 focus:ring"
          rows={4}
          maxLength={500}
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-300">{composerText.length}/500</p>
          <button
            type="button"
            onClick={createPost}
            disabled={!canSubmitPost && !mediaFile}
            className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Publish
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setMediaFile(file);
                const reader = new FileReader();
                reader.onload = (evt) => {
                  const url = evt.target?.result as string;
                  const type = file.type.startsWith("image") ? ("image" as const) : ("video" as const);
                  setMediaPreview({ url, type });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="text-xs text-slate-400"
          />
          {mediaPreview && (
            <button
              type="button"
              onClick={() => {
                setMediaFile(null);
                setMediaPreview(null);
              }}
              className="text-xs text-rose-300 hover:underline"
            >
              Clear media
            </button>
          )}
        </div>

        {mediaPreview && (
          <div className="mt-3 relative">
            {mediaPreview.type === "image" ? (
              <img src={mediaPreview.url} alt="Preview" className="max-h-48 rounded-xl" />
            ) : (
              <video src={mediaPreview.url} controls className="max-h-48 rounded-xl" />
            )}
          </div>
        )}
      </article>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      {loading ? <p className="text-sm text-slate-300">Loading posts...</p> : null}

      {!loading && posts.length === 0 ? (
        <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-300">
          No posts yet. Be the first one.
        </article>
      ) : null}

      {posts.map((post) => {
        const liked = post.likes.includes(currentUserEmail);

        return (
          <article key={post.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <Link href={`/profile/${post.authorEmail}`} className="text-sm font-semibold text-cyan-200 hover:underline">
              {post.authorName}
            </Link>
            <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleString()}</p>
            <p className="mt-2 text-slate-100">{post.text}</p>

            {post.mediaUrl && post.mediaType === "image" && (
              <img
                src={post.mediaUrl}
                alt="Post media"
                className="mt-3 max-h-96 w-full rounded-xl object-cover"
              />
            )}
            {post.mediaUrl && post.mediaType === "video" && (
              <video
                src={post.mediaUrl}
                controls
                className="mt-3 max-h-96 w-full rounded-xl"
              />
            )}

            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold hover:border-white"
              >
                {liked ? "Unlike" : "Like"} ({post.likes.length})
              </button>
              <span className="text-xs text-slate-400">Comments: {post.comments.length}</span>
            </div>

            <div className="mt-3 space-y-2">
              {post.comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                  <Link href={`/profile/${comment.authorEmail}`} className="text-xs font-semibold text-cyan-200 hover:underline">
                    {comment.authorName}
                  </Link>
                  <p className="text-xs text-slate-200">{comment.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={commentTextByPost[post.id] ?? ""}
                onChange={(e) =>
                  setCommentTextByPost((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
                placeholder="Write a comment..."
                className="w-full rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-cyan-300/40 placeholder:text-slate-400 focus:ring"
                maxLength={280}
              />
              <button
                type="button"
                onClick={() => addComment(post.id)}
                className="rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:border-cyan-200"
              >
                Comment
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
