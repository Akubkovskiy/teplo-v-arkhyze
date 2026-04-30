---
type: community
cohesion: 0.21
members: 12
---

# main.py / easycamp_forward.py

**Cohesion:** 0.21 - loosely connected
**Members:** 12 nodes

## Members
- [[Forward booking-request lead to EasyCamp `apileads`.  Best-effort ошибки логи]] - rationale - api\app\easycamp_forward.py
- [[ForwardResult]] - code - api\app\easycamp_forward.py
- [[_config()]] - code - api\app\easycamp_forward.py
- [[database.py]] - code - api\app\database.py
- [[easycamp_forward.py]] - code - api\app\easycamp_forward.py
- [[forward_lead()]] - code - api\app\easycamp_forward.py
- [[get_booking_request()]] - code - api\app\main.py
- [[get_db()]] - code - api\app\database.py
- [[health()]] - code - api\app\main.py
- [[list_houses()]] - code - api\app\main.py
- [[main.py]] - code - api\app\main.py
- [[startup()]] - code - api\app\main.py

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/main.py_/_easycamp_forward.py
SORT file.name ASC
```

## Connections to other communities
- 6 edges to [[_COMMUNITY_test_booking_requests.py  House]]

## Top bridge nodes
- [[main.py]] - degree 9, connects to 1 community
- [[forward_lead()]] - degree 4, connects to 1 community
- [[database.py]] - degree 3, connects to 1 community
- [[startup()]] - degree 3, connects to 1 community