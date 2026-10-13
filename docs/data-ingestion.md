# Reviewed manual ingestion

The bundled file is a manually transcribed, limited factual snapshot, not a
scraper output. Sources were read on 2026-10-13. Reference navigation patterns
were reviewed on Apple's comparison page; no protected visual assets were copied.
Vehicle illustrations are original generic SVG schematics, labeled as such.

Official sources:
- https://www.honda-taiwan.com.tw/2026CR-V/index.html — VTi-S and S prices,
  displacement, dimensions, seats, fuel economy and selected equipment.
- https://www.toyota.com.tw/showroom/RAV4/ — 豪華 price, fuel and selected equipment.
- https://www.toyota.com.tw/showroom/RAV4/fullsepc.aspx — 豪華 dimensions.
- https://www.toyota.com.tw/showroom/COROLLA_CROSS/ — 豪華 gasoline specification.
- https://www.toyota.com.tw/showroom/CAMRY/ — 尊爵 gasoline specification.

Secondary seat-count sources are linked individually in the seed and UI. They
are marked as external data, not manufacturer verification. TOYOTA model year
is null; no year is inferred from the October catalog edition. Missing warranty,
cargo and dimensions are null, never filled with synthetic specifications.

## Update procedure

1. Read the public source and applicable terms; verify exact market, trim,
   year and effective dates. Do not use login-only/private content.
2. Copy `data/seed/vehicles.json` to a proposed import file and edit reviewed
   fields, retaining source URL, original units, retrieved and verified dates.
   Record a short evidence note. New IDs must be unique and stable.
3. Run `python -m backend.app.import_catalog path/to/proposed.json`. Pydantic
   rejects incomplete provenance, invalid positive numeric fields and duplicates.
4. Review the factual changes, then replace the versioned seed. Run tests.
5. PostgreSQL deployments: set DATABASE_URL and run the same command with
   `--database`. The upsert is transactional and repeatable; no deletions.

Attempts to read the two manufacturers' robots.txt through the browsing tool
returned errors. No automated crawl was attempted. Automated ingestion remains
blocked on a proper access/terms review; manual import does not bypass access
controls. Source websites may change; this application is not a live catalog.
