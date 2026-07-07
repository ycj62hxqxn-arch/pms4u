import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createLedgerAppender, getLedgerReference } from "../../../../lib/agentLedger";

type GateDecision = "ALLOW" | "DENY" | "NEED_REVIEW";

type InboundRequest = {
  actorId: string;
  actorRole: string;
  useCase: string;
  targetSystem: string;
  requestedAction: string;
  prompt: string;
};

type PolicyPack = {
  id: "GENERAL_SAFE_PLAN" | "BANKING_CHANGE_CONTROL" | "LOGISTICS_RELEASE_CONTROL";
  name: string;
  allowRoles: Set<string>;
  hardDenyPatterns: RegExp[];
  reviewPatterns: RegExp[];
};

const ALLOWED_ROLES = new Set(["ops-supervisor", "compliance-officer", "governance-admin"]);
const DENY_PATTERNS = [
  /delete\s+all/i,
  /drop\s+table/i,
  /wire\s+transfer/i,
  /execute\s+payment/i,
  /ship\s+without\s+approval/i,
];
const REVIEW_PATTERNS = [/payment/i, /shipment/i, /transfer/i, /release/i, /override/i];

const POLICY_PACKS: Record<PolicyPack["id"], PolicyPack> = {
  GENERAL_SAFE_PLAN: {
    id: "GENERAL_SAFE_PLAN",
    name: "General Safe Planning",
    allowRoles: ALLOWED_ROLES,
    hardDenyPatterns: DENY_PATTERNS,
    reviewPatterns: REVIEW_PATTERNS,
  },
  BANKING_CHANGE_CONTROL: {
    id: "BANKING_CHANGE_CONTROL",
    name: "Banking Runtime Change Control",
    allowRoles: new Set(["compliance-officer", "governance-admin"]),
    hardDenyPatterns: [/wire\s+transfer/i, /execute\s+payment/i, /override\s+risk/i],
    reviewPatterns: [/payment/i, /transfer/i, /trade/i, /bank/i],
  },
  LOGISTICS_RELEASE_CONTROL: {
    id: "LOGISTICS_RELEASE_CONTROL",
    name: "Logistics Release Governance",
    allowRoles: new Set(["ops-supervisor", "governance-admin"]),
    hardDenyPatterns: [/ship\s+without\s+approval/i, /release\s+all/i],
    reviewPatterns: [/shipment/i, /release/i, /dispatch/i, /customs/i],
  },
};

const RECEIPT_SIGNING_SECRET = process.env.PMS_RECEIPT_SIGNING_SECRET ?? "dev-only-unsafe";
const OPENAI_TIMEOUT_MS = Number(process.env.OPENAI_TIMEOUT_MS ?? "12000");

function selectPolicyPack(input: InboundRequest): PolicyPack {
  const fingerprint = `${input.useCase}\n${input.targetSystem}`.toLowerCase();
  if (/bank|payment|trade|treasury/.test(fingerprint)) {
    return POLICY_PACKS.BANKING_CHANGE_CONTROL;
  }

  if (/shipment|logistics|dispatch|customs|warehouse/.test(fingerprint)) {
    return POLICY_PACKS.LOGISTICS_RELEASE_CONTROL;
  }

  return POLICY_PACKS.GENERAL_SAFE_PLAN;
}

