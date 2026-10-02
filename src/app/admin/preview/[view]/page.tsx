import { notFound } from "next/navigation";
import { HomeView, FunView } from "@/components/PortfolioViews";
import {
  GhostFrameCaseStudyView,
  SiteScopeCaseStudyView,
  StandardCaseStudyView,
  type StandardCaseStudyDocument,
} from "@/components/CaseStudyViews";
import { assertLocalEditorAccess } from "@/lib/local-editor-access";
import { isEditorDocumentKey, readDraftDocument } from "@/lib/editor-content";
import siteShape from "@/content/site.json";
import type { Project } from "@/data/projects";
import { siteScopeCaseStudy } from "@/data/sitescope-case-study";
import { ghostFrameCaseStudy } from "@/data/ghost-frame-case-study";

export const dynamic = "force-dynamic";

export default async function EditorPreview({ params }: { params: Promise<{ view: string }> }) {
  try {
    await assertLocalEditorAccess();
  } catch {
    notFound();
  }

  const { view: rawView } = await params;
  const view = decodeURIComponent(rawView);
  const site = await readDraftDocument("site") as unknown as typeof siteShape;
  const projectContent = await readDraftDocument("projects") as unknown as {
    projects: Project[];
    funProjects: Project[];
  };

  if (view === "home") return <HomeView site={site} work={projectContent.projects} />;
  if (view === "fun") return <FunView site={site} fun={projectContent.funProjects} />;
  if (view === "sitescope") {
    const document = await readDraftDocument("sitescope") as unknown as typeof siteScopeCaseStudy;
    return <SiteScopeCaseStudyView document={document} siteContent={site} />;
  }
  if (view === "ghost-frame") {
    const document = await readDraftDocument("ghost-frame") as unknown as typeof ghostFrameCaseStudy;
    return <GhostFrameCaseStudyView document={document} siteContent={site} />;
  }
  if (view.startsWith("case:") && isEditorDocumentKey(view)) {
    const document = await readDraftDocument(view) as unknown as StandardCaseStudyDocument;
    return <StandardCaseStudyView document={document} siteContent={site} />;
  }
  notFound();
}
