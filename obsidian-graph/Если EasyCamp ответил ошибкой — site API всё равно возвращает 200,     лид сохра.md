---
source_file: "api\tests\test_booking_requests.py"
type: "rationale"
community: "test_booking_requests.py / House"
location: "L162"
tags:
  - graphify/rationale
  - graphify/INFERRED
  - community/test_booking_requests.py_/_House
---

# Если EasyCamp ответил ошибкой — site API всё равно возвращает 200,     лид сохра

## Connections
- [[BookingRequest]] - `uses` [INFERRED]
- [[BookingRequestCreate]] - `uses` [INFERRED]
- [[BookingRequestOut]] - `uses` [INFERRED]
- [[House]] - `uses` [INFERRED]
- [[test_forward_failure_does_not_fail_the_request()]] - `rationale_for` [EXTRACTED]

#graphify/rationale #graphify/INFERRED #community/test_booking_requests.py_/_House