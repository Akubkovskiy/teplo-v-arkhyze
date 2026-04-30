---
type: community
cohesion: 0.17
members: 27
---

# test_booking_requests.py / House

**Cohesion:** 0.17 - loosely connected
**Members:** 27 nodes

## Members
- [[AdminAuditLog]] - code - api\app\models.py
- [[Base]] - code
- [[BaseModel]] - code
- [[BookingRequest]] - code - api\app\models.py
- [[BookingRequestCreate]] - code - api\app\schemas.py
- [[BookingRequestOut]] - code - api\app\schemas.py
- [[Config]] - code - api\app\schemas.py
- [[House]] - code - api\app\models.py
- [[HouseOut]] - code - api\app\schemas.py
- [[Site API tests — booking-requests endpoint with EasyCamp forward.  Mounts the ro]] - rationale - api\tests\test_booking_requests.py
- [[_build_test_app()]] - code - api\tests\test_booking_requests.py
- [[_payload()]] - code - api\tests\test_booking_requests.py
- [[client()]] - code - api\tests\test_booking_requests.py
- [[create_booking_request()]] - code - api\app\main.py
- [[db_session()]] - code - api\tests\test_booking_requests.py
- [[models.py]] - code - api\app\models.py
- [[schemas.py]] - code - api\app\schemas.py
- [[test_booking_requests.py]] - code - api\tests\test_booking_requests.py
- [[test_create_lead_when_forward_disabled()]] - code - api\tests\test_booking_requests.py
- [[test_create_lead_with_successful_forward()]] - code - api\tests\test_booking_requests.py
- [[test_forward_failure_does_not_fail_the_request()]] - code - api\tests\test_booking_requests.py
- [[test_unknown_house_id_returns_404()]] - code - api\tests\test_booking_requests.py
- [[validate_dates()]] - code - api\app\schemas.py
- [[Если EASYCAMP_LEAD_URL не задан — лид всё равно сохранён, статус     forwarded_s]] - rationale - api\tests\test_booking_requests.py
- [[Если EasyCamp ответил ошибкой — site API всё равно возвращает 200,     лид сохра]] - rationale - api\tests\test_booking_requests.py
- [[Минимальный FastAPI app с одним обработчиком, который проксирует     вызов в `ma]] - rationale - api\tests\test_booking_requests.py
- [[Создаёт локальный лид + best-effort forward в EasyCamp.]] - rationale - api\app\main.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/test_booking_requests.py_/_House
SORT file.name ASC
```

## Connections to other communities
- 6 edges to [[_COMMUNITY_main.py  easycamp_forward.py]]

## Top bridge nodes
- [[House]] - degree 9, connects to 1 community
- [[schemas.py]] - degree 6, connects to 1 community
- [[models.py]] - degree 5, connects to 1 community
- [[create_booking_request()]] - degree 4, connects to 1 community