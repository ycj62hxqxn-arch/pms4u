import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getSessionCookieName, verifySessionToken } from "@/lib/auth";
import { readPosts, writePosts } from "@/lib/feed";
import { evaluateConstitutionalRequest } from "@/lib/ckernel";
import { buildPostReasoning } from "@/lib/kge";

const createPostSchema = z
  .object({
    text: z.string().trim().max(500).optional(),
    mediaUrl: z.string().max(8_000_000).optional(),
    mediaType: z.enum(["image", "video"]).optional(),
  })
  .refine(
    (value) =>
      Boolean(
        (value.text && value.text.length > 0) ||
        value.mediaUrl,
      ),
    {
      message: "Post must include text or media.",
    },
  );

export async function GET() {
  const posts = await readPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized." },
      { status: 401 },
    );
  }

  let session: {
    userId: string;
    name: string;
    email: string;
  };

  try {
    const parsed = await verifySessionToken(token);

    session = {
      userId: parsed.userId,
      name: parsed.name,
      email: parsed.email,
    };
  } catch {
    return NextResponse.json(
      { message: "Unauthorized." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);

  const result = createPostSchema.safeParse(body);

  if (!result.success) {
    console.error("Post validation failed:", result.error);

    return NextResponse.json(
      { message: "Invalid post payload." },
      { status: 400 },
    );
  }

  const postId = randomUUID();
  const createdAt = new Date().toISOString();

  // Knowledge Graph reasoning
  const kgeTrace = buildPostReasoning({
    postId,
    actorId: session.userId,
    actorName: session.name,
    text: result.data.text ?? "",
    mediaUrl: result.data.mediaUrl,
    mediaType: result.data.mediaType,
    createdAt,
  });

  // Constitutional evaluation
  const receipt = await evaluateConstitutionalRequest({
    intent: "publish social contribution",
    authority: {
      actor: session.userId,
      roles: ["member"],
    },
    context: {
      system: "PMS4U Social Governance",
      resource: "post",
      operation: "create",
      risk: "low",
      knowledgeGraph: {
        traceId: kgeTrace.traceId,
        claimId: kgeTrace.claimId,
        decision: kgeTrace.decision,
        score: kgeTrace.score,
        concepts: kgeTrace.concepts,
        nodeCount: kgeTrace.nodeCount,
        relationCount: kgeTrace.relationCount,
      },
    },
    evidence: kgeTrace.graph.nodes
      .filter((node) => node.type === "EVIDENCE")
      .map((node) => ({
        id: node.objectId,
        type: String(node.metadata.mediaType ?? "knowledge-evidence"),
        digest:
          typeof node.metadata.digest === "string"
            ? node.metadata.digest
            : undefined,
      })),
  });

  if (receipt.decision !== "ALLOW") {
    return NextResponse.json(
      {
        message: "Post rejected by constitutional runtime.",
        receipt,
        kgeTrace,
      },
      { status: 403 },
    );
  }

  // Read existing posts
  const posts = await readPosts();

  // Create governed post
  const post = {
    id: postId,
    authorId: session.userId,
    authorName: session.name,
    authorEmail: session.email,
    text: result.data.text ?? "",
    createdAt,
    likes: [] as string[],
    comments: [],
    mediaUrl: result.data.mediaUrl,
    mediaType: result.data.mediaType,

    constitutionalReceiptId: receipt.receiptId,
    constitutionalDecision: receipt.decision,
    constitutionalHash: receipt.hash,
    constitutionalRuntimeVersion: receipt.runtimeVersion,
    kgeReasoningTraceId: kgeTrace.traceId,
    kgeClaimId: kgeTrace.claimId,
    kgeReasoningDecision: kgeTrace.decision,
    kgeReasoningScore: kgeTrace.score,
    kgeReasoningExplanation: kgeTrace.explanation,
    kgeReasoningSummary: kgeTrace.summary,
    kgeConcepts: kgeTrace.concepts,
    kgeNodeCount: kgeTrace.nodeCount,
    kgeRelationCount: kgeTrace.relationCount,
    kgeEvidenceCount: kgeTrace.evidenceCount,
  };

  posts.unshift(post);

  try {
    await writePosts(posts);
  } catch (err) {
    console.error("Failed to write posts:", err);
    throw err;
  }

  return NextResponse.json(
    {
      message: "Post created.",
      post,
      receipt,
      kgeTrace,
    },
    { status: 201 },
  );
}