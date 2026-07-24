"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Comment = {
  id: string;
  authorId?: string;
  authorName: string;
  authorEmail?: string;
  text: string;
  createdAt: string;
};

type Post = {
  id: string;
  authorId?: string;
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
  currentUserId: string;
  currentUserEmail: string;
  currentUserName: string;
};

const AVATAR_COLORS = [
  "from-violet-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-cyan-500 to-blue-500",
];

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const sz = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-14 w-14 text-lg" : "h-10 w-10 text-sm";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white shrink-0`}>
      {initials}
    </div>
  );
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export default function FeedClient({ currentUserId, currentUserEmail, currentUserName }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerText, setComposerText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadPosts() {
    setLoading(true);
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
    const controller = new AbortController();

    fetch("/api/posts", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load posts: ${response.status}`);
        }

        return (await response.json()) as { posts?: Post[] };
      })
      .then((json) => {
        setPosts(Array.isArray(json.posts) ? json.posts : []);
      })
      .catch((loadError: unknown) => {
        if (
          loadError instanceof DOMException &&
          loadError.name === "AbortError"
        ) {
          return;
        }

        setError("Failed to load posts.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const canPost = useMemo(() => composerText.trim().length > 0 || mediaFile !== null, [composerText, mediaFile]);

  async function createPost() {
    if (!canPost || posting) return;
    setPosting(true);
    setError("");
    let mediaUrl: string | undefined;
    let mediaType: "image" | "video" | undefined;
    if (mediaFile) {
      mediaUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(mediaFile);
      });
      mediaType = mediaFile.type.startsWith("image") ? "image" : "video";
    }
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: composerText.trim(), mediaUrl, mediaType }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { message?: string };
        setError(d.message || "Could not post.");
        setPosting(false);
        return;
      }
      setComposerText("");
      setMediaFile(null);
      setMediaPreview(null);
      setPosting(false);
      await loadPosts();
    } catch {
      setError("Network error while posting.");
      setPosting(false);
    }
  }

  async function toggleLike(postId: string) {
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    if (!res.ok) {
      setError("Could not update like.");
      return;
    }
    await loadPosts();
  }

  async function addComment(postId: string) {
    const text = (commentText[postId] ?? "").trim();
    if (!text) return;
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      setError("Could not add comment.");
      return;
    }
    setCommentText((p) => ({ ...p, [postId]: "" }));
    await loadPosts();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-[#0f0f11]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0f0f11]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Pulse<span className="text-violet-400">Net</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/members" className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/[0.07] hover:text-white transition-colors">
              Explore
            </Link>
            <Link href={`/profile/${currentUserId}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/[0.07] hover:text-white transition-colors">
              <Avatar name={currentUserName} size="sm" />
              <span className="hidden sm:block font-medium">{currentUserName}</span>
            </Link>
            <button
              onClick={logout}
              className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-white/[0.07] hover:text-zinc-300 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-1">
            <Link
              href={`/profile/${currentUserId}`}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/[0.05] transition-colors group"
            >
              <Avatar name={currentUserName} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{currentUserName}</p>
                <p className="text-xs text-zinc-500 group-hover:text-violet-400 transition-colors">View profile</p>
              </div>
            </Link>
            <div className="my-2 border-t border-white/[0.07]" />
            {[
              { icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>, label: "Home", href: "/feed" },
              { icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>, label: "Members", href: "/members" },
              { icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>, label: "My Profile", href: `/profile/${currentUserId}` },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/[0.05] hover:text-white transition-colors">
                {item.icon}
                {item.label}
              </Link>
            ))}
          </aside>

          {/* Feed column */}
          <div className="min-w-0 space-y-4">
            {/* Composer */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#16161a] p-4">
              <div className="flex gap-3">
                <Avatar name={currentUserName} />
                <textarea
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder={`What's on your mind, ${currentUserName.split(" ")[0]}?`}
                  rows={3}
                  maxLength={500}
                  className="flex-1 resize-none rounded-xl border border-white/[0.07] bg-[#0f0f11] px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition"
                />
              </div>

              {mediaPreview && (
                <div className="relative mt-3 ml-13">
                  {mediaPreview.type === "image"
                    ? <img src={mediaPreview.url} alt="Preview" className="max-h-64 w-full rounded-xl object-cover border border-white/[0.07]" />
                    : <video src={mediaPreview.url} controls className="max-h-64 w-full rounded-xl border border-white/[0.07]" />}
                  <button
                    onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-xs text-white hover:bg-black transition-colors"
                  >✕</button>
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-1">
                  <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setMediaFile(file);
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const url = evt.target?.result as string;
                        setMediaPreview({ url, type: file.type.startsWith("image") ? "image" : "video" });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-white/[0.07] hover:text-white transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    Photo / Video
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-700">{composerText.length}/500</span>
                  <button
                    onClick={createPost}
                    disabled={!canPost || posting}
                    className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {posting ? "Posting…" : "Post"}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
            )}

            {/* Loading skeletons */}
            {loading && [1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-white/[0.07] bg-[#16161a] p-5 animate-pulse">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/[0.07] shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 w-28 rounded bg-white/[0.07]" />
                    <div className="h-3 w-16 rounded bg-white/[0.05]" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 rounded bg-white/[0.05]" />
                  <div className="h-3 w-4/5 rounded bg-white/[0.05]" />
                </div>
              </div>
            ))}

            {!loading && posts.length === 0 && (
              <div className="rounded-2xl border border-white/[0.07] bg-[#16161a] p-12 text-center">
                <p className="text-2xl">✦</p>
                <p className="mt-2 text-sm text-zinc-500">No posts yet — be the first to share.</p>
              </div>
            )}

            {posts.map((post) => {
              const liked = post.likes.includes(currentUserEmail);
              const profileHref = `/profile/${encodeURIComponent(post.authorId ?? post.authorEmail)}`;
              const commentsOpen = openComments[post.id] ?? false;

              return (
                <article key={post.id} className="rounded-2xl border border-white/[0.08] bg-[#16161a] overflow-hidden">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <Link href={profileHref}><Avatar name={post.authorName} /></Link>
                      <div className="flex-1 min-w-0">
                        <Link href={profileHref} className="text-sm font-semibold text-white hover:text-violet-300 transition-colors">
                          {post.authorName}
                        </Link>
                        <p className="text-xs text-zinc-600">{timeAgo(post.createdAt)} ago</p>
                      </div>
                    </div>

                    {/* Text */}
                    {post.text.trim() && (
                      <p className="mt-3 text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap">{post.text}</p>
                    )}

                    {/* Media */}
                    {post.mediaUrl && post.mediaType === "image" && (
                      <img src={post.mediaUrl} alt="" className="mt-3 max-h-[480px] w-full rounded-xl object-cover border border-white/[0.06]" />
                    )}
                    {post.mediaUrl && post.mediaType === "video" && (
                      <video src={post.mediaUrl} controls className="mt-3 w-full rounded-xl border border-white/[0.06]" />
                    )}
                  </div>

                  {/* Counts */}
                  {(post.likes.length > 0 || post.comments.length > 0) && (
                    <div className="border-t border-white/[0.06] px-5 py-2 flex gap-3 text-xs text-zinc-600">
                      {post.likes.length > 0 && <span>{post.likes.length} like{post.likes.length !== 1 ? "s" : ""}</span>}
                      {post.comments.length > 0 && <span>{post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}</span>}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t border-white/[0.06] flex">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${liked ? "text-violet-400 hover:bg-violet-500/10" : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"}`}
                    >
                      <svg className="h-4 w-4" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                      Like
                    </button>
                    <button
                      onClick={() => setOpenComments((p) => ({ ...p, [post.id]: !p[post.id] }))}
                      className="flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg>
                      Comment
                    </button>
                  </div>

                  {/* Comments */}
                  {commentsOpen && (
                    <div className="border-t border-white/[0.06] bg-black/20 p-4 space-y-3">
                      {post.comments.map((c) => {
                        const cHref = `/profile/${encodeURIComponent(c.authorId ?? c.authorEmail ?? "")}`;
                        return (
                          <div key={c.id} className="flex gap-2.5">
                            <Link href={cHref}><Avatar name={c.authorName} size="sm" /></Link>
                            <div className="flex-1 rounded-xl bg-white/[0.04] px-3 py-2">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <Link href={cHref} className="text-xs font-semibold text-white hover:text-violet-300 transition-colors">{c.authorName}</Link>
                                <span className="text-xs text-zinc-700">{timeAgo(c.createdAt)}</span>
                              </div>
                              <p className="text-xs text-zinc-300">{c.text}</p>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex gap-2.5 pt-1">
                        <Avatar name={currentUserName} size="sm" />
                        <div className="flex flex-1 gap-2">
                          <input
                            value={commentText[post.id] ?? ""}
                            onChange={(e) => setCommentText((p) => ({ ...p, [post.id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void addComment(post.id); } }}
                            placeholder="Write a comment…"
                            maxLength={280}
                            className="flex-1 rounded-xl border border-white/[0.08] bg-[#0f0f11] px-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition"
                          />
                          <button
                            onClick={() => addComment(post.id)}
                            className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 text-xs font-medium text-violet-300 hover:bg-violet-600 hover:text-white hover:border-violet-500 transition-colors"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
