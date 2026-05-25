import nacl.signing
import nacl.encoding
from typing import Dict, Any, Tuple
from .signer_registry import registry, SignerRegistry

class CryptoEnvVerifier:
    def __init__(self, signer_registry: SignerRegistry):
        self.registry = signer_registry
        
        # A runtime service holds its own signing key to issue Execution Receipts
        self.runtime_signing_key = nacl.signing.SigningKey(b"runtime_seed_0123456789abcdef012")
        self.runtime_verify_key = self.runtime_signing_key.verify_key
        self.runtime_pk_id = "rt_pk_" + self.runtime_verify_key.encode(encoder=nacl.encoding.HexEncoder).decode()[:12]

    def sign_payload(self, message: str) -> str:
        """
        Signs the payload representing the runtime's cryptographic seal on the event.
        """
        signed = self.runtime_signing_key.sign(message.encode())
        return signed.signature.hex()

    def verify_runtime_signature(self, message: str, signature_hex: str) -> bool:
        """
        Verifies if an Execution Event was genuinely sealed by this runtime.
        """
        try:
            signature_bytes = bytes.fromhex(signature_hex)
            self.runtime_verify_key.verify(message.encode(), signature_bytes)
            return True
        except Exception:
            return False

    def verify_authority_signature(self, public_key_id: str, message: str, signature_hex: str) -> bool:
        """
        Verifies an external authority's signature (e.g. from an incoming transition request).
        """
        signer = self.registry.get_signer(public_key_id)
        if not signer or not signer.active:
            return False
            
        try:
            verify_key = nacl.signing.VerifyKey(signer.public_key_hex, encoder=nacl.encoding.HexEncoder)
            signature_bytes = bytes.fromhex(signature_hex)
            verify_key.verify(message.encode(), signature_bytes)
            return True
        except Exception:
            return False

core_crypto = CryptoEnvVerifier(registry)