function evaluateGate(input: InboundRequest): {
  decision: GateDecision;
  reason: string;
  policyPackId: PolicyPack["id"];
  policyPackName: string;
  authorityAllowed: boolean;
  authorityReason: string;
  admissibilityState: "PASS" | "REVIEW" | "DENY";
  admissibilityReason: string;
} {
  const policyPack = selectPolicyPack(input);
  const combined = `${input.requestedAction}\n${input.prompt}`;

  if (policyPack.hardDenyPatterns.some((pattern) => pattern.test(combined))) {
    return {
      decision: "DENY",
      reason: "Request contains a hard-block pattern that is constitutionally inadmissible.",
      policyPackId: policyPack.id,
      policyPackName: policyPack.name,
      authorityAllowed: policyPack.allowRoles.has(input.actorRole),
      authorityReason: policyPack.allowRoles.has(input.actorRole)
        ? "Actor role is authorized by policy pack."
        : "Actor role is outside policy pack allowlist.",
      admissibilityState: "DENY",
      admissibilityReason: "Hard deny pattern matched.",
    };
  }

  if (!policyPack.allowRoles.has(input.actorRole)) {
    return {
      decision: "NEED_REVIEW",
      reason: "Actor role is not in runtime allowlist and needs human release authority.",
      policyPackId: policyPack.id,
      policyPackName: policyPack.name,
      authorityAllowed: false,
      authorityReason: "Actor role is outside policy pack allowlist.",
      admissibilityState: "PASS",
      admissibilityReason: "No hard deny pattern detected.",
    };
  }

  if (policyPack.reviewPatterns.some((pattern) => pattern.test(combined))) {
    return {
      decision: "NEED_REVIEW",
      reason: "Request is financially or operationally sensitive and requires supervisory review.",
      policyPackId: policyPack.id,
      policyPackName: policyPack.name,
      authorityAllowed: true,
      authorityReason: "Actor role is authorized by policy pack.",
      admissibilityState: "REVIEW",
      admissibilityReason: "Sensitive pattern detected and requires supervisory release.",
    };
  }

  return {
    decision: "ALLOW",
    reason: "Authority and admissibility checks passed for planning-only execution.",
    policyPackId: policyPack.id,
    policyPackName: policyPack.name,
    authorityAllowed: true,
    authorityReason: "Actor role is authorized by policy pack.",
    admissibilityState: "PASS",
    admissibilityReason: "No deny/review pattern detected.",
  };
}

function signReceiptPayload(payload: Record<string, unknown>): string {
  const canonical = JSON.stringify(payload);
  return createHmac("sha256", RECEIPT_SIGNING_SECRET).update(canonical).digest("hex");
}


