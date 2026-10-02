import "server-only";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const fixedEditorDocuments = {
  site: "src/content/site.json",
  projects: "src/content/projects.json",
  sitescope: "src/content/case-studies/sitescope.json",
  "ghost-frame": "src/content/case-studies/ghost-frame.json",
} as const;

export type EditorDocumentKey = keyof typeof fixedEditorDocuments | `case:${string}`;
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const projectRoot = process.cwd();
const draftRoot = path.join(projectRoot, ".portfolio-drafts");

export function isEditorDocumentKey(value: string): value is EditorDocumentKey {
  return Object.hasOwn(fixedEditorDocuments, value)
    || (value.startsWith("case:") && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slice(5)));
}

function relativeDocumentPath(key: EditorDocumentKey) {
  if (Object.hasOwn(fixedEditorDocuments, key)) {
    return fixedEditorDocuments[key as keyof typeof fixedEditorDocuments];
  }
  return `src/content/case-studies/${key.slice(5)}.json`;
}

function publishedPath(key: EditorDocumentKey) {
  return path.join(/* turbopackIgnore: true */ projectRoot, relativeDocumentPath(key));
}

function draftPath(key: EditorDocumentKey) {
  return path.join(/* turbopackIgnore: true */ draftRoot, `${key.replace(":", "-")}.json`);
}

async function readJson(filePath: string): Promise<JsonValue> {
  return JSON.parse(await readFile(filePath, "utf8")) as JsonValue;
}

export async function readPublishedDocument(key: EditorDocumentKey) {
  return readJson(publishedPath(key));
}

