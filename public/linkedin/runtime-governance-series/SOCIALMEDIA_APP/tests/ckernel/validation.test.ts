import assert from "node:assert/strict";
import test from "node:test";

import {
  validateEvaluationRequest,
} from "../../lib/ckernel/validation";

test(
  "valid constitutional request is admitted",
  () => {
    const result =
      validateEvaluationRequest({
        intent: "publish governed contribution",
        authority: {
          actor: "operator-1",
          roles: ["member"],
        },
        context: {
          risk: "low",
        },
        evidence: [],
      });

    assert.equal(result.valid, true);

    if (result.valid) {
      assert.equal(
        result.value.intent,
        "publish governed contribution",
      );
    }
  },
);

test(
  "missing intent is rejected",
  () => {
    const result =
      validateEvaluationRequest({
        authority: {
          actor: "operator-1",
          roles: ["member"],
        },
      });

    assert.equal(result.valid, false);
  },
);

test(
  "missing authority actor is rejected",
  () => {
    const result =
      validateEvaluationRequest({
        intent: "publish contribution",
        authority: {
          actor: "",
          roles: ["member"],
        },
      });

    assert.equal(result.valid, false);
  },
);

test(
  "authority roles must be strings",
  () => {
    const result =
      validateEvaluationRequest({
        intent: "publish contribution",
        authority: {
          actor: "operator-1",
          roles: [123],
        },
      });

    assert.equal(result.valid, false);
  },
);