async function runOpenAIPlan(prompt: string): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  if (!apiKey) {
    return {
      mode: "SIMULATED",
      note: "OPENAI_API_KEY missing. Returning local governed simulation.",
      plan: [
        "Summarize user intent.",
        "Produce a non-executing action plan.",
        "Return proposed steps for operator confirmation.",
      ],
      raw: null,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "You are a governed planning agent. Never execute external actions. Return only proposed steps.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_output_tokens: 450,
        temperature: 0.2,
        store: false,
      }),
    });

    const raw = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    if (!response.ok) {
      return {
        mode: "OPENAI_ERROR",
        model,
        status: response.status,
        raw,
        plan: [
          "Record that the external planning agent returned an error.",
          "Keep execution in proposed-actions-only mode.",
          "Ask an operator to retry or review manually.",
        ],
      };
    }

    return {
      mode: "OPENAI",
      model,
      raw,
    };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return {
      mode: timedOut ? "OPENAI_TIMEOUT" : "OPENAI_ERROR",
      model,
      timeoutMs: OPENAI_TIMEOUT_MS,
      note: timedOut
        ? "OpenAI planning timed out. Returning local governed fallback."
        : error instanceof Error
          ? error.message
          : "OpenAI planning failed. Returning local governed fallback.",
      plan: [
        "Preserve the PMS gate decision and evidence chain.",
        "Return a local non-executing fallback plan.",
        "Require operator confirmation before any external action.",
      ],
      raw: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function parseInboundRequest(body: unknown): InboundRequest {
  const src = (body ?? {}) as Record<string, unknown>;

  return {
    actorId: String(src.actorId ?? "unknown-actor"),
    actorRole: String(src.actorRole ?? "unknown-role"),
    useCase: String(src.useCase ?? "general"),
    targetSystem: String(src.targetSystem ?? "unspecified"),
    requestedAction: String(src.requestedAction ?? ""),
    prompt: String(src.prompt ?? ""),
  };
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const executionId = randomUUID();
    const appendLedgerEntry = await createLedgerAppender(executionId);
    const body = parseInboundRequest(await request.json().catch(() => ({})));

  const inboundEntry = await appendLedgerEntry("INBOUND_REQUEST", {
    actorId: body.actorId,
    actorRole: body.actorRole,
    useCase: body.useCase,
    targetSystem: body.targetSystem,
    requestedAction: body.requestedAction,
    prompt: body.prompt,
  });

  const gate = evaluateGate(body);

  const authorityEntry = await appendLedgerEntry("AUTHORITY_CHECK", {
    actorId: body.actorId,
    actorRole: body.actorRole,
    authorityAllowed: gate.authorityAllowed,
    authorityReason: gate.authorityReason,
    policyPackId: gate.policyPackId,
  });

  const admissibilityEntry = await appendLedgerEntry("ADMISSIBILITY_CHECK", {
    admissibilityState: gate.admissibilityState,
    admissibilityReason: gate.admissibilityReason,
    requestedAction: body.requestedAction,
    prompt: body.prompt,
    policyPackId: gate.policyPackId,
  });

  const gateEntry = await appendLedgerEntry("PMS_GATE_DECISION", gate);

  const evidenceEntry = await appendLedgerEntry("EVIDENCE_RECORD", {
    evidenceType: "PMS_EXECUTION_GATE",
    authorityHash: authorityEntry.hash,
    admissibilityHash: admissibilityEntry.hash,
    gateHash: gateEntry.hash,
    sourceHash: inboundEntry.hash,
    policyPackId: gate.policyPackId,
    decision: gate.decision,
  });

  if (gate.decision !== "ALLOW") {
    const skipped = await appendLedgerEntry("AGENT_SKIPPED", {
      reason: "Agent execution is blocked until PMS decision is ALLOW.",
      decision: gate.decision,
    });

    const receiptPayload = {
      executionId,
      decision: gate.decision,
      policyPackId: gate.policyPackId,
      gateHash: gateEntry.hash,
      evidenceHash: evidenceEntry.hash,
      finalHash: skipped.hash,
      issuedAt: new Date().toISOString(),
    };
    const receiptSignature = signReceiptPayload(receiptPayload);
    const receiptEntry = await appendLedgerEntry("SIGNED_RECEIPT", {
      ...receiptPayload,
      signature: receiptSignature,
    });

    return NextResponse.json(
      {
        executionId,
        decision: gate.decision,
        reason: gate.reason,
        policyPack: {
          id: gate.policyPackId,
          name: gate.policyPackName,
        },
        status: "blocked",
        receipt: {
          ...receiptPayload,
          signature: receiptSignature,
        },
        trace: {
          sourceHash: inboundEntry.hash,
          authorityHash: authorityEntry.hash,
          admissibilityHash: admissibilityEntry.hash,
          gateHash: gateEntry.hash,
          evidenceHash: evidenceEntry.hash,
          finalHash: receiptEntry.hash,
          ledgerPath: getLedgerReference(),
        },
      },
      { status: 202 }
    );
  }

  await appendLedgerEntry("AGENT_PROMPT", {
    prompt: body.prompt,
    requestedAction: body.requestedAction,
    executionMode: "proposed_actions_only",
  });

  await appendLedgerEntry("AGENT_TOOL_CALL", {
    tool: "openai.responses.create",
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    callType: "planning",
  });

  const agentResult = await runOpenAIPlan(body.prompt);
  if (agentResult.mode === "OPENAI_TIMEOUT") {
    await appendLedgerEntry("AGENT_TOOL_TIMEOUT", {
      tool: "openai.responses.create",
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      timeoutMs: OPENAI_TIMEOUT_MS,
      executionMode: "proposed_actions_only",
    });
  }

  const toolResultEntry = await appendLedgerEntry("AGENT_TOOL_RESULT", {
    resultMode: agentResult.mode,
    hasRaw: Boolean(agentResult.raw),
    executionMode: "proposed_actions_only",
  });

  const planEntry = await appendLedgerEntry("AGENT_PLAN", {
    executionMode: "proposed_actions_only",
    resultMode: agentResult.mode,
    toolResultHash: toolResultEntry.hash,
  });

  const receiptPayload = {
    executionId,
    decision: gate.decision,
    policyPackId: gate.policyPackId,
    gateHash: gateEntry.hash,
    evidenceHash: evidenceEntry.hash,
    finalHash: planEntry.hash,
    issuedAt: new Date().toISOString(),
  };
  const receiptSignature = signReceiptPayload(receiptPayload);
  const receiptEntry = await appendLedgerEntry("SIGNED_RECEIPT", {
    ...receiptPayload,
    signature: receiptSignature,
  });

    return NextResponse.json(
      {
        executionId,
        decision: gate.decision,
        reason: gate.reason,
        policyPack: {
          id: gate.policyPackId,
          name: gate.policyPackName,
        },
        status: "allowed",
        output: {
          executionMode: "proposed_actions_only",
          agentResult,
        },
        receipt: {
          ...receiptPayload,
          signature: receiptSignature,
        },
        trace: {
          sourceHash: inboundEntry.hash,
          authorityHash: authorityEntry.hash,
          admissibilityHash: admissibilityEntry.hash,
          gateHash: gateEntry.hash,
          evidenceHash: evidenceEntry.hash,
          finalHash: receiptEntry.hash,
          ledgerPath: getLedgerReference(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Inbound execution failed before completion.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
