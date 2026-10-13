# Catalog storage

Cycle 1 uses an intentionally small PostgreSQL catalog table. Vehicle identities
are first-class records; variable specification fields and their provenance are
stored in validated JSONB to preserve missing-value metadata through imports.

```sql
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Payload: id, brand, model, year (nullable), trim, edition, body, specs.
Spec: value (nullable), unit, status (verified/estimated/missing), source_url,
retrieved_at, verified_at, market (TW), note. Numeric source units are preserved.
The HTTP/JSON representation is identical in JSON and PostgreSQL modes.

`python -m backend.app.import_catalog --database` validates the complete source
before opening a transaction, creates the table if needed, and upserts all rows.
Repeated imports update existing IDs, not duplicate them. It does not delete
records missing from a later file. Review explicit deletion separately.
Runtime reads revalidate all rows. Database connection errors fail visibly.

No user data is stored in PostgreSQL in Cycle 1. Generations, price history,
appointments, recommendation sessions and service knowledge documents should get
separate relational tables when Cycle 2 introduces those lifecycle requirements.
