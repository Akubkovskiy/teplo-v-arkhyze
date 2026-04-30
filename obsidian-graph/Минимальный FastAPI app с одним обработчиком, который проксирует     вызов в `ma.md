---
source_file: "api\tests\test_booking_requests.py"
type: "rationale"
community: "test_booking_requests.py / House"
location: "L22"
tags:
  - graphify/rationale
  - graphify/INFERRED
  - community/test_booking_requests.py_/_House
---

# Минимальный FastAPI app с одним обработчиком, который проксирует     вызов в `ma

## Connections
- [[BookingRequest]] - `uses` [INFERRED]
- [[BookingRequestCreate]] - `uses` [INFERRED]
- [[BookingRequestOut]] - `uses` [INFERRED]
- [[House]] - `uses` [INFERRED]
- [[_build_test_app()]] - `rationale_for` [EXTRACTED]

#graphify/rationale #graphify/INFERRED #community/test_booking_requests.py_/_House