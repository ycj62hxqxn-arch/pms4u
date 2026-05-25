import json
from typing import Dict, List, Optional
from pydantic import BaseModel
import nacl.signing
import nacl.encoding

class AuthorityScope(BaseModel):
    domain: str
    allowed_transitions: List[str]
    level: str

class SignerIdentity(BaseModel):
    public_key_id: str
    public_key_hex: str
    institution: str
    active: bool
    scopes: List[AuthorityScope]

class SignerRegistry:
    def __init__(self):
        # In a real system, this would be backed by a DB or Vault.
        # For our runtime, we initialize it in-memory.
        self._identities: Dict[str, SignerIdentity] = {}

    def register_signer(self, identity: SignerIdentity):
        self._identities[identity.public_key_id] = identity

    def get_signer(self, public_key_id: str) -> Optional[SignerIdentity]:
        return self._identities.get(public_key_id)

    def is_authorized(self, public_key_id: str, domain: str, transition: str) -> bool:
        identity = self.get_signer(public_key_id)
        if not identity or not identity.active:
            return False

        for scope in identity.scopes:
            if scope.domain == domain or scope.domain == "*":
                if transition in scope.allowed_transitions or "*" in scope.allowed_transitions:
                    return True
        return False

# Global registry instance
registry = SignerRegistry()

# Seed with some bootstrap authorities
_bootstrap_key = nacl.signing.SigningKey(b"0123456789abcdef0123456789abcdef")
_bootstrap_verify = _bootstrap_key.verify_key
_bootstrap_pk_id = "gov_pk_" + _bootstrap_verify.encode(encoder=nacl.encoding.HexEncoder).decode()[:12]

registry.register_signer(SignerIdentity(
    public_key_id=_bootstrap_pk_id,
    public_key_hex=_bootstrap_verify.encode(encoder=nacl.encoding.HexEncoder).decode(),
    institution="GTCS4U_CORE_GOVERNANCE",
    active=True,
    scopes=[
        AuthorityScope(
            domain="*",
            allowed_transitions=["*"],
            level="SUPER_ADMIN"
        )
    ]
))
