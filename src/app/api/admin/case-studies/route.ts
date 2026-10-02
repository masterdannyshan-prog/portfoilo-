import { assertLocalEditorAccess } from "@/lib/local-editor-access";
import { createCaseStudyDraft, listCaseStudyDocuments } from "@/lib/editor-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await assertLocalEditorAccess();
    return Response.json({ ok: true, caseStudies: await listCaseStudyDocuments() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to list case studies.";
    return Response.json({ ok: false, message }, { status: message.startsWith("LOCAL_EDITOR_") ? 403 : 400 });
  }
}

export async function POST(request: Request) {
  try {
    await assertLocalEditorAccess(true);
    const body = await request.json() as { title?: string; slug?: string; collection?: string };
    const collection = body.collection === "funProjects" ? "funProjects" : "projects";
    const caseStudy = await createCaseStudyDraft(body.title ?? "", body.slug ?? "", collection);
    return Response.json({
      ok: true,
      caseStudy,
      message: "Case study and project-card drafts created. Review both before applying them locally.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create case study.";
    return Response.json({ ok: false, message }, { status: message.startsWith("LOCAL_EDITOR_") ? 403 : 400 });
  }
}
