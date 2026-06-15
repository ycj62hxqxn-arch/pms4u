import hashlib
import json
import sqlite3
from datetime import date, datetime
from pathlib import Path
from typing import Optional
from uuid import uuid4

from .model import (
    Booking,
    BookingCreate,
    BookingEvent,
    BookingReplay,
    BookingStatus,
    BookingSummary,
    BookingTransitionCreate,
    Tour,
)

DB_PATH = Path(__file__).resolve().parent.parent / "bookings.db"

ALLOWED_TRANSITIONS: dict[BookingStatus, set[BookingStatus]] = {
    BookingStatus.NEW_REQUEST: {BookingStatus.OPERATOR_CONFIRMED, BookingStatus.CANCELLED},
    BookingStatus.OPERATOR_CONFIRMED: {BookingStatus.CUSTOMER_CONFIRMED, BookingStatus.CANCELLED},
    BookingStatus.CUSTOMER_CONFIRMED: {BookingStatus.DEPOSIT_PAID, BookingStatus.TOUR_SCHEDULED, BookingStatus.CANCELLED},
    BookingStatus.DEPOSIT_PAID: {BookingStatus.TOUR_SCHEDULED, BookingStatus.CANCELLED},
    BookingStatus.TOUR_SCHEDULED: {BookingStatus.TOUR_COMPLETED, BookingStatus.CANCELLED},
    BookingStatus.TOUR_COMPLETED: {BookingStatus.REVIEW_REQUESTED},
    BookingStatus.REVIEW_REQUESTED: set(),
    BookingStatus.CANCELLED: set(),
}

