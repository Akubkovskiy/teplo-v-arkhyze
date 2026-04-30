---
source_file: "api\tests\test_booking_requests.py"
type: "rationale"
community: "test_booking_requests.py / House"
location: "L100"
tags:
  - graphify/rationale
  - graphify/INFERRED
  - community/test_booking_requests.py_/_House
---

# Если EASYCAMP_LEAD_URL не задан — лид всё равно сохранён, статус     forwarded_s

## Connections
- [[BookingRequest]] - `uses` [INFERRED]
- [[BookingRequestCreate]] - `uses` [INFERRED]
- [[BookingRequestOut]] - `uses` [INFERRED]
- [[House]] - `uses` [INFERRED]
- [[test_create_lead_when_forward_disabled()]] - `rationale_for` [EXTRACTED]

#graphify/rationale #graphify/INFERRED #community/test_booking_requests.py_/_House