export async function readPublishedDocumentOrEmpty(key: EditorDocumentKey) {
  try {
    return await readPublishedDocument(key);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

export async function readDraftDocument(key: EditorDocumentKey) {
  try {
    return await readJson(draftPath(key));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return readPublishedDocument(key);
  }
}

export async function hasDraftDocument(key: EditorDocumentKey) {
  try {
    await readFile(draftPath(key));
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

function validateDocument(value: unknown): asserts value is JsonValue {
  JSON.stringify(value);
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Document must be a JSON object.");
  }
}

async function atomicWrite(filePath: string, value: JsonValue) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, filePath);
}

export async function saveDraftDocument(key: EditorDocumentKey, value: unknown) {
  validateDocument(value);
  await atomicWrite(draftPath(key), value);
}

export async function publishDraftDocument(key: EditorDocumentKey, value: unknown) {
  validateDocument(value);
  const destination = publishedPath(key);
  const backupDirectory = path.join(draftRoot, "backups");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await mkdir(backupDirectory, { recursive: true });
  try {
    await writeFile(path.join(backupDirectory, `${stamp}-${key.replace(":", "-")}.json`), await readFile(destination), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await atomicWrite(destination, value);
  await atomicWrite(draftPath(key), value);
}

export async function listCaseStudyDocuments() {
  const directory = path.join(projectRoot, "src", "content", "case-studies");
  const publishedFiles = await readdir(directory);
  let draftFiles: string[] = [];
  try {
    draftFiles = await readdir(draftRoot);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const slugs = new Set([
    ...publishedFiles.filter((file) => file.endsWith(".json")).map((file) => file.replace(/\.json$/, "")),
    ...draftFiles.filter((file) => /^case-.+\.json$/.test(file)).map((file) => file.replace(/^case-/, "").replace(/\.json$/, "")),
  ]);
  return Promise.all([...slugs].sort().map(async (slug) => {
    const key: EditorDocumentKey = slug === "sitescope" ? "sitescope" : slug === "ghost-frame" ? "ghost-frame" : `case:${slug}`;
    const document = await readDraftDocument(key) as { title?: JsonValue };
    return { key, slug, title: typeof document.title === "string" ? document.title : slug };
  }));
}

export async function createCaseStudyDraft(title: string, slug: string, collection: "projects" | "funProjects") {
  if (!title.trim()) throw new Error("Enter a project title.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Use a lowercase URL slug with letters, numbers, and hyphens.");
  if (["sitescope", "ghost-frame"].includes(slug)) throw new Error("That case-study slug already exists.");
  const key: EditorDocumentKey = `case:${slug}`;
  try {
    await readFile(publishedPath(key));
    throw new Error("That case-study slug already exists.");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  if (await hasDraftDocument(key)) throw new Error("That case-study draft already exists.");

  const cleanTitle = title.trim();
  const caseStudy: JsonValue = {
    slug,
    variant: "standard",
    metadata: {
      title: `${cleanTitle} Case Study | Darshan`,
      description: `A UI/UX case study for ${cleanTitle}.`,
    },
    sourceLabel: `${cleanTitle} / UI/UX case study`,
    title: cleanTitle,
    description: "Add a concise description of the product and the value it creates.",
    chapters: ["Overview", "The Problem", "Research and Product Direction", "Design Process", "UX Decisions Made", "Final Designs", "Limitations and Next Steps"],
    liveLink: { label: "Live website", url: "", display: "" },
    heroMedia: {
      assetKey: `${slug}-hero`,
      mediaType: "image",
      label: `${cleanTitle} product preview`,
      caption: "Replace this placeholder with the finished product image or video.",
      src: "/images/projects/project-placeholder.svg",
      width: 1600,
      height: 900,
    },
    footer: { label: `${cleanTitle} case study`, backLabel: "Back to selected work" },
    sections: [
      { title: "Overview", paragraphs: ["Describe the product, who it serves, and what it helps them do."] },
      { title: "My Role", layout: "compact", paragraphs: ["UI/UX Designer and AI-assisted Builder"] },
      { title: "The Problem", paragraphs: ["Explain the user or business problem that shaped the project."] },
      { title: "Research and Product Direction", paragraphs: ["Add research inputs, assumptions, constraints, and the direction you chose."] },
      { title: "Design Process", flow: ["Understand", "Structure", "Design", "Review"], paragraphs: ["Explain how the project moved from problem framing to a refined interface."] },
      {
        title: "UX Decisions Made",
        decisions: [{
          heading: "01 / Add a decision title",
          explanation: "Explain the decision, the reason behind it, and how it helps the user.",
          media: {
            assetKey: `${slug}-decision-1`,
            mediaType: "image",
            label: "Annotated UX decision",
            caption: "Add a caption that explains what the image demonstrates.",
            src: "/images/projects/project-placeholder.svg",
            width: 1600,
            height: 900,
          },
        }],
      },
      {
        title: "Final Designs",
        paragraphs: ["Summarize the final experience and the result."],
        media: [{
          assetKey: `${slug}-final-1`,
          mediaType: "image",
          label: "Final product design",
          caption: "Replace this placeholder with a final design.",
          src: "/images/projects/project-placeholder.svg",
          width: 1600,
          height: 900,
        }],
      },
      { title: "Limitations and Next Steps", paragraphs: ["Document current limitations and the most useful next steps."] },
    ],
  };

  const projectsDocument = await readDraftDocument("projects") as { [key: string]: JsonValue };
  const cards = Array.isArray(projectsDocument[collection]) ? projectsDocument[collection] as JsonValue[] : [];
  cards.push({
    slug,
    title: cleanTitle,
    headline: "Add a short project headline",
    category: collection === "projects" ? "Product design" : "Interactive project",
    status: "Case study",
    description: "Add a short project description.",
    role: "UI/UX design",
    year: String(new Date().getFullYear()),
    image: "/images/projects/project-placeholder.svg",
    imageAlt: `${cleanTitle} project thumbnail`,
    layout: cards.length % 2 === 0 ? "lead" : "reverse",
    href: `/projects/${slug}`,
    linkLabel: `View ${cleanTitle} case study`,
  });
  projectsDocument[collection] = cards;
  await Promise.all([
    saveDraftDocument(key, caseStudy),
    saveDraftDocument("projects", projectsDocument),
  ]);
  return { key, slug, title: cleanTitle };
}
