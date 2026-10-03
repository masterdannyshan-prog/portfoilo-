# Local Portfolio Editor

The editor runs only on this computer and is intentionally unavailable on the deployed website.

## First-time setup

1. Install the current Node.js LTS version if Node.js is not already installed.
2. Open PowerShell in this project folder.
3. Run `npm install` once.
4. Double-click **Open Portfolio Editor.cmd** in the project folder.

The launcher starts a private development server and opens:

`http://localhost:3010/admin`

The separate portfolio preview on port 3007 is optional and does not need to run for editing or for the live Vercel site. The editor binds only to this computer at `127.0.0.1` and uses its own build folder and port.

## Editing workflow

1. Choose **Website content**, **Project cards**, or a case study from the left navigation.
2. Edit fields. For ordered lists, use the up/down controls. Duplicate an item to create another card or section with the same structure.
3. For an image, video, or resume/media path, paste an existing public path or choose **Upload**. Uploaded files are copied into `public/uploads/`.
4. Select **Save draft**. Drafts are stored in the ignored `.portfolio-drafts/` directory and do not affect the portfolio files.
5. Select **Preview** and switch among phone (375px), tablet (820px), and desktop (1366px). The preview renders the real portfolio templates.
6. Open **Review** to see which fields changed.
7. Check the review confirmation and choose **Apply reviewed changes locally**.

Applying reviewed changes updates the matching JSON file in `src/content/`. A recoverable copy of its previous contents is saved under `.portfolio-drafts/backups/`.

## Creating a project and case study

1. Choose **New case study** in the editor sidebar.
2. Enter the project title, confirm its URL slug, and choose whether its card belongs in **Work** or **Fun**.
3. Choose **Create drafts**. The editor creates two local drafts: a reusable case-study document and a linked project card. Neither is applied automatically.
4. Edit the new case study. The starter structure includes Overview, My Role, Problem, Research and Product Direction, Design Process, UX Decisions, Final Designs, and Limitations and Next Steps. Sections and media can be reordered, duplicated, or removed.
5. Upload or select a hero image/video and any section media, then check phone, tablet, and desktop Preview.
6. Review and apply the case-study document.
7. Open **Project cards**, review the generated card, adjust its thumbnail, metadata, order, or label, then preview and apply that document too.

The finished card links to `/projects/your-slug`. A newly applied case study uses the same established portfolio header, chapter navigation, section typography, media treatment, and footer as the current case studies. Existing SiteScope and Ghost Frame pages keep their current custom templates.

## Publishing to the live website

“Apply reviewed changes locally” still does not use the internet or change the live site. When all edited documents have been reviewed and applied:

1. Open the editor’s **Publish** tab.
2. Review every changed file. The publish operation includes exactly the files shown in this list, including uploaded images or Git LFS videos.
3. Choose **Validate for publishing**. The editor checks the patch, Git LFS, ESLint, TypeScript, and a complete production build. Validation does not commit, push, or deploy.
4. After validation passes, enter a short Git commit message.
5. Type `PUBLISH` in the confirmation field.
6. Choose **Publish to GitHub and Vercel**.

The editor creates a Git commit, pushes the connected `main` branch to `origin`, and then checks for the Vercel deployment result exposed through GitHub. GitHub and Vercel remain the source of the online deployment; the editor does not upload directly to Vercel.

Publishing requires an internet connection and the computer’s existing GitHub credentials. If the push fails after the commit is created, the commit stays safely on this computer. Reopen the Publish tab and retry when the connection or credentials are available.

The live portfolio remains available at `https://portfoilo-livid-six.vercel.app/`. The production website cannot open or call the local editor endpoints.

## Recovery and maintenance

Open the editor’s **Recovery** tab for the final safety tools:

- **Content backups:** Every applied content document saves its previous version under `.portfolio-drafts/backups/`. Restoring a backup creates a new Draft; it never overwrites the current content immediately. Preview, review, and apply it through the normal workflow.
- **Media health:** The editor scans `public/uploads/` against published content and saved drafts. An upload is marked unused only when neither location references it.
- **Media archive:** Confirming `ARCHIVE` moves unused uploads into `.portfolio-drafts/media-trash/`. Files are not deleted and can be restored to their original paths from the same screen.
- **Live rollback:** When `main` is clean and synchronized with GitHub, confirming `ROLLBACK` prepares the inverse of the latest commit, validates the resulting site, commits the restoration, and pushes it. GitHub history stays intact and Vercel deploys the rollback normally.

Only use live rollback when the latest deployed commit is the version you want to undo. If there are local edits, review or publish them first; rollback deliberately remains locked while the working tree is dirty.

## Media and videos

- Images and videos can be uploaded from their corresponding path field.
- Supported uploads: PNG, JPG, WebP, GIF, SVG, MP4, WebM, and PDF.
- New videos should remain browser-compatible MP4 (H.264 video with AAC audio) when possible.
- The repository’s `.gitattributes` continues to place MP4 files under Git LFS.
- Keep uploaded files that are referenced by content. Removing a referenced upload will break that image or video.

## Stopping the editor

The launcher keeps a hidden local Node.js process running so the editor remains available. Restarting Windows stops it. To stop it sooner, use Task Manager and end the Node.js process whose command includes `next dev -H 127.0.0.1 -p 3010`.

## Full handoff

See `docs/FINAL-HANDOFF.md` for the complete everyday workflow, folder map, offline/online behavior, troubleshooting, and recovery checklist.
