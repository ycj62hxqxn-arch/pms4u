# Lead Intake API Contract (Operations Core)

## Endpoint
`POST /leads`

### Request Body (application/json)
```
{
  "customer_name": "string",      // required
  "source": "string",             // required (e.g. Website, WhatsApp, Instagram, ...)
  "contact_info": "string",        // optional (email, phone, etc.)
  "notes": "string"                // optional (free text)
}
```

### Response (201 Created)
```
{
  "lead_id": "string",            // unique identifier
  "created_at": "ISO8601 string"
}
```

### Error Responses
- `400 Bad Request` — missing required fields
- `500 Internal Server Error` — unexpected failure

---

## Example (curl)
```sh
curl -X POST http://operations-core.local:8000/leads \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Max Müller",
    "source": "Website",
    "contact_info": "max@example.com",
    "notes": "Interested in Makadi Bay property."
  }'
```

---

## Integration Notes
- All lead creation (from website, WhatsApp, social, etc.) must use this endpoint.
- No direct DB writes from any channel.
- All downstream automation (follow-up, opportunity creation, analytics) is triggered from this single source.
- Extendable: add more fields as needed (e.g. tags, campaign_id, etc.)

---

## Next Steps
- Implement this contract in FastAPI (operations-core/lead_registry/api.py)
- Update all frontend forms and bots to POST here
- All agents and automations consume from this registry only
