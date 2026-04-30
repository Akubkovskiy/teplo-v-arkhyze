---
source_file: "api\app\main.py"
type: "rationale"
community: "test_booking_requests.py / House"
location: "L64"
tags:
  - graphify/rationale
  - graphify/INFERRED
  - community/test_booking_requests.py_/_House
---

# Создаёт локальный лид + best-effort forward в EasyCamp.

## Connections
- [[BookingRequest]] - `uses` [INFERRED]
- [[BookingRequestCreate]] - `uses` [INFERRED]
- [[BookingRequestOut]] - `uses` [INFERRED]
- [[House]] - `uses` [INFERRED]
- [[HouseOut]] - `uses` [INFERRED]
- [[create_booking_request()]] - `rationale_for` [EXTRACTED]

#graphify/rationale #graphify/INFERRED #community/test_booking_requests.py_/_House