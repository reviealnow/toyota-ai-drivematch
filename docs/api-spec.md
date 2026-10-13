# API

FastAPI OpenAPI UI: `/docs`. Next.js proxies browser `/api` requests to API_URL.

| Endpoint | Input | Output |
| --- | --- | --- |
| GET `/api/health` | None | status and catalog count; checks selected repository |
| GET `/api/vehicles` | None | List of validated vehicle records with field provenance |
| POST `/api/recommendations` | Preferences | Up to three distinct model results, eligibility, violations, score components, weights and explanations |
| POST `/api/tco` | TCOInput | Economic total, annual mean, component totals, cash flow and sensitivity scenarios |

Preferences: current_id, budget (TWD, 0–100m), seats (1–9 including driver),
annual_km (0–200k), usage (urban/highway/family/long/mixed), priority
(price/fuel/space/safety/comfort/performance/maintenance).
Unknown current IDs and invalid fields return 422. No public write endpoints.

TCOInput: mode (buy/keep), purchase_price, current_value, trade_in,
residual_value, annual_km, fuel_efficiency (0 < km/L <= 100), fuel_price,
annual_insurance, annual_tax, annual_maintenance, financing_cost (five-year
interest and fees only), annual_other. Money values are nonnegative and bounded.
NaN/infinity and unknown properties are rejected. Residual cannot exceed starting
value; trade-in cannot exceed purchase price in buy mode. Appreciation/negative
acquisition scenarios are outside this MVP.

API logs method/path/status/duration and a random X-Request-ID. Unexpected errors
return a generic 503 without leaking database credentials or request bodies.
Browser requests time out after 12 seconds and show retry controls where useful.
