# Pilot Scope — Live Integration Proof-of-Concept

## Overview

This document defines the narrowly scoped live-integration pilot for the Flight Price Location Comparator. This pilot is **NOT production deployment** — it is a proof-of-concept validation that the system can correctly integrate with real provider and proxy infrastructure.

## Pilot Constraints (Non-Negotiable)

### 1. Single Provider Only
- **Official Provider**: One contractually approved flight search provider (e.g., Amadeus, Skyscanner, authorized partner)
- **Configuration**: 
  - `ENABLE_LIVE_MODE=true` (default: false)
  - `LIVE_PROVIDER_NAME=authorized` (or provider name)
  - `LIVE_PROVIDER_API_KEY=***` (server-side only; never in browser)
- **Fallback**: If provider fails, mock mode takes over automatically
- **No Multi-Provider Testing**: Do not test multiple providers in same pilot

### 2. Single Proxy Only
- **Approved Proxy**: One residential or datacenter proxy provider
- **Configuration**:
  - `LIVE_PROXY_HOST=https://proxy.example.com/verify`
  - `LIVE_PROXY_API_KEY=***` (server-side only)
- **Fallback**: If proxy fails, mock IP verification activates
- **No Multi-Proxy Testing**: Do not test multiple proxies in same pilot

### 3. Single Fixed Route Only
- **Route**: Cairo (CAI) → Berlin (BER)
- **Rationale**: Controlled baseline for price comparison consistency
- **Restrictions**: 
  - `PILOT_ORIGIN_CODE=CAI`
  - `PILOT_DESTINATION_CODE=BER`
  - All search requests routed through validation gate
  - Non-pilot routes rejected with 400 error

### 4. Two Countries Only
- **Baseline**: Egypt (implied by CAI origin point-of-sale)
- **Pilot Location**: One other country (default: India)
- **Configuration**:
  - `PILOT_LOCATION_CODE=IN`
  - `PILOT_LOCATION_LABEL=India`
- **Rationale**: Single comparison is sufficient proof; avoids scaling complexity

### 5. Three+ Repetitions Per Location
- **Baseline Runs**: Minimum 3 searches with US/Egypt market context
- **Pilot Location Runs**: Minimum 3 searches with pilot location market context
- **Purpose**: 
  - Validate consistency (prices should not vary wildly between runs)
  - Detect API errors or rate limiting
  - Generate multiple evidence hashes for integrity audit
- **Execution**: `npm run pilot` (runs 6+ comparisons automatically)

### 6. Mock Mode Remains Default
- **Default Behavior**: `ENABLE_LIVE_MODE=false` (all searches use mock provider)
- **No Auto-Upgrade**: Live mode is opt-in only
- **Fallback**: If live provider misconfigured, system gracefully falls back to mock
- **Production Readiness**: Mock comparisons are fully functional and clear about simulation

### 7. Live Mode Is Opt-In and Disabled by Default
- **To Enable**: Set `ENABLE_LIVE_MODE=true` AND `LIVE_PROVIDER_NAME=authorized`
- **Explicit Flag**: Not environment-auto-detected; requires deliberate configuration
- **Gating**: 
  - API endpoints reject requests unless both flags set
  - Pilot script fails at startup if misconfigured
  - Logs warn when live mode attempted without credentials
- **No Implicit Activation**: Deploying code does not automatically trigger live mode

### 8. All Authentication Is Server-Side Only
- **Browser Isolation**:
  - API keys never included in responses
  - Proxy credentials never sent to client
  - Comparison results sanitized before serialization
- **Server Enforcement**:
  - Environment variables read on Node.js runtime only
  - `redactUrl()` strips credentials from all logs
  - Proxy URLs validated before use against allowlist
- **Transport Security**:
  - HTTPS enforced for live proxy endpoints
  - Certificate validation required
  - No credential leakage in error messages

### 9. Evidence Logging Mandatory for Every Comparison
- **Logging Output** (when `PILOT_EVIDENCE_LOGGING=true`):
  - Comparison ID
  - Route origin and destination
  - Evidence hash (SHA-256)
  - Number of matched results
  - Number of failed locations
  - Execution duration
  - Baseline and regional prices (when available)
- **Audit Trail**:
  - Each comparison generates immutable evidence hash
  - Evidence includes: search request, provider response hash, normalization steps, timestamp
  - Can be replayed/verified independently
- **Non-Repudiation**:
  - Provider claim cannot be denied (provider response hash captured)
  - Normalization logic cannot be retroactively modified (logic included in hash)
  - Timestamp verified at execution time

## Pilot Test Execution

### Setup

1. **Obtain Provider Credentials** (from official partner)
   ```bash
   export LIVE_PROVIDER_API_KEY="sk_live_..." # server-side only
   export LIVE_PROVIDER_BASE_URL="https://api.partner.com"
   ```

2. **Obtain Proxy Credentials** (from residential proxy provider)
   ```bash
   export LIVE_PROXY_HOST="https://proxy.provider.com/verify"
   export LIVE_PROXY_API_KEY="proxy_key_..." # server-side only
   ```

