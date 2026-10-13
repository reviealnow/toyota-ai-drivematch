# Deployment

## Local executable application

Use the two-terminal instructions in README.md. The environment currently uses
ports 3100 and 8100 because another process occupies port 8000.

## Local production build

```sh
cd frontend
API_URL=http://127.0.0.1:8100 npm run build
API_URL=http://127.0.0.1:8100 npm run start -- --port 3100
```

The Next.js rewrite destination is incorporated during build; set API_URL in
both the build and runtime environment. Do not point a production browser at a
remote machine's localhost. The frontend and API must both be reachable by the
Next.js server. No browser CORS exception is needed.

## Containers

Run `docker compose up --build` from the project root. PostgreSQL health gating
and a one-shot idempotent seed service precede the API and frontend. Source and
seed are included in the backend image; the frontend uses npm ci and a production
Next.js build. All services support Apple Silicon through upstream multiarch
images. The compose file binds host ports to loopback for local use.

## Future public deployment

No public deployment was requested for this milestone. A VPS can run the compose
stack behind a TLS reverse proxy after configuring secrets and access controls.
A separate frontend host must build with the externally reachable backend URL.
The pure Python API cannot run as a Cloudflare Worker; keep this architecture
rather than silently substituting a different runtime for publication.

The private GitHub repository is https://github.com/reviealnow/toyota-ai-drivematch.
This project is an independent local Git repository on branch `codex/mvp`; the
unrelated parent Documents repository is not used. The initial restricted-network
auth check failed, but authentication succeeded with permitted network access.
