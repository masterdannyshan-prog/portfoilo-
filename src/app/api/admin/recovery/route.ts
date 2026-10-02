import { assertLocalEditorAccess } from "@/lib/local-editor-access";
import {
  archiveUnusedMedia,
  auditUploadedMedia,
  listArchivedMedia,
  listContentBackups,
  restoreArchivedMedia,
  restoreBackupToDraft,
} from "@/lib/recovery-workflow";
import {
  getPublishStatus,
  getRecoveryHistory,
  rollbackLatestPublish,
  withPublishLock,
} from "@/lib/publish-workflow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function errorResponse(error: unknown) {
  const typed = error as Error & { commit?: string };
  const message = typed instanceof Error ? typed.message : "Unexpected recovery error.";
  return Response.json({ ok: false, message, commit: typed.commit }, { status: message.startsWith("LOCAL_EDITOR_") ? 403 : 400 });
}

export async function GET() {
  try {
    await assertLocalEditorAccess();
    const [backups, media, archivedMedia, history, repository] = await Promise.all([
      listContentBackups(),
      auditUploadedMedia(),
      listArchivedMedia(),
      getRecoveryHistory(),
      getPublishStatus(),
    ]);
    return Response.json({ ok: true, backups, media, archivedMedia, history, repository });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await assertLocalEditorAccess(true);
    const body = await request.json() as {
      action?: string;
      filename?: string;
      id?: string;
      confirmation?: string;
      expectedCommit?: string;
    };
    if (body.action === "restore-backup") {
      return Response.json({ ok: true, result: await withPublishLock("restore-backup", () => restoreBackupToDraft(body.filename ?? "")) });
    }
    if (body.action === "archive-unused-media") {
      return Response.json({ ok: true, result: await withPublishLock("archive-media", () => archiveUnusedMedia(body.confirmation ?? "")) });
    }
    if (body.action === "restore-media") {
      return Response.json({ ok: true, result: await withPublishLock("restore-media", () => restoreArchivedMedia(body.id ?? "")) });
    }
    if (body.action === "rollback-live") {
      return Response.json({
        ok: true,
        result: await withPublishLock("rollback", () => rollbackLatestPublish({
          confirmation: body.confirmation ?? "",
          expectedCommit: body.expectedCommit ?? "",
        })),
      });
    }
    return Response.json({ ok: false, message: "Unknown recovery action." }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}
