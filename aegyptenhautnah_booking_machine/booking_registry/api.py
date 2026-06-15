from typing import Optional

from fastapi import Body, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware

from .db import (
    create_booking,
    get_booking,
    init_db,
    list_bookings,
    list_tours,
    replay_booking,
    summary,
    transition_booking,
)
from .model import Booking, BookingCreate, BookingReplay, BookingStatus, BookingSummary, BookingTransitionCreate, Tour

app = FastAPI(title="Ägypten Hautnah Booking Machine", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok", "service": "aegypten-hautnah-booking-machine"}


@app.get("/tours", response_model=list[Tour])
def read_tours():
    return list_tours()


@app.post("/bookings", response_model=Booking, status_code=status.HTTP_201_CREATED)
def create_public_booking(payload: BookingCreate = Body(...)):
    try:
        return create_booking(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/bookings", response_model=list[Booking])
def read_bookings(status_filter: Optional[BookingStatus] = Query(default=None, alias="status")):
    return list_bookings(status_filter)


@app.get("/bookings/{booking_id}", response_model=Booking)
def read_booking(booking_id: str):
    booking = get_booking(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@app.post("/bookings/{booking_id}/transition", response_model=Booking)
def transition(booking_id: str, payload: BookingTransitionCreate = Body(...)):
    try:
        return transition_booking(booking_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@app.get("/bookings/{booking_id}/replay", response_model=BookingReplay)
def replay(booking_id: str):
    try:
        return replay_booking(booking_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/admin/summary", response_model=BookingSummary)
def read_summary():
    return summary()
