import type { Metadata } from "next";
import { SiteScopeCaseStudyView } from "@/components/CaseStudyViews";
import { siteScopeCaseStudy } from "@/data/sitescope-case-study";

export const metadata: Metadata = siteScopeCaseStudy.metadata;

export default function SiteScopeCaseStudy() {
  return <SiteScopeCaseStudyView />;
}
