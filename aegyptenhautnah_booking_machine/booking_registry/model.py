from datetime import date, datetime
from enum import Enum
from typing import Optional
from uuid import uuid4

from pydantic import BaseModel, Field, validator


class BookingStatus(str, Enum):
    NEW_REQUEST = "NEW_REQUEST"
    OPERATOR_CONFIRMED = "OPERATOR_CONFIRMED"
    CUSTOMER_CONFIRMED = "CUSTOMER_CONFIRMED"
    DEPOSIT_PAID = "DEPOSIT_PAID"
    TOUR_SCHEDULED = "TOUR_SCHEDULED"
    TOUR_COMPLETED = "TOUR_COMPLETED"
    REVIEW_REQUESTED = "REVIEW_REQUESTED"
    CANCELLED = "CANCELLED"


class Tour(BaseModel):
    tour_id: str
    category: str
    title: str
    short_description: str
    duration: str
    location: str
    base_price_eur: float
    language: str = "Deutsch"
    is_private_available: bool = True
    is_active: bool = True


class BookingCreate(BaseModel):
    tour_id: str
    tour_date: date
    customer_name: str = Field(..., min_length=2)
    email: Optional[str] = None
    whatsapp: str = Field(..., min_length=5)
    hotel_or_pickup: str = Field(..., min_length=2)
    adults: int = Field(default=2, ge=1, le=40)
    children: int = Field(default=0, ge=0, le=40)
    language: str = "de"
    special_requests: Optional[str] = None
    source: str = "booking-machine"

    @validator("whatsapp", "hotel_or_pickup", "customer_name", pre=True)
    def strip_required_text(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value


class Booking(BaseModel):
    booking_id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    tour_id: str
    tour_title: str
    tour_date: date
    customer_name: str
    email: Optional[str] = None
    whatsapp: str
    hotel_or_pickup: str
    adults: int
    children: int = 0
    language: str = "de"
    special_requests: Optional[str] = None
    source: str = "booking-machine"
    status: BookingStatus = BookingStatus.NEW_REQUEST
    assigned_operator: Optional[str] = None
    pickup_time: Optional[str] = None
    deposit_status: str = "UNPAID"
    payment_reference: Optional[str] = None
    internal_notes: Optional[str] = None
    evidence_id: Optional[str] = None
    lineage_hash: Optional[str] = None


class BookingTransitionCreate(BaseModel):
    to_status: BookingStatus
    actor: str = "admin"
    note: Optional[str] = None
    assigned_operator: Optional[str] = None
    pickup_time: Optional[str] = None
    deposit_status: Optional[str] = None
    payment_reference: Optional[str] = None
    internal_notes: Optional[str] = None


class BookingEvent(BaseModel):
    event_id: str
    booking_id: str
    created_at: datetime
    from_status: Optional[BookingStatus]
    to_status: BookingStatus
    actor: str
    note: Optional[str] = None
    evidence: list[str] = Field(default_factory=list)
    parent_event_id: Optional[str] = None
    lineage_hash: str


class BookingReplay(BaseModel):
    booking_id: str
    booking: Booking
    events: list[BookingEvent]
    total_events: int


class BookingSummary(BaseModel):
    total_bookings: int
    new_requests: int
    confirmed: int
    scheduled: int
    completed: int
    cancelled: int
    deposit_paid: int
