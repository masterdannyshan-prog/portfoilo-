# Darshan's portfolio

A Next.js portfolio for Darshan's product and UI/UX design work. It currently includes the landing page, selected projects, an about section, contact details, and the SiteScope case study. The editor/CMS and additional case studies are planned but are not built yet.

## Run locally

```bash
pnpm install
pnpm dev
```

Open the local address printed by Next.js. To check the production build, run `pnpm build`.

On Darshan's Windows PC, Task Scheduler runs `scripts/start-local-preview.ps1` at sign-in so the local preview is available at `http://localhost:3007/`. The task is named `Darshan Portfolio Localhost 3007`; its log is in the ignored `artifacts/local-preview.log` file. This local address works only while that PC is on and signed in.

Project content lives in `src/data/`, page and section components in `src/app/` and `src/components/`, and local assets in `public/`.
