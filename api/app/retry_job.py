"""Retry failed booking-request forwards to EasyCamp.

Runs as a periodic job inside the site API process (APScheduler).
Picks up BookingRequests with forwarded_status='error' created within
the last 24 hours, retries the forward, and marks them 'abandoned'
after MAX_RETRIES failures.
"""
import logging
import os
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import SessionLocal
from .easycamp_forward import forward_lead
from .models import BookingRequest, House

logger = logging.getLogger(__name__)

MAX_RETRIES = 3
LOOKBACK_HOURS = 24


def _build_payload(req: BookingRequest, house: House | None) -> dict:
    return {
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


def _count_retries(req: BookingRequest) -> int:
    err = req.forward_error or ""
    if "retry#" in err:
        try:
            return int(err.split("retry#")[-1].split()[0])
        except (ValueError, IndexError):
            pass
    return 0


async def retry_failed_forwards():
    if os.environ.get("RETRY_JOB_ENABLED", "1") == "0":
        return

    db: Session = SessionLocal()
    try:
        cutoff = datetime.utcnow() - timedelta(hours=LOOKBACK_HOURS)
        stmt = (
            select(BookingRequest)
            .where(BookingRequest.forwarded_status == "error")
            .where(BookingRequest.created_at >= cutoff)
            .order_by(BookingRequest.id)
        )
        failed = list(db.execute(stmt).scalars().all())
        if not failed:
            return

        logger.info(f"retry_job: {len(failed)} failed forwards to retry")

        for req in failed:
            retry_count = _count_retries(req) + 1
            if retry_count > MAX_RETRIES:
                req.forwarded_status = "abandoned"
                req.forward_error = f"{req.forward_error or ''} | abandoned after {MAX_RETRIES} retries"
                logger.warning(f"retry_job: abandoned BookingRequest#{req.id} after {MAX_RETRIES} retries")
                db.commit()
                continue

            house = db.get(House, req.house_id) if req.house_id else None
            payload = _build_payload(req, house)
            result = await forward_lead(payload)

            req.forwarded_at = datetime.utcnow()
            if result.status == "ok":
                req.forwarded_status = "ok"
                req.easycamp_booking_id = result.booking_id
                req.forward_error = None
                logger.info(f"retry_job: BookingRequest#{req.id} forwarded OK on retry#{retry_count}")
            elif result.status == "disabled":
                pass
            else:
                req.forward_error = f"{(result.error or '')[:500]} retry#{retry_count}"
                logger.warning(f"retry_job: BookingRequest#{req.id} still failing: {result.error}")
            db.commit()
    except Exception:
        logger.exception("retry_job: unexpected error")
        db.rollback()
    finally:
        db.close()
