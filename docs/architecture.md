# Architecture — Cycle 1

Treat `docs/requirements.md` and `docs/architecture.md` as the project's source of truth. Before changing implementation details, inspect the existing codebase, preserve working functionality, and update the relevant documentation whenever requirements or architecture change.

## Decisions

- Next.js App Router + React + strict TypeScript frontend; plain CSS design tokens
  keep the small interface dependency-light. CSS/SVG charts provide accessible
  cost breakdowns without a chart dependency.
- FastAPI + Pydantic backend is the single authority for ranking and TCO.
  Next.js proxies `/api/*` to the backend; browsers need no cross-origin setup.
- Versioned JSON catalog supports internet-free local operation after installing
  dependencies. PostgreSQL JSONB catalog storage is enabled with `DATABASE_URL`;
  explicit seed/import commands initialize it. Database errors never silently
  fall back to a different catalog.
- Browser localStorage remembers comparison IDs only. No accounts or server-side
  user sessions in Cycle 1. Recommendation results are reproducible from URL
  parameters. TCO input state remains in the page.
- Manual, reviewed ingestion; no autonomous scraper. Fields record source URL,
  retrieval/verification date, market, original units and status. Missing values
  remain missing. Model year and catalog edition are separate.
- API logs request ID, method, path, status and elapsed time, never request bodies.
  Pydantic bounds all numeric inputs; browser requests time out. No LLM or agent
  loop is needed for this deterministic milestone.

## Flow

Browser → Next.js `/api` proxy → FastAPI → catalog repository (JSON or PostgreSQL).
FastAPI pure functions → eligibility → normalized scores → stable ranking.
TCO engine → accounting totals → sensitivity scenarios → accessible UI.

## Cycle 2 agent design boundary

Use LLMs only for grounded language, never catalog facts, scoring or arithmetic.
Context: retrieve verified Taiwan model/trim-specific document chunks, track
source versions, separate transient conversation from consented persistent state.
Loop: observe → plan → retrieve/tool → verify → respond; maximum four iterations,
two transient retries, per-tool timeout and explicit human escalation on diagnosis
or insufficient evidence. Retrieved instructions are untrusted data.
Observability: redact PII, correlate traces, record retrieved chunk IDs, model/tool
versions, tokens, latency, cost and validator outcomes. Replay from versioned inputs.
Evaluation: fixed maintenance questions plus adversarial retrieval tests, citation
coverage, correct abstention, deterministic tool checks, final-output and trajectory
evaluation. Cost: cached verified retrieval and templates first, bounded context,
model routing by measured quality. Reliability: typed tools, permission checks,
idempotency keys for mutations and no automatic service/marketing submission.
These are architecture requirements for future work, not implemented services.
