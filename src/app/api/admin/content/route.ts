import { assertLocalEditorAccess } from "@/lib/local-editor-access";
import {
  hasDraftDocument,
  isEditorDocumentKey,
  publishDraftDocument,
  readDraftDocument,
  readPublishedDocumentOrEmpty,
  saveDraftDocument,
} from "@/lib/editor-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected editor error";
  const status = message.startsWith("LOCAL_EDITOR_") ? 403 : 400;
  return Response.json({ ok: false, message }, { status });
}

export async function GET(request: Request) {
  try {
    await assertLocalEditorAccess();
    const key = new URL(request.url).searchParams.get("document") ?? "";
    if (!isEditorDocumentKey(key)) return Response.json({ ok: false, message: "Unknown document." }, { status: 404 });
    const [published, draft, hasDraft] = await Promise.all([
      readPublishedDocumentOrEmpty(key),
      readDraftDocument(key),
      hasDraftDocument(key),
    ]);
    return Response.json({ ok: true, published, draft, hasDraft });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await assertLocalEditorAccess(true);
    const body = await request.json() as { document?: string; action?: string; value?: unknown };
    if (!body.document || !isEditorDocumentKey(body.document)) {
      return Response.json({ ok: false, message: "Unknown document." }, { status: 404 });
    }
    if (body.action === "save-draft") {
      await saveDraftDocument(body.document, body.value);
      return Response.json({ ok: true, message: "Draft saved locally." });
    }
    if (body.action === "publish") {
      await publishDraftDocument(body.document, body.value);
      return Response.json({ ok: true, message: "Reviewed changes applied to the local content file. Nothing was deployed." });
    }
    return Response.json({ ok: false, message: "Unknown action." }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}
