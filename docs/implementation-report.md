# Cycle 1 implementation report

Date: 2026-10-13. Original source brief preserved in `sysDesign.md`; user-requested
Cycle 1 priorities take precedence over its full-ecosystem scope.

## Completed

- Next.js/React/TypeScript UI and FastAPI/Pydantic API.
- Functional homepage, cascading brand/model/year/trim selectors, current vehicle
  plus up to three TOYOTA alternatives, editable/removable columns, categories,
  differences, individual source links and browser-local comparison persistence.
- Three-step recommendation wizard, constraint handling, normalized deterministic
  scores, explanations, estimate disclosure and editable retained preferences.
- Five-year TCO with shared driving assumptions, per-car input editing, cost chart,
  line items, low/base/high sensitivities, keep/buy modes and separate cash flows.
- Structured catalog validation/import, field-level source metadata and unknowns.
- PostgreSQL repository mode, transactional idempotent seed upsert, Dockerfiles
  and health-gated Compose configuration.
- Documentation and root AGENTS.md source-of-truth guidance.

## Executed verification

| Check | Result |
| --- | --- |
| `python3 -m pytest backend/tests -q` | 21 passed |
| `python3 -m backend.app.import_catalog` | 5 records validated |
| `npm run typecheck` | Passed |
| Production Next.js build | Passed; six application routes generated |
| Playwright against production build | 12 passed: six flows × desktop/mobile |
| `docker compose config --quiet` | Passed |
| Dependency installation audit | 0 vulnerabilities reported by npm |
| Screenshot inspection | Homepage desktop and comparison mobile inspected; SVG path corrected |

Browser tests exercise the CR-V journey, adding/removing three alternatives,
source expansion, difference filtering, persisted selections, seven-seat rejection,
live TCO updates/invalid residuals, responsive viewport containment, retained
wizard preferences and recovery from a simulated API outage. Chrome mobile
emulation is not verification on physical iOS Safari.

Screenshots are generated under ignored `artifacts/`: home-desktop.png,
home-mobile.png, compare-desktop.png and compare-mobile.png.
The reviewed desktop homepage and comparison captures are also committed under
`docs/screenshots/` and embedded at the top of README.md for GitHub viewing.

## Partial / unverified

- Docker daemon is stopped on this machine. Compose syntax is validated, but
  container builds/startup and PostgreSQL-backed integration have not been run.
- Source coverage is intentionally limited: four models/five trims, only Honda
  has a confirmed model year. Some seat counts are cited third-party data.
- Cargo, warranty and some dimension fields remain null. No automatic refresh.
- Manual import validation is implemented; autonomous scraping is deferred until
  access restrictions and terms can be reviewed. robots.txt fetch attempts failed.
- Comfort, safety quality, performance and maintenance rankings lack comparable
  verified inputs; the UI explicitly discloses fallback to supported metrics.
- TCO operating costs and resale values are examples, not forecasts or tax advice.

## Next milestone

Validate the comparison MVP with users, expand verified trim/year data and run
Docker/PostgreSQL integration. Only then add the Cycle 2 service companion,
synthetic appointments, Smart Lounge, grounded RAG and optional LINE integration.
Agent context, bounded loops, traceability, evaluation and guardrail requirements
are specified in architecture.md; no LLM service is represented as implemented.
