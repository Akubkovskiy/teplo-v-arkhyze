"""Pytest setup for site API tests.

Uses in-memory SQLite + FastAPI TestClient. Overrides `get_db` to
isolate test session, monkey-patches `easycamp_forward.forward_lead`
so we don't call out to a real EasyCamp instance.
"""
import os
import sys
from pathlib import Path

# Test-friendly defaults
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("APP_ENV", "test")
# По умолчанию форвард отключаем; тесты, которым он нужен, переустановят.
os.environ.pop("EASYCAMP_LEAD_URL", None)
os.environ.pop("EASYCAMP_LEAD_TOKEN", None)

# Ensure `api/` is on sys.path so `from app.main import app` works when
# pytest runs from the repo root.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
