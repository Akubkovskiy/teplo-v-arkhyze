"""Forward booking-request lead to EasyCamp `/api/leads`.

Best-effort: ошибки логируются и возвращаются как структура, но не
выкидывают исключение. Сервис намеренно не падает, если EasyCamp
недоступен — лид всё равно сохранён локально.

Активация: env-переменные `EASYCAMP_LEAD_URL` и `EASYCAMP_LEAD_TOKEN`.
Если хотя бы одна пуста — forward отключён, статус `disabled`.
"""
import logging
import os
from dataclasses import dataclass
from typing import Any

import httpx

logger = logging.getLogger(__name__)


@dataclass
class ForwardResult:
    status: str  # ok | error | disabled
    booking_id: int | None = None
    error: str | None = None
    http_status: int | None = None
    raw_response: dict[str, Any] | None = None


def _config() -> tuple[str | None, str | None, float]:
    url = (os.environ.get("EASYCAMP_LEAD_URL") or "").strip() or None
    token = (os.environ.get("EASYCAMP_LEAD_TOKEN") or "").strip() or None
    timeout = float(os.environ.get("EASYCAMP_LEAD_TIMEOUT_SECONDS") or "5")
    return url, token, timeout


async def forward_lead(payload: dict[str, Any]) -> ForwardResult:
    url, token, timeout = _config()
    if not url or not token:
        return ForwardResult(status="disabled")

    headers = {
        "Content-Type": "application/json",
        "X-Site-Token": token,
    }
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(url, json=payload, headers=headers)
    except httpx.HTTPError as e:
        logger.warning(f"forward_lead network error: {e}")
        return ForwardResult(status="error", error=f"network: {e}")
    except Exception as e:
        logger.error(f"forward_lead unexpected error: {e}", exc_info=True)
        return ForwardResult(status="error", error=f"unexpected: {e}")

    if response.status_code >= 400:
        logger.warning(
            f"forward_lead got {response.status_code}: {response.text[:500]}"
        )
        return ForwardResult(
            status="error",
            error=f"http {response.status_code}: {response.text[:200]}",
            http_status=response.status_code,
        )

    try:
        data = response.json()
    except Exception:
        data = {}

    booking_id = data.get("booking_id") if isinstance(data, dict) else None
    return ForwardResult(status="ok", booking_id=booking_id, raw_response=data)
