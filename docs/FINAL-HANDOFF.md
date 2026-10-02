# Portfolio CMS — Final Handoff

This portfolio is now managed by a local-only editor. The public Vercel website contains the portfolio but not an accessible admin panel.

## Open the editor

Double-click `Open Portfolio Editor.cmd` in the repository root. It starts the editor privately on this computer and opens:

`http://localhost:3010/admin`

The editor works offline for writing, draft saving, previewing, reviewing, applying local changes, restoring content backups, and auditing uploads. GitHub publishing, deployment checks, and live rollback require internet access.

## Everyday workflow

1. Open the editor.
2. Select Website content, Project cards, or a case study.
3. Edit text, links, images, videos, ordering, or sections.
4. Save Draft.
5. Preview at 375px, 820px, and 1366px.
6. Review the changed fields.
7. Apply the reviewed content locally.
8. Repeat for every related document. A new case study and its generated project card are separate drafts and both must be reviewed.
9. Open Publish, review every changed file, and validate.
10. Enter a commit message, type `PUBLISH`, and publish to GitHub/Vercel.
11. Wait for the Vercel status and verify the live link.

## Where everything is kept

- `src/content/site.json` — navigation, homepage, About, background, tools, education, and contact.
- `src/content/projects.json` — Work and Fun project cards and their order.
- `src/content/case-studies/` — editable case-study documents.
- `public/uploads/` — media added through the editor.
- `public/videos/` — existing production videos managed through Git LFS.
- `.portfolio-drafts/` — ignored local drafts, content backups, media archive, and temporary workflow locks.
- `src/components/` — visual templates; routine content edits should not require changing these files.

## Offline and online behavior

Offline actions:

- Edit content.
- Upload local media into the project.
- Save Draft.
- Preview responsive layouts.
- Review and apply changes locally.
- Restore content backups as drafts.
- Archive or restore unused uploaded media.

Online actions:

- Refresh the GitHub main branch before publishing.
- Push a validated commit.
- Read the Vercel deployment check.
- Push a validated rollback commit.

If internet access fails after a commit is created, the commit stays on the computer. Reopen Publish and retry the push after the connection or GitHub credentials are restored.

## Images and videos

- Keep images reasonably compressed before uploading.
- Use browser-compatible MP4 with H.264 video and AAC audio when possible.
- MP4 files remain under Git LFS through `.gitattributes`.
- Draft references count as active media, protecting unfinished work from cleanup.
- Media cleanup archives unused uploads instead of permanently deleting them.

## Recovery order

Use the least disruptive recovery method first:

1. Restore a content backup as Draft, preview it, then apply it.
2. Restore an archived upload if a referenced image or video was moved.
3. Use live rollback only when an entire deployed commit must be undone.

Live rollback is intentionally unavailable while local files are changed, local commits are unpushed, the branch is behind GitHub, or the current branch is not `main`.

## Security boundaries

- The editor requires development mode, the local-editor flag, localhost access, and a same-origin write request.
- Production `/admin` returns 404.
- Production admin APIs return 403.
- Git commands use argument arrays rather than interpolated shell commands.
- Commit messages cannot inject commands.
- Publishing is limited to `origin/main` and blocks potential secret/key files.
- Validation, publish, restore, cleanup, and rollback operations share a local concurrency lock.

## Troubleshooting

### Editor does not open

Run `npm install` in the project folder, then double-click `Open Portfolio Editor.cmd` again. Confirm no unrelated application is occupying port 3010.

### Validation fails

Read the failed check shown in Publish. Fix or revert the listed local issue, refresh the file inventory, and validate again. A failed validation never pushes.

### GitHub push fails

Check the internet connection and GitHub credentials. If the message says the commit was saved locally, do not recreate the content; retry publishing after the connection is fixed.

### Vercel remains queued

Open the GitHub commit and its Vercel check. The content is already safe in GitHub even while the deployment is pending.

### A new upload is missing

Check Recovery → Media archive. Restore it, confirm its content path still begins with `/uploads/`, then preview again.

## Final rule

Never edit or remove files inside `.portfolio-drafts/` manually unless you have copied the entire folder somewhere safe. Use the editor’s recovery controls wherever possible.
