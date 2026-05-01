import logging
from contextlib import asynccontextmanager
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, Depends, HTTPException, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session
from sqlalchemy import select

from .database import get_db
from .easycamp_forward import forward_lead
from .models import House, BookingRequest
from .retry_job import retry_failed_forwards
from .schemas import HouseOut, BookingRequestCreate, BookingRequestOut

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app):
    db = next(get_db())
    try:
        seed_houses = [
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
            House(
                name="Компактный домик 32м²",
                slug="compact-32",
                capacity=3,
                base_price=4500,
                short_description="Уютный домик для двоих-троих с видом на лес и горы.",
            ),
        ]
        existing_slugs = {s for (s,) in db.query(House.slug).all()}
        new_houses = [h for h in seed_houses if h.slug not in existing_slugs]
        if new_houses:
            db.add_all(new_houses)
            db.commit()
    finally:
        db.close()

    scheduler = AsyncIOScheduler()
    scheduler.add_job(retry_failed_forwards, "interval", seconds=300, id="retry_forwards")
    scheduler.start()
    logger.info("retry_forwards job scheduled (every 300s)")

    yield

    scheduler.shutdown(wait=False)


app = FastAPI(title="Teplo API", version="0.5.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.get("/health")
async def health():
    return {"ok": True}


@app.get("/houses", response_model=list[HouseOut])
@limiter.limit("30/minute")
def list_houses(request: Request, db: Session = Depends(get_db)):
    stmt = select(House).order_by(House.id)
    return list(db.execute(stmt).scalars().all())


@app.post("/booking-requests", response_model=BookingRequestOut)
@limiter.limit("5/minute")
async def create_booking_request(
    request: Request, payload: BookingRequestCreate, db: Session = Depends(get_db)
):
    """Создаёт локальный лид + best-effort forward в EasyCamp."""
    if payload.website:
        logger.info("honeypot triggered, discarding submission")
        return BookingRequestOut(
            id=0, house_id=payload.house_id, guest_name=payload.guest_name,
            guest_phone=payload.guest_phone, guest_comment=payload.guest_comment,
            check_in=payload.check_in, check_out=payload.check_out,
            guests_count=payload.guests_count, status="new", source="website",
            created_at=datetime.utcnow(),
        )

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

    forward_payload = {
        "guest_name": req.guest_name,
        "guest_phone": req.guest_phone,
        "check_in": req.check_in.isoformat(),
        "check_out": req.check_out.isoformat(),
        "guests_count": req.guests_count,
        "house_id": req.house_id,
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
