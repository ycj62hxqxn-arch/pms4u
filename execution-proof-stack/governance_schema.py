"""
Schema Loader and Validator for Execution Constitution Contract
"""
import os
import yaml
from jsonschema import validate, ValidationError

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "../governance-core/contracts/execution_constitution.schema.yaml")


def load_constitution_schema():
    with open(SCHEMA_PATH, "r") as f:
        schema = yaml.safe_load(f)
    return schema


def validate_execution_request(request, schema):
    # Flatten schema for jsonschema validation
    # (YAML is descriptive, so we define a minimal JSON schema for enforcement)
    json_schema = {
        "type": "object",
        "properties": {
            "authority_origin": {"type": "string"},
            "signer_chain": {"type": "array", "items": {"type": "string"}},
            "intent_class": {"type": "string"},
            "risk_class": {"type": "string"},
            "admissibility_state": {"type": "string"},
            "consequence_domain": {"type": "string"}
        },
        "required": [
            "authority_origin", "signer_chain", "intent_class", "risk_class", "admissibility_state", "consequence_domain"
        ]
    }
    validate(instance=request, schema=json_schema)

