"""Site API tests — booking-requests endpoint with EasyCamp forward.

Mounts the route handler onto a fresh FastAPI app instead of importing
`app.main:app`, чтобы не триггерить startup-хук с
`Base.metadata.create_all(bind=engine)` против реального Postgres."""
from datetime import date, timedelta

import pytest
from fastapi import Depends, FastAPI, HTTPException
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session as OrmSession
from sqlalchemy.pool import StaticPool

from app import easycamp_forward, main as main_module
from app.database import Base, get_db
from app.models import BookingRequest, House
from app.schemas import BookingRequestCreate, BookingRequestOut


def _build_test_app():
    """Минимальный FastAPI app с одним обработчиком, который проксирует
    вызов в `main.create_booking_request` — это сохраняет логику
    forward + персистентность, но не таскает FastAPI startup-события.
    """
    app = FastAPI()

    @app.post("/booking-requests", response_model=BookingRequestOut)
    async def _route(
        payload: BookingRequestCreate, db: OrmSession = Depends(get_db)
    ):
        return await main_module.create_booking_request(payload, db)

    return app


@pytest.fixture
def db_session():
    # StaticPool + check_same_thread=False — единственное соединение,
    # переиспользуется всеми сессиями. Без него каждая сессия создаёт
    # свою in-memory БД и не видит созданные таблицы.
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
    """Если EASYCAMP_LEAD_URL не задан — лид всё равно сохранён, статус
    forwarded_status='disabled'."""

    async def fake_forward(payload):
        return easycamp_forward.ForwardResult(status="disabled")

    monkeypatch.setattr(easycamp_forward, "forward_lead", fake_forward)
    # main.py делает `from .easycamp_forward import forward_lead` — это
    # привязка по имени, нужно патчить и в main module.
    from app import main as main_module

    monkeypatch.setattr(main_module, "forward_lead", fake_forward)

    response = client.post("/booking-requests", json=_payload())
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["status"] == "new"
    assert data["forwarded_status"] == "disabled"
    assert data["easycamp_booking_id"] is None

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

    from app import main as main_module

    monkeypatch.setattr(main_module, "forward_lead", fake_forward)

    response = client.post("/booking-requests", json=_payload())
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["forwarded_status"] == "ok"
    assert data["easycamp_booking_id"] == 42

    # forward вызван с правильным payload-ом, включая house_name
    assert captured["payload"]["house_name"] == "Forest 34м²"
    assert captured["payload"]["external_ref"] == str(data["id"])
    assert captured["payload"]["source"] == "website"

    with db_session() as s:
        row = s.query(BookingRequest).first()
        assert row.forwarded_status == "ok"
        assert row.easycamp_booking_id == 42


@pytest.mark.asyncio
async def test_forward_failure_does_not_fail_the_request(client, db_session, monkeypatch):
    """Если EasyCamp ответил ошибкой — site API всё равно возвращает 200,
    лид сохранён локально с forwarded_status='error' и forward_error."""

    async def fake_forward(payload):
        return easycamp_forward.ForwardResult(
            status="error", error="http 500: oops"
        )

    from app import main as main_module

    monkeypatch.setattr(main_module, "forward_lead", fake_forward)

    response = client.post("/booking-requests", json=_payload())
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["status"] == "new"
    assert data["forwarded_status"] == "error"

    with db_session() as s:
        row = s.query(BookingRequest).first()
        assert row.forwarded_status == "error"
        assert "http 500" in (row.forward_error or "")


def test_unknown_house_id_returns_404(client):
    response = client.post(
        "/booking-requests", json=_payload(house_id=9999)
    )
    assert response.status_code == 404
