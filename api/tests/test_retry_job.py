"""Tests for the retry-job that re-forwards failed booking requests."""
from datetime import datetime, timedelta

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.models import BookingRequest, House
from app import easycamp_forward, retry_job as retry_module


@pytest.fixture
def db_session(monkeypatch):
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    with Session() as s:
        s.add(House(id=1, name="Forest", slug="forest", capacity=4, base_price=5000, short_description="t"))
        s.commit()

    monkeypatch.setattr(retry_module, "SessionLocal", Session)
    yield Session
    engine.dispose()


def _insert_failed_request(Session, *, retry_count=0, hours_ago=1):
    with Session() as s:
        req = BookingRequest(
            house_id=1,
            guest_name="Retry Test",
            guest_phone="+79990000000",
            guest_comment="retry test",
            check_in=datetime.utcnow().date() + timedelta(days=30),
            check_out=datetime.utcnow().date() + timedelta(days=32),
            guests_count=2,
            status="new",
            source="website",
            created_at=datetime.utcnow() - timedelta(hours=hours_ago),
            forwarded_status="error",
            forward_error=f"http 500: down retry#{retry_count}" if retry_count else "http 500: down",
        )
        s.add(req)
        s.commit()
        return req.id


@pytest.mark.asyncio
async def test_retry_succeeds(db_session, monkeypatch):
    req_id = _insert_failed_request(db_session)

    async def fake_forward(payload):
        return easycamp_forward.ForwardResult(status="ok", booking_id=99)

    monkeypatch.setattr(retry_module, "forward_lead", fake_forward)

    await retry_module.retry_failed_forwards()

    with db_session() as s:
        req = s.get(BookingRequest, req_id)
        assert req.forwarded_status == "ok"
        assert req.easycamp_booking_id == 99


@pytest.mark.asyncio
async def test_retry_still_failing(db_session, monkeypatch):
    req_id = _insert_failed_request(db_session)

    async def fake_forward(payload):
        return easycamp_forward.ForwardResult(status="error", error="http 503: still down")

    monkeypatch.setattr(retry_module, "forward_lead", fake_forward)

    await retry_module.retry_failed_forwards()

    with db_session() as s:
        req = s.get(BookingRequest, req_id)
        assert req.forwarded_status == "error"
        assert "retry#1" in req.forward_error


@pytest.mark.asyncio
async def test_retry_abandoned_after_max(db_session, monkeypatch):
    req_id = _insert_failed_request(db_session, retry_count=3)

    async def fake_forward(payload):
        raise AssertionError("should not be called for abandoned")

    monkeypatch.setattr(retry_module, "forward_lead", fake_forward)

    await retry_module.retry_failed_forwards()

    with db_session() as s:
        req = s.get(BookingRequest, req_id)
        assert req.forwarded_status == "abandoned"
        assert "abandoned" in req.forward_error


@pytest.mark.asyncio
async def test_retry_skips_old_requests(db_session, monkeypatch):
    _insert_failed_request(db_session, hours_ago=25)

    call_count = 0

    async def fake_forward(payload):
        nonlocal call_count
        call_count += 1
        return easycamp_forward.ForwardResult(status="ok", booking_id=1)

    monkeypatch.setattr(retry_module, "forward_lead", fake_forward)

    await retry_module.retry_failed_forwards()

    assert call_count == 0
