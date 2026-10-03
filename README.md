# Darshan's portfolio

A Next.js portfolio for Darshan's product and UI/UX design work. It includes the landing page, Work and Fun projects, About, contact, reusable case-study templates, and a local-only content editor with a guarded GitHub publishing workflow.

## Run locally

```bash
pnpm install
pnpm dev
```

Open the local address printed by Next.js. To check the production build, run `pnpm build`.

The public portfolio is hosted on Vercel and does not need a local server running at sign-in. The old Windows task `Darshan Portfolio Localhost 3007` is disabled. For an optional local site preview, start the dev server manually and open the address it prints; close the terminal when finished. The editor has its own on-demand launcher and port 3010.

Editable portfolio content lives in `src/content/` (see its README). Rendering components live in `src/app/` and `src/components/`; local assets live in `public/`. Videos remain under Git LFS through `.gitattributes`.

## Local content editor

On Windows, double-click `Open Portfolio Editor.cmd`. It opens the local-only editor at `http://localhost:3010/admin`. Setup, content editing, case-study creation, publishing, recovery, and media maintenance are documented in `docs/LOCAL-EDITOR.md`; the complete owner handoff is in `docs/FINAL-HANDOFF.md`. Drafting and applying changes locally never pushes or deploys the site; publishing requires a separate validated confirmation in the editor's **Publish** tab.
