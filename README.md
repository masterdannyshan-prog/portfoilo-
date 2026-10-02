# Darshan's portfolio

A Next.js portfolio for Darshan's product and UI/UX design work. It includes the landing page, Work and Fun projects, About, contact, reusable case-study templates, and a local-only content editor with a guarded GitHub publishing workflow.

## Run locally

```bash
pnpm install
pnpm dev
```

Open the local address printed by Next.js. To check the production build, run `pnpm build`.

On Darshan's Windows PC, Task Scheduler runs `scripts/start-local-preview.ps1` at sign-in so the local preview is available at `http://localhost:3007/`. The task is named `Darshan Portfolio Localhost 3007`; its log is in the ignored `artifacts/local-preview.log` file. This local address works only while that PC is on and signed in.

Editable portfolio content lives in `src/content/` (see its README). Rendering components live in `src/app/` and `src/components/`; local assets live in `public/`. Videos remain under Git LFS through `.gitattributes`.

## Local content editor

On Windows, double-click `Open Portfolio Editor.cmd`. It opens the local-only editor at `http://localhost:3010/admin`. Setup, content editing, case-study creation, publishing, recovery, and media maintenance are documented in `docs/LOCAL-EDITOR.md`; the complete owner handoff is in `docs/FINAL-HANDOFF.md`. Drafting and applying changes locally never pushes or deploys the site; publishing requires a separate validated confirmation in the editor's **Publish** tab.
