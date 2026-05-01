"""Proxy to EasyCamp pricing API with in-memory cache.

EasyCamp is the single source of truth for prices. This module:
1. Fetches house prices from EasyCamp /api/houses
2. Caches them in memory (refreshed every 5 minutes)
3. Provides calculate/calendar proxies
4. Falls back to site DB base_price if EasyCamp is unreachable
"""
import logging
import os
import time
from typing import Any

import httpx

logger = logging.getLogger(__name__)

_EASYCAMP_API_BASE = None
_cache: dict[str, Any] = {"houses": [], "ts": 0}
CACHE_TTL = 300


def _api_base() -> str | None:
    global _EASYCAMP_API_BASE
    if _EASYCAMP_API_BASE is None:
        url = (os.environ.get("EASYCAMP_LEAD_URL") or "").strip()
        if url:
            _EASYCAMP_API_BASE = url.rsplit("/api/", 1)[0]
        else:
            _EASYCAMP_API_BASE = ""
    return _EASYCAMP_API_BASE or None


async def fetch_houses() -> list[dict]:
    base = _api_base()
    if not base:
        return []
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(f"{base}/api/houses")
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        logger.warning(f"easycamp_prices.fetch_houses failed: {e}")
    return []


async def refresh_cache() -> None:
    houses = await fetch_houses()
    if houses:
        _cache["houses"] = houses
        _cache["ts"] = time.time()
        logger.debug(f"price cache refreshed: {len(houses)} houses")


def get_cached_houses() -> list[dict]:
    return _cache["houses"]


def cache_age() -> float:
    if _cache["ts"] == 0:
        return float("inf")
    return time.time() - _cache["ts"]


async def get_houses_with_prices() -> list[dict]:
    if cache_age() > CACHE_TTL:
        await refresh_cache()
    return get_cached_houses()


async def calculate_stay(house_id: int, check_in: str, check_out: str) -> dict | None:
    base = _api_base()
    if not base:
        return None
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(
                f"{base}/api/houses/{house_id}/calculate",
                params={"check_in": check_in, "check_out": check_out},
            )
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        logger.warning(f"easycamp_prices.calculate_stay failed: {e}")
    return None


async def price_calendar(house_id: int, days: int = 30) -> list[dict]:
    base = _api_base()
    if not base:
        return []
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r = await client.get(
                f"{base}/api/houses/{house_id}/prices",
                params={"days": days},
            )
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        logger.warning(f"easycamp_prices.price_calendar failed: {e}")
    return []
