import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { assertLocalEditorAccess } from "@/lib/local-editor-access";

export const runtime = "nodejs";

const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".mp4", ".webm", ".pdf"]);
const allowedMimePrefixes = ["image/", "video/"];

function cleanName(name: string) {
  const extension = path.extname(name).toLowerCase();
  const base = path.basename(name, extension).replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
  return `${base || "asset"}-${randomUUID().slice(0, 8)}${extension}`;
}

export async function POST(request: Request) {
  try {
    await assertLocalEditorAccess(true);
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return Response.json({ ok: false, message: "Choose a file first." }, { status: 400 });
    const extension = path.extname(file.name).toLowerCase();
    const typeAllowed = allowedMimePrefixes.some((prefix) => file.type.startsWith(prefix)) || file.type === "application/pdf";
    if (!allowedExtensions.has(extension) || !typeAllowed) {
      return Response.json({ ok: false, message: "Use PNG, JPG, WebP, GIF, SVG, MP4, WebM, or PDF." }, { status: 415 });
    }
    const uploads = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploads, { recursive: true });
    const fileName = cleanName(file.name);
    await writeFile(path.join(uploads, fileName), Buffer.from(await file.arrayBuffer()));
    return Response.json({ ok: true, path: `/uploads/${fileName}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return Response.json({ ok: false, message }, { status: message.startsWith("LOCAL_EDITOR_") ? 403 : 400 });
  }
}
