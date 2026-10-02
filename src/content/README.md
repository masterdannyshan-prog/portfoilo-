# Portfolio content files (Phase 1)

These JSON files are the content source for the current portfolio. This phase does **not** include the local visual editor, Draft/Preview/Publish controls, or a Windows launcher yet. No change is published automatically by editing a file locally.

- `site.json`: homepage and Fun metadata; navigation labels and destinations; availability; homepage hero; Work button text; Fun introduction; About text, portrait and process cards; experience, education, tools and their logos; contact copy, email, resume and social links; shared case-study navigation labels.
- `projects.json`: all eight Work cards and four Fun cards, including SignSpeak. Card order is array order. Each card stores its title, metadata, thumbnail, alt text, destination and accessible link label. SignSpeak keeps its established contained-image treatment and build-method tag.
- `case-studies/sitescope.json`: SiteScope metadata, hero text/video, live URL, chapter list, sample links, sections, copy and images.
- `case-studies/ghost-frame.json`: Ghost Frame metadata, hero text/video, live URL, chapter list, sections, UX decisions, images, captions and video.

The shared `CaseStudyTemplate` component renders the common heading, chapter navigation, section order, and footer. Each existing case study retains its own media/decision rendering so that Phase 1 does not change its appearance. The later editor will build on these content files and template to create case studies without hand-editing page components.

Use forward-slash paths beginning with `/images/` or `/videos/` for local media. They resolve under `public/`. Keep filenames and capitalization exact. MP4 files are Git LFS assets; do not remove `.gitattributes` or commit an LFS pointer in place of playable media. The resume URL resolves under `public/` as well.

For now, edit JSON carefully and run `npm run build` before using changes. The later local editor will provide forms, validation, responsive preview, draft review, and a simple Windows launcher and setup guide.