3. **Configure Pilot Parameters** (in `.env.local`)
   ```bash
   # Enable live integration
   ENABLE_LIVE_MODE=true
   LIVE_PROVIDER_NAME=authorized
   
   # Proxy configuration
   PILOT_LOCATION_CODE=IN
   PILOT_LOCATION_LABEL=India
   
   # Route (fixed)
   PILOT_ORIGIN_CODE=CAI
   PILOT_DESTINATION_CODE=BER
   
   # Test parameters
   PILOT_DEPARTURE_DATE=2026-07-21
   PILOT_RETURN_DATE=2026-07-28
   PILOT_CABIN_CLASS=economy
   PILOT_CURRENCY=EUR
   PILOT_REPETITIONS=3
   
   # Logging
   PILOT_EVIDENCE_LOGGING=true
   ```

4. **Install Dependencies** (if not already installed)
   ```bash
   npm install
   ```

### Execution

```bash
# Run pilot test (3 baseline + 3 pilot location = 6 total comparisons)
npm run pilot
```

### Expected Output

```
═══════════════════════════════════════════════════════════
PILOT — Live Integration Test
═══════════════════════════════════════════════════════════

PILOT CONFIGURATION:
  Route: CAI → BER
  Locations: BASELINE + India (IN)
  Dates: 2026-07-21 → 2026-07-28
  Currency: EUR
  Cabin: economy
  Repetitions: 3 per location
  Live Mode: ENABLED
  Evidence Logging: ENABLED

═══════════════════════════════════════════════════════════
RUNNING 6 COMPARISONS...
═══════════════════════════════════════════════════════════

[PILOT] Run #1 — BASELINE
  Comparison ID: pilot-run-1-BASELINE-1721052429847
  Evidence Hash: 4e60795cb7bebc7939dbd8561ffb43391de2896...
  Matched: 3
  Failed: 0
  Duration: 2847ms
  Baseline Price: 541.00 EUR

[PILOT] Run #2 — BASELINE
  ...

═══════════════════════════════════════════════════════════
CONSISTENCY VALIDATION
═══════════════════════════════════════════════════════════

Location: BASELINE
  Runs: 3
  Price Variance: 0.15% (min: 540.50, max: 541.30)
  Matched Results Range: 3–3
  Evidence Hashes: 4e60795c, 4e60795d, 4e60795e

Location: IN
  Runs: 3
  Price Variance: 2.3% (min: 485.00, max: 495.40)
  Matched Results Range: 2–3
  Evidence Hashes: 5f71896f, 5f71896g, 5f71896h

═══════════════════════════════════════════════════════════
PILOT COMPLETE ✓
═══════════════════════════════════════════════════════════

SUMMARY:
  Total Runs: 6
  Successful: 6
  Failed: 0
  Total Duration: 17234ms

COMPARISON IDS (for audit):
  1. pilot-run-1-BASELINE-1721052429847 [BASELINE]
  2. pilot-run-2-BASELINE-1721052432591 [BASELINE]
  3. pilot-run-3-BASELINE-1721052435123 [BASELINE]
  4. pilot-run-4-IN-1721052437845 [IN]
  5. pilot-run-5-IN-1721052440569 [IN]
  6. pilot-run-6-IN-1721052443201 [IN]

EVIDENCE HASHES (for integrity):
  1. 4e60795cb7bebc7939dbd8561ffb43391de2896373f49556ff324ba65fb3a0af [BASELINE]
  2. 4e60795cb7bebc7939dbd8561ffb43391de2896373f49556ff324ba65fb3a0af [BASELINE]
  3. 4e60795cb7bebc7939dbd8561ffb43391de2896373f49556ff324ba65fb3a0af [BASELINE]
  4. 5f71896f4c8df51e4d52c47a8e4ef5e482c27ab484f5a667gg435cb76fc4b1bg [IN]
  5. 5f71896f4c8df51e4d52c47a8e4ef5e482c27ab484f5a667gg435cb76fc4b1bg [IN]
  6. 5f71896f4c8df51e4d52c47a8e4ef5e482c27ab484f5a667gg435cb76fc4b1bg [IN]
```

### Validation Checklist

After running pilot, verify:

- [ ] **All 6 comparisons completed** (no failures or timeouts)
- [ ] **Evidence hashes are deterministic** (same location = same hash across runs)
- [ ] **Price variance is acceptable** (< 5% per location recommended)
- [ ] **Matched results are consistent** (same offer count per location)
- [ ] **No credential leakage** (grep logs for API key, proxy URL)
- [ ] **Duration reasonable** (< 5 seconds per comparison)
- [ ] **No rate limiting errors** (provider accepted all requests)
- [ ] **Pilot route enforced** (non-pilot searches would have been rejected)

## Next Steps After Pilot

### If Pilot Succeeds ✓

1. **Audit Evidence Hashes**: Review comparison IDs and hashes; verify no data corruption
2. **Document Provider Behavior**: Note any provider-specific quirks (rate limits, response format)
3. **Document Proxy Behavior**: Note IP geolocation accuracy, latency characteristics
4. **Prepare Live Deployment Config**: Define provider credentials management (secrets store)
5. **Enable Live Mode Selectively**: 
   - Keep mock as default in production
   - Require explicit feature flag for live comparisons
   - Rate-limit live searches to prevent abuse
