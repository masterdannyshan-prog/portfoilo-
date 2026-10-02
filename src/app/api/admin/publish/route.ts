import { assertLocalEditorAccess } from "@/lib/local-editor-access";
import {
  checkGitHubConnectivity,
  getDeploymentStatus,
  getPublishStatus,
  publishToGitHub,
  validateForPublish,
  withPublishLock,
  type ValidationStep,
} from "@/lib/publish-workflow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function errorResponse(error: unknown) {
  const typed = error as Error & { steps?: ValidationStep[]; commit?: string };
  const message = typed instanceof Error ? typed.message : "Unexpected publishing error.";
  return Response.json({
    ok: false,
    message,
    steps: typed.steps,
    commit: typed.commit,
  }, { status: message.startsWith("LOCAL_EDITOR_") ? 403 : 400 });
}

export async function GET(request: Request) {
  try {
    await assertLocalEditorAccess();
    const url = new URL(request.url);
    if (url.searchParams.get("view") === "deployment") {
      return Response.json({ ok: true, deployment: await getDeploymentStatus(url.searchParams.get("commit") ?? undefined) });
    }
    if (url.searchParams.get("view") === "connectivity") {
      return Response.json({ ok: true, connectivity: await checkGitHubConnectivity() });
    }
    return Response.json({ ok: true, status: await getPublishStatus() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await assertLocalEditorAccess(true);
    const body = await request.json() as {
      action?: string;
      confirmation?: string;
      validationToken?: string;
      commitMessage?: string;
    };
    if (body.action === "validate") {
      return Response.json({ ok: true, ...(await withPublishLock("validate", validateForPublish)) });
    }
    if (body.action === "publish") {
      return Response.json({
        ok: true,
        result: await withPublishLock("publish", () => publishToGitHub({
          confirmation: body.confirmation ?? "",
          validationToken: body.validationToken ?? "",
          commitMessage: body.commitMessage ?? "Update portfolio content",
        })),
      });
    }
    return Response.json({ ok: false, message: "Unknown publishing action." }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}
