"""Site API tests — booking-requests endpoint with EasyCamp forward,
honeypot, and rate-limit."""
from datetime import date, timedelta

import pytest
from fastapi import Depends, FastAPI, Request
from fastapi.testclient import TestClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session as OrmSession
from sqlalchemy.pool import StaticPool

from app import easycamp_forward, main as main_module
from app.database import Base, get_db
from app.models import BookingRequest, House
from app.schemas import BookingRequestCreate, BookingRequestReceipt


def _build_test_app():
    app = FastAPI()
    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    @app.post("/booking-requests", response_model=BookingRequestReceipt)
    @limiter.limit("100/minute")
    async def _route(
        request: Request, payload: BookingRequestCreate, db: OrmSession = Depends(get_db)
    ):
        return await main_module.create_booking_request(request, payload, db)

    return app


@pytest.fixture
def db_session():
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    with Session() as s:
        s.add(
            House(
                id=1,
                name="Forest 34м²",
                slug="forest-34",
                capacity=4,
                base_price=5500,
                short_description="seed",
            )
        )
        s.commit()

    yield Session
    engine.dispose()


@pytest.fixture
def client(db_session):
    app = _build_test_app()

    def override_get_db():
        s = db_session()
        try:
            yield s
        finally:
            s.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def _payload(**overrides):
    base = {
        "house_id": 1,
        "guest_name": "Иван Тестов",
        "guest_phone": "+79991234567",
        "guest_comment": "Дом: Forest | хочу с террасой",
        "check_in": (date.today() + timedelta(days=10)).isoformat(),
        "check_out": (date.today() + timedelta(days=12)).isoformat(),
        "guests_count": 2,
    }
    base.update(overrides)
    return base


@pytest.mark.asyncio
async def test_create_lead_when_forward_disabled(client, db_session, monkeypatch):
    async def fake_forward(payload):
        return easycamp_forward.ForwardResult(status="disabled")

    monkeypatch.setattr(main_module, "forward_lead", fake_forward)

    response = client.post("/booking-requests", json=_payload())
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["status"] == "accepted"
    assert set(data) == {"id", "status"}

    with db_session() as s:
        row = s.query(BookingRequest).first()
        assert row is not None
        assert row.guest_name == "Иван Тестов"
        assert row.forwarded_status == "disabled"


@pytest.mark.asyncio
async def test_create_lead_with_successful_forward(client, db_session, monkeypatch):
    captured = {}

    async def fake_forward(payload):
        captured["payload"] = payload
        return easycamp_forward.ForwardResult(
            status="ok",
            booking_id=42,
            raw_response={"booking_id": 42, "lead_id": 42},
        )

    monkeypatch.setattr(main_module, "forward_lead", fake_forward)

    response = client.post("/booking-requests", json=_payload())
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["status"] == "accepted"
    assert set(data) == {"id", "status"}

    assert captured["payload"]["house_name"] == "Forest 34м²"
    assert captured["payload"]["external_ref"] == str(data["id"])
    assert captured["payload"]["source"] == "website"

    with db_session() as s:
        row = s.query(BookingRequest).first()
        assert row.forwarded_status == "ok"
        assert row.easycamp_booking_id == 42


@pytest.mark.asyncio
async def test_forward_failure_does_not_fail_the_request(client, db_session, monkeypatch):
    async def fake_forward(payload):
        return easycamp_forward.ForwardResult(
            status="error", error="http 500: oops"
        )

    monkeypatch.setattr(main_module, "forward_lead", fake_forward)

    response = client.post("/booking-requests", json=_payload())
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["status"] == "accepted"
    assert set(data) == {"id", "status"}

    with db_session() as s:
        row = s.query(BookingRequest).first()
        assert row.forwarded_status == "error"
        assert "http 500" in (row.forward_error or "")


def test_unknown_house_id_returns_404(client):
    response = client.post(
        "/booking-requests", json=_payload(house_id=9999)
    )
    assert response.status_code == 404


def test_honeypot_discards_submission(client, db_session, monkeypatch):
    async def fake_forward(payload):
        raise AssertionError("forward should not be called for honeypot")

    monkeypatch.setattr(main_module, "forward_lead", fake_forward)

    response = client.post(
        "/booking-requests", json=_payload(website="spam-bot-value")
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 0

    with db_session() as s:
        assert s.query(BookingRequest).count() == 0


def test_public_api_has_no_booking_request_read_route():
    exposed_methods = {
        method
        for route in main_module.app.routes
        if route.path == "/booking-requests/{request_id}"
        for method in route.methods
    }

    assert "GET" not in exposed_methods