6. **Expand Scope (if authorized)**:
   - Add second provider (one at a time)
   - Add second location proxy (one at a time)
   - Expand route coverage (after second location validated)

### If Pilot Fails ✗

1. **Diagnose Failure**: Check pilot logs for provider errors, proxy issues, or configuration problems
2. **Verify Credentials**: Confirm API keys and proxy URLs are correct (never in logs)
3. **Check Provider Status**: Confirm provider API is online and responding
4. **Check Proxy Status**: Confirm proxy endpoint is reachable and returning valid IP
5. **Validate Allowlist**: Ensure `ALLOWED_PROXY_HOSTS` includes provider endpoint
6. **Retry**: Fix configuration and rerun pilot
7. **Fallback**: Set `ENABLE_LIVE_MODE=false` to resume mock-only operation

## Security Considerations

### Credential Management

- **Never commit credentials** to version control
- **Use environment variables** for all secrets (API keys, proxy credentials)
- **Server-side only** — credentials never sent to browser or client
- **Rotate credentials** regularly (follow provider security guidelines)
- **Audit logs** for credential usage; alert on unusual patterns

### Proxy Security

- **HTTPS only** for proxy endpoints (no HTTP)
- **Certificate validation** required (no self-signed certificates in production)
- **Allowlist enforcement** (`ALLOWED_PROXY_HOSTS`) prevents SSRF attacks
- **Request signing** recommended (if provider supports)
- **Rate limiting** on proxy calls to prevent abuse

### Price Data Sensitivity

- **Transient data** — prices are point-in-time and may not be repeatable
- **Disclaimer required** — all UI must indicate "simulated" or "reference" pricing
- **No price claims** — do not use single pilot comparison as marketing claim
- **Audit trail** — evidence hashing enables investigation if price disputes arise

## Troubleshooting

### Pilot fails to start
- **Check**: `ENABLE_LIVE_MODE=true` and `LIVE_PROVIDER_NAME=authorized`
- **Check**: No other process blocking localhost:3000 (if using dev server)
- **Check**: Node.js 18+ installed (run `node --version`)

### Provider returns errors
- **Check**: API key is correct (`LIVE_PROVIDER_API_KEY`)
- **Check**: Provider API is online (test with curl)
- **Check**: Request format matches provider specification
- **Check**: Provider rate limit not exceeded

### Proxy returns invalid IP
- **Check**: Proxy endpoint is reachable (`curl $LIVE_PROXY_HOST`)
- **Check**: Proxy credentials are correct (`LIVE_PROXY_API_KEY`)
- **Check**: Proxy geolocation database is up-to-date

### Pilot runs but prices are wildly different
- **This is expected** for first run; provider may use different search algorithms
- **Check**: Price variance < 10% for second run (consistency validation)
- **If variance > 10%**: Investigate provider caching or algorithmic differences

### All comparisons stuck in "RUNNING" state
- **Check**: Dev server logs for errors (`npm run dev`)
- **Check**: Browser console for network errors
- **Check**: API endpoint `/api/health` returns 200 OK
- **Fallback**: Stop server, set `ENABLE_LIVE_MODE=false`, restart

## Appendix: Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `ENABLE_LIVE_MODE` | Yes | `false` | Master switch for live integration |
| `LIVE_PROVIDER_NAME` | If live | `` | Provider name (e.g., "authorized") |
| `LIVE_PROVIDER_API_KEY` | If live | `` | Provider authentication (server-side) |
| `LIVE_PROVIDER_BASE_URL` | If live | `` | Provider API endpoint |
| `LIVE_PROXY_HOST` | If live | `` | Proxy verification endpoint |
| `LIVE_PROXY_API_KEY` | If live | `` | Proxy authentication (server-side) |
| `PILOT_ORIGIN_CODE` | Optional | `CAI` | Pilot route origin |
| `PILOT_DESTINATION_CODE` | Optional | `BER` | Pilot route destination |
| `PILOT_LOCATION_CODE` | Optional | `IN` | Pilot comparison location |
| `PILOT_LOCATION_LABEL` | Optional | `India` | Pilot location display name |
| `PILOT_DEPARTURE_DATE` | Optional | `2026-07-21` | Search departure date (ISO 8601) |
| `PILOT_RETURN_DATE` | Optional | `2026-07-28` | Search return date (ISO 8601) |
| `PILOT_CABIN_CLASS` | Optional | `economy` | Cabin class for pilot |
| `PILOT_CURRENCY` | Optional | `EUR` | Currency for pilot |
| `PILOT_REPETITIONS` | Optional | `3` | Repetitions per location |
| `PILOT_EVIDENCE_LOGGING` | Optional | `true` | Enable evidence logging |
| `NETWORK_MODE` | Optional | `mock` | IP verification mode (`mock` or `live`) |

---

**Last Updated**: July 14, 2026
**Status**: Live Integration Pilot Ready
**Scope**: Proof-of-Concept (One Provider, One Proxy, One Route, Two Countries)
