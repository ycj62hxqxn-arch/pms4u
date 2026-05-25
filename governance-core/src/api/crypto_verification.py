from src.crypto.detached_signatures import core_crypto

class VerifierAdapter:
    def __init__(self):
        self._core = core_crypto
        self.public_key_id = self._core.runtime_pk_id

    def sign_payload(self, message: str) -> str:
        return self._core.sign_payload(message)

    def verify_signature(self, message: str, signature_hex: str) -> bool:
        return self._core.verify_runtime_signature(message, signature_hex)

verifier = VerifierAdapter()