DEFAULT_TOURS = [
    Tour(
        tour_id="orange-bay",
        category="Sea",
        title="Orange Bay Tagesausflug",
        short_description="Bootstour, Strandzeit, Schnorcheln und Hoteltransfer ab Hurghada.",
        duration="Ganzer Tag",
        location="Hurghada / Orange Bay",
        base_price_eur=45,
    ),
    Tour(
        tour_id="dolphin-house",
        category="Sea",
        title="Dolphin House Schnorcheltour",
        short_description="Delfin-Spotting, Schnorchelstopps und deutschsprachige Betreuung.",
        duration="Ganzer Tag",
        location="Hurghada",
        base_price_eur=42,
    ),
    Tour(
        tour_id="luxor-private",
        category="Culture",
        title="Luxor Privat Tour",
        short_description="Tal der Könige, Karnak, Nilblick und privater Guide.",
        duration="Ganzer Tag",
        location="Luxor",
        base_price_eur=145,
    ),
    Tour(
        tour_id="cairo-pyramids",
        category="Culture",
        title="Kairo & Pyramiden",
        short_description="Pyramiden von Gizeh, Ägyptisches Museum und private Organisation.",
        duration="Ganzer Tag",
        location="Kairo",
        base_price_eur=175,
    ),
    Tour(
        tour_id="desert-safari",
        category="Desert",
        title="Wüstensafari & Beduinenabend",
        short_description="Quad, Wüste, Sonnenuntergang und Beduinenprogramm.",
        duration="Halber Tag",
        location="Hurghada Desert",
        base_price_eur=38,
    ),
    Tour(
        tour_id="private-custom",
        category="Private",
        title="Private Ägypten Experience",
        short_description="Individuelle Route für Familien, Paare oder VIP-Gäste.",
        duration="Nach Anfrage",
        location="Ägypten",
        base_price_eur=0,
    ),
]


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def make_lineage_hash(payload: dict) -> str:
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True, default=str)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def init_db():
    conn = connect()
    c = conn.cursor()
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS tours (
            tour_id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            short_description TEXT NOT NULL,
            duration TEXT NOT NULL,
            location TEXT NOT NULL,
            base_price_eur REAL NOT NULL,
            language TEXT NOT NULL,
            is_private_available INTEGER NOT NULL,
            is_active INTEGER NOT NULL
        )
        """
    )
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS bookings (
            booking_id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            tour_id TEXT NOT NULL,
            tour_title TEXT NOT NULL,
            tour_date TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            email TEXT,
            whatsapp TEXT NOT NULL,
            hotel_or_pickup TEXT NOT NULL,
            adults INTEGER NOT NULL,
            children INTEGER NOT NULL,
            language TEXT NOT NULL,
            special_requests TEXT,
            source TEXT NOT NULL,
            status TEXT NOT NULL,
            assigned_operator TEXT,
            pickup_time TEXT,
            deposit_status TEXT NOT NULL,
            payment_reference TEXT,
            internal_notes TEXT,
            evidence_id TEXT,
            lineage_hash TEXT
        )
        """
    )
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS booking_events (
            event_id TEXT PRIMARY KEY,
            booking_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            from_status TEXT,
            to_status TEXT NOT NULL,
            actor TEXT NOT NULL,
            note TEXT,
            evidence_json TEXT NOT NULL,
            parent_event_id TEXT,
            lineage_hash TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()
    seed_tours()


def seed_tours():
    conn = connect()
    for tour in DEFAULT_TOURS:
        conn.execute(
            """
            INSERT OR IGNORE INTO tours (
                tour_id, category, title, short_description, duration, location, base_price_eur,
                language, is_private_available, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                tour.tour_id,
                tour.category,
                tour.title,
                tour.short_description,
                tour.duration,
                tour.location,
                tour.base_price_eur,
                tour.language,
                int(tour.is_private_available),
                int(tour.is_active),
            ),
        )
    conn.commit()
    conn.close()


def row_to_tour(row) -> Tour:
    return Tour(
        tour_id=row["tour_id"],
        category=row["category"],
        title=row["title"],
        short_description=row["short_description"],
        duration=row["duration"],
        location=row["location"],
        base_price_eur=float(row["base_price_eur"]),
        language=row["language"],
        is_private_available=bool(row["is_private_available"]),
        is_active=bool(row["is_active"]),
    )


def row_to_booking(row) -> Booking:
    return Booking(
        booking_id=row["booking_id"],
        created_at=datetime.fromisoformat(row["created_at"]),
        updated_at=datetime.fromisoformat(row["updated_at"]),
        tour_id=row["tour_id"],
        tour_title=row["tour_title"],
        tour_date=date.fromisoformat(row["tour_date"]),
        customer_name=row["customer_name"],
        email=row["email"],
        whatsapp=row["whatsapp"],
        hotel_or_pickup=row["hotel_or_pickup"],
        adults=row["adults"],
        children=row["children"],
        language=row["language"],
        special_requests=row["special_requests"],
        source=row["source"],
        status=BookingStatus(row["status"]),
        assigned_operator=row["assigned_operator"],
        pickup_time=row["pickup_time"],
        deposit_status=row["deposit_status"],
        payment_reference=row["payment_reference"],
        internal_notes=row["internal_notes"],
        evidence_id=row["evidence_id"],
        lineage_hash=row["lineage_hash"],
    )


def row_to_event(row) -> BookingEvent:
    return BookingEvent(
        event_id=row["event_id"],
        booking_id=row["booking_id"],
        created_at=datetime.fromisoformat(row["created_at"]),
        from_status=BookingStatus(row["from_status"]) if row["from_status"] else None,
        to_status=BookingStatus(row["to_status"]),
        actor=row["actor"],
        note=row["note"],
        evidence=json.loads(row["evidence_json"] or "[]"),
        parent_event_id=row["parent_event_id"],
        lineage_hash=row["lineage_hash"],
    )


def list_tours() -> list[Tour]:
    init_db()
    conn = connect()
    rows = conn.execute("SELECT * FROM tours WHERE is_active = 1 ORDER BY category, title").fetchall()
    conn.close()
    return [row_to_tour(row) for row in rows]


def get_tour(tour_id: str) -> Optional[Tour]:
    init_db()
    conn = connect()
    row = conn.execute("SELECT * FROM tours WHERE tour_id = ?", (tour_id,)).fetchone()
    conn.close()
    return row_to_tour(row) if row else None


def latest_event_id(conn, booking_id: str) -> Optional[str]:
    row = conn.execute(
        "SELECT event_id FROM booking_events WHERE booking_id = ? ORDER BY created_at DESC LIMIT 1",
        (booking_id,),
    ).fetchone()
    return row["event_id"] if row else None


def insert_event(
    conn,
    *,
    booking_id: str,
    from_status: Optional[BookingStatus],
    to_status: BookingStatus,
    actor: str,
    note: Optional[str],
    evidence: list[str],
) -> BookingEvent:
    parent_event_id = latest_event_id(conn, booking_id)
    event_id = str(uuid4())
    created_at = datetime.utcnow()
    payload = {
        "event_id": event_id,
        "booking_id": booking_id,
        "created_at": created_at.isoformat(),
        "from_status": from_status.value if from_status else None,
        "to_status": to_status.value,
        "actor": actor,
        "note": note,
        "evidence": evidence,
        "parent_event_id": parent_event_id,
    }
    lineage_hash = make_lineage_hash(payload)
    conn.execute(
        """
        INSERT INTO booking_events (
            event_id, booking_id, created_at, from_status, to_status, actor, note,
            evidence_json, parent_event_id, lineage_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            event_id,
            booking_id,
            created_at.isoformat(),
            from_status.value if from_status else None,
            to_status.value,
            actor,
            note,
            json.dumps(evidence, ensure_ascii=False),
            parent_event_id,
            lineage_hash,
        ),
    )
    conn.execute("UPDATE bookings SET evidence_id = ?, lineage_hash = ? WHERE booking_id = ?", (event_id, lineage_hash, booking_id))
    return BookingEvent(
        event_id=event_id,
        booking_id=booking_id,
        created_at=created_at,
        from_status=from_status,
        to_status=to_status,
        actor=actor,
        note=note,
        evidence=evidence,
        parent_event_id=parent_event_id,
        lineage_hash=lineage_hash,
    )


def create_booking(payload: BookingCreate) -> Booking:
    init_db()
    tour = get_tour(payload.tour_id)
    if not tour:
        raise ValueError("tour_id not found")
    now = datetime.utcnow()
    booking = Booking(
        created_at=now,
        updated_at=now,
        tour_id=tour.tour_id,
        tour_title=tour.title,
        tour_date=payload.tour_date,
        customer_name=payload.customer_name,
        email=payload.email,
        whatsapp=payload.whatsapp,
        hotel_or_pickup=payload.hotel_or_pickup,
        adults=payload.adults,
        children=payload.children,
        language=payload.language,
        special_requests=payload.special_requests,
        source=payload.source,
    )
    conn = connect()
    conn.execute(
        """
        INSERT INTO bookings (
            booking_id, created_at, updated_at, tour_id, tour_title, tour_date, customer_name,
            email, whatsapp, hotel_or_pickup, adults, children, language, special_requests,
            source, status, assigned_operator, pickup_time, deposit_status, payment_reference,
            internal_notes, evidence_id, lineage_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            booking.booking_id,
            booking.created_at.isoformat(),
            booking.updated_at.isoformat(),
            booking.tour_id,
            booking.tour_title,
            booking.tour_date.isoformat(),
            booking.customer_name,
            booking.email,
            booking.whatsapp,
            booking.hotel_or_pickup,
            booking.adults,
            booking.children,
            booking.language,
            booking.special_requests,
            booking.source,
            booking.status.value,
            booking.assigned_operator,
            booking.pickup_time,
            booking.deposit_status,
            booking.payment_reference,
            booking.internal_notes,
            booking.evidence_id,
            booking.lineage_hash,
        ),
    )
    insert_event(
        conn,
        booking_id=booking.booking_id,
        from_status=None,
        to_status=BookingStatus.NEW_REQUEST,
        actor="public-form",
        note="Booking request received",
        evidence=[
            f"tour:{booking.tour_id}",
            f"date:{booking.tour_date.isoformat()}",
            f"customer:{booking.customer_name}",
            f"pickup:{booking.hotel_or_pickup}",
        ],
    )
    conn.commit()
    conn.close()
    return get_booking(booking.booking_id)


def get_booking(booking_id: str) -> Optional[Booking]:
    init_db()
    conn = connect()
    row = conn.execute("SELECT * FROM bookings WHERE booking_id = ?", (booking_id,)).fetchone()
    conn.close()
    return row_to_booking(row) if row else None


def list_bookings(status: Optional[BookingStatus] = None) -> list[Booking]:
    init_db()
    conn = connect()
    if status:
        rows = conn.execute("SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC", (status.value,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM bookings ORDER BY created_at DESC").fetchall()
    conn.close()
    return [row_to_booking(row) for row in rows]


def transition_booking(booking_id: str, payload: BookingTransitionCreate) -> Booking:
    init_db()
    booking = get_booking(booking_id)
    if not booking:
        raise KeyError("booking not found")
    if payload.to_status not in ALLOWED_TRANSITIONS[booking.status]:
        raise ValueError(f"Invalid transition {booking.status.value} -> {payload.to_status.value}")

    now = datetime.utcnow()
    assigned_operator = payload.assigned_operator if payload.assigned_operator is not None else booking.assigned_operator
    pickup_time = payload.pickup_time if payload.pickup_time is not None else booking.pickup_time
    deposit_status = payload.deposit_status if payload.deposit_status is not None else booking.deposit_status
    payment_reference = payload.payment_reference if payload.payment_reference is not None else booking.payment_reference
    internal_notes = payload.internal_notes if payload.internal_notes is not None else booking.internal_notes

    conn = connect()
    conn.execute(
        """
        UPDATE bookings
        SET updated_at = ?, status = ?, assigned_operator = ?, pickup_time = ?,
            deposit_status = ?, payment_reference = ?, internal_notes = ?
        WHERE booking_id = ?
        """,
        (
            now.isoformat(),
            payload.to_status.value,
            assigned_operator,
            pickup_time,
            deposit_status,
            payment_reference,
            internal_notes,
            booking_id,
        ),
    )
    evidence = [
        f"from:{booking.status.value}",
        f"to:{payload.to_status.value}",
        f"actor:{payload.actor}",
    ]
    if assigned_operator:
        evidence.append(f"operator:{assigned_operator}")
    if pickup_time:
        evidence.append(f"pickup_time:{pickup_time}")
    if deposit_status:
        evidence.append(f"deposit:{deposit_status}")
    if payment_reference:
        evidence.append(f"payment_ref:{payment_reference}")

    insert_event(
        conn,
        booking_id=booking_id,
        from_status=booking.status,
        to_status=payload.to_status,
        actor=payload.actor,
        note=payload.note,
        evidence=evidence,
    )
    conn.commit()
    conn.close()
    return get_booking(booking_id)


def replay_booking(booking_id: str) -> BookingReplay:
    booking = get_booking(booking_id)
    if not booking:
        raise KeyError("booking not found")
    conn = connect()
    rows = conn.execute(
        "SELECT * FROM booking_events WHERE booking_id = ? ORDER BY created_at ASC",
        (booking_id,),
    ).fetchall()
    conn.close()
    events = [row_to_event(row) for row in rows]
    return BookingReplay(booking_id=booking_id, booking=booking, events=events, total_events=len(events))


def summary() -> BookingSummary:
    bookings = list_bookings()
    return BookingSummary(
        total_bookings=len(bookings),
        new_requests=len([b for b in bookings if b.status == BookingStatus.NEW_REQUEST]),
        confirmed=len([b for b in bookings if b.status in {BookingStatus.OPERATOR_CONFIRMED, BookingStatus.CUSTOMER_CONFIRMED}]),
        scheduled=len([b for b in bookings if b.status == BookingStatus.TOUR_SCHEDULED]),
        completed=len([b for b in bookings if b.status in {BookingStatus.TOUR_COMPLETED, BookingStatus.REVIEW_REQUESTED}]),
        cancelled=len([b for b in bookings if b.status == BookingStatus.CANCELLED]),
        deposit_paid=len([b for b in bookings if b.deposit_status.upper() == "PAID"]),
    )
