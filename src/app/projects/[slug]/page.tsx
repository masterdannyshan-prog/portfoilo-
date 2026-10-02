import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardCaseStudyView } from "@/components/CaseStudyViews";
import { listStandardCaseStudySlugs, readStandardCaseStudy } from "@/lib/case-study-files";

export async function generateStaticParams() {
  const slugs = await listStandardCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const document = await readStandardCaseStudy(slug);
  if (!document) return {};
  return {
    title: document.metadata?.title || `${document.title} Case Study | Darshan`,
    description: document.metadata?.description || document.description,
  };
}

export default async function StandardCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const document = await readStandardCaseStudy(slug);
  if (!document) notFound();
  return <StandardCaseStudyView document={document} />;
}
