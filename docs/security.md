# Security and privacy scope

The demo accepts no VIN, identity, phone, payment or customer service records.
API inputs are Pydantic validated, bounded and reject unknown fields. Source
URLs must be HTTP(S); React escapes source text. Database operations use bound
parameters. Logs exclude payloads and credentials and include request correlation.
No AI endpoint exists yet; AI-specific rate limits and prompt-injection tests
belong to Cycle 2, as specified in architecture.md.

Only comparison IDs are stored locally. Recommendation preferences are included
in the results URL; the about page discloses that sharing the URL shares them.
No marketing/tracking integration is present. The public API is read/calculation
only; manual catalog ingestion is a local administrative command.

Production hardening before public hosting: TLS, reverse proxy request/body
limits and rate limits, restricted catalog administration, secret rotation,
image scanning and dependency updates. Docker credentials in the example are
explicitly local demo values; replace them for any shared environment.
