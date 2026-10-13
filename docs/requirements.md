# Requirements — Cycle 1

Treat `docs/requirements.md` and `docs/architecture.md` as the project's source of truth. Before changing implementation details, inspect the existing codebase, preserve working functionality, and update the relevant documentation whenever requirements or architecture change.

## Scope and acceptance

The user request takes precedence over the broader reference brief in `sysDesign.md`.
The first milestone is a customer entering the homepage, selecting a Honda CR-V,
and comparing it with up to three TOYOTA alternatives. Deliver locally first;
public hosting is a later decision.

- P0: working homepage/navigation; manufacturer/model/year/trim selection;
  current vehicle plus zero to three distinct TOYOTA trims; change/remove columns;
  category filtering and difference highlighting; source/status/date visibility.
- P0: preference wizard with budget, usage, seats, priority, mileage and current
  vehicle; deterministic, explainable top-three models; strict eligibility and
  explicitly ineligible alternatives when no match exists.
- P0: editable five-year TCO, keep-versus-buy accounting, side-by-side totals,
  cost breakdown, low/base/high assumptions, TWD throughout.
- P1: structured manual ingestion with validation and field-level provenance;
  responsive keyboard-accessible zh-TW UI; calculation, ranking and journey tests.

No invented real-world specifications. Unknown model year is selectable as
“未標示（現行型錄）”; catalog publication date is not a model year. Missing
specifications remain null. Operating expenses and residual values are editable
illustrative assumptions, never official estimates. No purchase recommendation
is made from TCO alone.

## Deferred to Cycle 2

AI Service Companion, simulated appointments/maintenance, Smart Lounge, RAG,
LINE, user accounts, lead capture and real service-center integrations. The UI
must identify these as future work, not suggest they already work.

## Constraints

Independent Taiwan-market prototype, no TOYOTA endorsement. No customer PII,
VINs, external AI keys or tracking required. English developer documentation.
Preserve the original design brief. Avoid touching the unrelated parent Git repo.
