# Ägypten Hautnah Booking Machine

First operational MVP for turning Ägypten Hautnah into a tour-booking machine.

## What it adds

- German public booking page: `booking-machine.de.html`
- Admin operations dashboard: `booking-dashboard.html`
- FastAPI booking service: `booking_registry/api.py`
- SQLite booking database: `bookings.db`
- Tour catalog endpoint
- Booking request endpoint
- Governed status transitions
- Booking event ledger with lineage hashes
- Replay endpoint per booking
- WhatsApp confirmation text generator in the dashboard

## Booking lifecycle

```text
NEW_REQUEST
  -> OPERATOR_CONFIRMED
  -> CUSTOMER_CONFIRMED
  -> DEPOSIT_PAID
  -> TOUR_SCHEDULED
  -> TOUR_COMPLETED
  -> REVIEW_REQUESTED
```

Cancelled bookings can branch from early operational states.

Invalid jumps are blocked by the API. Example:

```text
NEW_REQUEST -> TOUR_COMPLETED
```

returns HTTP `409`.

## Local run

From `aegyptenhautnah-platform`:

```bash
python3 -m uvicorn booking_registry.api:app --host 0.0.0.0 --port 8088 --reload
```

Then open:

```text
booking-machine.de.html
booking-dashboard.html
```

The HTML pages use `http://localhost:8088` by default.

To point them to production:

```js
localStorage.setItem('AH_API_BASE', 'https://api.aegyptenhautnah.com')
```

## API

- `GET /health`
- `GET /tours`
- `POST /bookings`
- `GET /bookings`
- `GET /bookings/{booking_id}`
- `POST /bookings/{booking_id}/transition`
- `GET /bookings/{booking_id}/replay`
- `GET /admin/summary`

## Strategic role

This is not only a booking form. It is a vertical operations machine:

```text
Visitor -> Booking Request -> Operator Confirmation -> Customer Confirmation
-> Deposit / Schedule -> Tour Execution -> Replay / Review
```

It should become the fast-revenue operating proof for PMS4U/YAI:

```text
One governance architecture.
Multiple operational businesses.
Ägypten Hautnah monetizes tourism workflows.
PMS4U governs execution logic later.
```
