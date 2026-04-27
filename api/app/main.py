import logging
from datetime import datetime

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from .database import Base, engine, get_db
from .easycamp_forward import forward_lead
from .models import House, BookingRequest
from .schemas import HouseOut, BookingRequestCreate, BookingRequestOut

logger = logging.getLogger(__name__)
app = FastAPI(title="Teplo API", version="0.4.0")


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

    # Seed demo houses for MVP (idempotent)
    db = next(get_db())
    try:
        houses_count = db.query(House).count()
        if houses_count == 0:
            db.add_all(
                [
                    House(
                        name="Домик в лесу 34м²",
                        slug="forest-34",
                        capacity=4,
                        base_price=5500,
                        short_description="Уютный домик в лесу с верандой и видом на горы.",
                    ),
                    House(
                        name="Домик семейный 40м²",
                        slug="family-40",
                        capacity=6,
                        base_price=7500,
                        short_description="Две спальни, зона отдыха и тихая локация рядом с Архызом.",
                    ),
                ]
            )
            db.commit()
    finally:
        db.close()


@app.get("/health")
async def health():
    return {"ok": True}


@app.get("/houses", response_model=list[HouseOut])
def list_houses(db: Session = Depends(get_db)):
    stmt = select(House).order_by(House.id)
    return list(db.execute(stmt).scalars().all())


@app.post("/booking-requests", response_model=BookingRequestOut)
async def create_booking_request(
    payload: BookingRequestCreate, db: Session = Depends(get_db)
):
    """Создаёт локальный лид + best-effort forward в EasyCamp."""
    house: House | None = None
    if payload.house_id:
        house = db.get(House, payload.house_id)
        if not house:
            raise HTTPException(status_code=404, detail="House not found")

    req = BookingRequest(
        house_id=payload.house_id,
        guest_name=payload.guest_name,
        guest_phone=payload.guest_phone,
        guest_comment=payload.guest_comment,
        check_in=payload.check_in,
        check_out=payload.check_out,
        guests_count=payload.guests_count,
        status="new",
        source="website",
    )
    db.add(req)
    db.commit()
    db.refresh(req)

    # Forward в EasyCamp. Не валит ответ при ошибке — лид уже сохранён
    # локально, владелец может найти его в site Postgres и/или
    # ретрай-job (Phase S11) подберёт его позже.
    forward_payload = {
        "guest_name": req.guest_name,
        "guest_phone": req.guest_phone,
        "check_in": req.check_in.isoformat(),
        "check_out": req.check_out.isoformat(),
        "guests_count": req.guests_count,
        "house_name": house.name if house else None,
        "comment": req.guest_comment,
        "source": "website",
        "external_ref": str(req.id),
    }
    result = await forward_lead(forward_payload)

    req.forwarded_status = result.status
    req.forwarded_at = datetime.utcnow()
    if result.status == "ok":
        req.easycamp_booking_id = result.booking_id
        req.forward_error = None
    elif result.status == "error":
        req.forward_error = (result.error or "")[:1000]
    else:
        req.forward_error = None
    db.commit()
    db.refresh(req)

    return req


@app.get("/booking-requests/{request_id}", response_model=BookingRequestOut)
def get_booking_request(request_id: int, db: Session = Depends(get_db)):
    req = db.get(BookingRequest, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Booking request not found")
    return req
