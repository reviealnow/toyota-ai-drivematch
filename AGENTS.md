# Project guidance

Treat `docs/requirements.md` and `docs/architecture.md` as the project's source of truth. Before changing implementation details, inspect the existing codebase, preserve working functionality, and update the relevant documentation whenever requirements or architecture change.

- Cycle 1 is the current scope. Consult requirements before adding Cycle 2 AI features.
- Customer UI is Traditional Chinese; developer documentation is English.
- Never invent vehicle specifications or infer model year from catalog date.
- Keep calculation and ranking authority in the Python backend.
- Run relevant backend tests and frontend type checks after business logic edits.
- Preserve `sysDesign.md` as the original reference brief.
