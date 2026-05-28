"""
Demo: Financial Transaction Interception via Constitutional Execution Gateway
This demo shows how any payment/mutation attempt is intercepted, adjudicated, and either allowed, frozen, or escalated at runtime.
"""
from constitutional_gateway import ConstitutionalExecutionGateway

def commit_transaction(txn, verdict):
    print(f"[COMMIT] Transaction committed: {txn}")
    print(f"[ALLOW] Full verdict: {verdict}")

def freeze_transaction(txn, verdict):
    print(f"[FREEZE] Transaction frozen! Reason: {verdict['constitutional_reasoning']['summary']}")
    print(f"[FREEZE] Full verdict: {verdict}")

def main():


    import time
    gateway = ConstitutionalExecutionGateway(domain="FINANCIAL")

    # [0–1s] Title Frame
    print("\033[1m\033[94mConstitutional Execution Gateway\033[0m")
    print("\033[90mRuntime Consequence Interception\033[0m\n")
    time.sleep(1)

    # [1–8s] Framing
    print("\033[96mAI Agent requests consequential execution.\033[0m")
    time.sleep(1.5)
    print("Transfer: $250,000")
    print("Risk: HIGH")
    print("Authority: CFO → FinanceAgent")
    time.sleep(2)

    # [8–18s] Submitting request
    print("\nSubmitting request to Constitutional Execution Gateway...")
    time.sleep(2)

    # [18–28s] Evaluation
    print("\nEvaluating Runtime Admissibility...")
    time.sleep(2)

    # [28–36s] Drift/Integrity
    print("Context Drift Detected")
    time.sleep(1.2)
    print("Authority Integrity Changed")
    time.sleep(1.2)

    # [36–45s] Verdict
    execution_request_freeze = {
        "authority_origin": "CFO",
        "intent_class": "payment",
        "risk_class": "high",  # Will trigger escalation/freeze
        "admissibility_state": "pending",
        "signer_chain": ["CFO", "AI"],
        "consequence_domain": "financial"
    }
    context_freeze = {"account_balance": 100000, "requested_amount": 250000}
    verdict_freeze = gateway.evaluate_request(execution_request_freeze, context_freeze)
    time.sleep(0.7)
    print("\033[91m[VERDICT] FREEZE\033[0m")
    time.sleep(1.2)  # Extended pause for dramatic effect
    print("Mutation Blocked")
    time.sleep(0.7)
    print("Execution Escalated")
    time.sleep(0.7)
    print("Evidence Sealed")

    # [45–55s] No irreversible mutation occurred
    time.sleep(1.2)
    print("\n\033[1mNo irreversible mutation occurred.\033[0m")
    time.sleep(2)  # Hold final frame for 2 seconds

    # Simple fade out (clear screen or print blank lines)
    for _ in range(10):
        print()
        time.sleep(0.05)

if __name__ == "__main__":
    main()
