import assert from "node:assert/strict";
import test from "node:test";

import type {
  ConstitutionalReceipt,
} from "../../lib/ckernel/types";

test(
  "constitutional receipt preserves verification fields",
  () => {
    const receipt: ConstitutionalReceipt = {
      receiptId: "cse_test",
      decision: "ALLOW",
      reason: "admissible",
      constitutionalRules: [
        "CSE-RT-001",
      ],
      intent: "publish contribution",
      actor: "operator-1",
      context: {
        risk: "low",
      },
      evidence: [],
      timestamp:
        "2026-07-24T00:00:00.000Z",
      hash: "a".repeat(64),
      signature: "signature",
      publicKey: "public-key",
      runtimeVersion: "0.2.0-alpha",
    };

    assert.equal(
      receipt.hash.length,
      64,
    );

    assert.equal(
      receipt.decision,
      "ALLOW",
    );

    assert.equal(
      receipt.runtimeVersion,
      "0.2.0-alpha",
    );
  },
);
