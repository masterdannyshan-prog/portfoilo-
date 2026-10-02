import "server-only";
import { mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  isEditorDocumentKey,
  saveDraftDocument,
  type EditorDocumentKey,
  type JsonValue,
} from "@/lib/editor-content";

const projectRoot = process.cwd();
const draftRoot = path.join(projectRoot, ".portfolio-drafts");
const backupRoot = path.join(draftRoot, "backups");
const uploadsRoot = path.join(projectRoot, "public", "uploads");
const mediaTrashRoot = path.join(draftRoot, "media-trash");

export type ContentBackup = {
  filename: string;
  document: EditorDocumentKey;
  label: string;
  createdAt: string;
  size: number;
};

export type MediaAuditItem = {
  path: string;
  size: number;
  referenced: boolean;
};

export type ArchivedMedia = {
  id: string;
  path: string;
  size: number;
  archivedAt: string;
};

type TrashManifest = {
  archivedAt: string;
  items: { originalPath: string; archivedPath: string; size: number }[];
};

function keyFromBackupFilename(filename: string): EditorDocumentKey | null {
  if (!filename.endsWith(".json") || filename.length < 31) return null;
  const safeKey = filename.slice(25, -5);
  const key = safeKey.startsWith("case-") ? `case:${safeKey.slice(5)}` : safeKey;
  return isEditorDocumentKey(key) ? key : null;
}

function labelForKey(key: EditorDocumentKey) {
  if (key === "site") return "Website content";
  if (key === "projects") return "Project cards";
  if (key === "sitescope") return "SiteScope case study";
  if (key === "ghost-frame") return "Ghost Frame case study";
  return `${key.slice(5).replace(/-/g, " ")} case study`;
}

export async function listContentBackups(): Promise<ContentBackup[]> {
  let files: string[] = [];
  try {
    files = await readdir(backupRoot);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const backups = await Promise.all(files.map(async (filename) => {
    const document = keyFromBackupFilename(filename);
    if (!document || !/^[a-zA-Z0-9._-]+\.json$/.test(filename)) return null;
    const details = await stat(path.join(backupRoot, filename));
    return {
      filename,
      document,
      label: labelForKey(document),
      createdAt: details.mtime.toISOString(),
      size: details.size,
    } satisfies ContentBackup;
  }));
  return backups.filter((item): item is ContentBackup => Boolean(item)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function restoreBackupToDraft(filename: string) {
  if (!/^[a-zA-Z0-9._-]+\.json$/.test(filename)) throw new Error("Invalid backup file.");
  const document = keyFromBackupFilename(filename);
  if (!document) throw new Error("The backup does not identify an editable document.");
  const backupPath = path.join(backupRoot, filename);
  const value = JSON.parse(await readFile(backupPath, "utf8")) as JsonValue;
  await saveDraftDocument(document, value);
  return { document, message: `${labelForKey(document)} was restored as a draft. Preview and review it before applying.` };
}

async function walkFiles(directory: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : Promise.resolve([target]);
  }));
  return nested.flat();
}

async function referencedUploadPaths() {
  const publishedFiles = (await walkFiles(path.join(projectRoot, "src", "content"))).filter((file) => file.endsWith(".json"));
  let draftFiles: string[] = [];
  try {
    draftFiles = (await readdir(draftRoot)).filter((file) => file.endsWith(".json")).map((file) => path.join(draftRoot, file));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const text = (await Promise.all([...publishedFiles, ...draftFiles].map((file) => readFile(file, "utf8")))).join("\n");
  const matches = text.matchAll(/\/uploads\/[a-zA-Z0-9._~!$&'()+,;=@%/-]+/g);
  return new Set([...matches].map((match) => decodeURIComponent(match[0])));
}

export async function auditUploadedMedia(): Promise<MediaAuditItem[]> {
  const references = await referencedUploadPaths();
  const files = await walkFiles(uploadsRoot);
  return Promise.all(files.map(async (file) => {
    const relative = path.relative(path.join(projectRoot, "public"), file).replace(/\\/g, "/");
    const publicPath = `/${relative}`;
    const details = await stat(file);
    return { path: publicPath, size: details.size, referenced: references.has(publicPath) };
  }));
}

function safePublicUploadPath(publicPath: string) {
  if (!publicPath.startsWith("/uploads/") || publicPath.includes("..")) throw new Error("Invalid upload path.");
  const absolute = path.resolve(projectRoot, "public", publicPath.slice(1));
  const expectedRoot = `${path.resolve(uploadsRoot)}${path.sep}`;
  if (!absolute.startsWith(expectedRoot)) throw new Error("Upload path is outside the media directory.");
  return absolute;
}

export async function archiveUnusedMedia(confirmation: string) {
  if (confirmation !== "ARCHIVE") throw new Error("Type ARCHIVE to confirm moving unused uploads into the recovery archive.");
  const unused = (await auditUploadedMedia()).filter((item) => !item.referenced);
  if (!unused.length) return { archived: 0, message: "No unused uploaded media was found." };
  const batch = new Date().toISOString().replace(/[:.]/g, "-");
  const batchRoot = path.join(mediaTrashRoot, batch);
  const manifestPath = path.join(batchRoot, "manifest.json");
  const manifest: TrashManifest = { archivedAt: new Date().toISOString(), items: [] };
  await mkdir(batchRoot, { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  for (const item of unused) {
    const source = safePublicUploadPath(item.path);
    const archivedPath = path.join(batchRoot, item.path.slice("/uploads/".length));
    await mkdir(path.dirname(archivedPath), { recursive: true });
    await rename(source, archivedPath);
    manifest.items.push({ originalPath: item.path, archivedPath: path.relative(mediaTrashRoot, archivedPath).replace(/\\/g, "/"), size: item.size });
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  }
  return { archived: unused.length, message: `${unused.length} unused upload${unused.length === 1 ? " was" : "s were"} moved into the recoverable local archive.` };
}

export async function listArchivedMedia(): Promise<ArchivedMedia[]> {
  let batches: string[] = [];
  try {
    batches = await readdir(mediaTrashRoot);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const groups = await Promise.all(batches.map(async (batch) => {
    try {
      const manifest = JSON.parse(await readFile(path.join(mediaTrashRoot, batch, "manifest.json"), "utf8")) as TrashManifest;
      return manifest.items.map((item, index) => ({
        id: `${batch}:${index}`,
        path: item.originalPath,
        size: item.size,
        archivedAt: manifest.archivedAt,
      }));
    } catch {
      return [];
    }
  }));
  return groups.flat().sort((a, b) => b.archivedAt.localeCompare(a.archivedAt));
}

export async function restoreArchivedMedia(id: string) {
  const match = id.match(/^([a-zA-Z0-9._-]+):(\d+)$/);
  if (!match) throw new Error("Invalid archived-media identifier.");
  const manifestPath = path.join(mediaTrashRoot, match[1], "manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as TrashManifest;
  const index = Number(match[2]);
  const item = manifest.items[index];
  if (!item) throw new Error("Archived media was not found.");
  const source = path.resolve(mediaTrashRoot, item.archivedPath);
  if (!source.startsWith(`${path.resolve(mediaTrashRoot)}${path.sep}`)) throw new Error("Archived media path is invalid.");
  const destination = safePublicUploadPath(item.originalPath);
  try {
    await stat(destination);
    throw new Error("A file already exists at the original media path.");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(destination), { recursive: true });
  await rename(source, destination);
  manifest.items.splice(index, 1);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return { message: `${item.originalPath} was restored to the uploads folder.` };
}
