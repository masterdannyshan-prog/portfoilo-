import type { Metadata } from "next";
import { GhostFrameCaseStudyView } from "@/components/CaseStudyViews";
import { ghostFrameCaseStudy } from "@/data/ghost-frame-case-study";

export const metadata: Metadata = ghostFrameCaseStudy.metadata;

export default function GhostFrameCaseStudy() {
  return <GhostFrameCaseStudyView />;
}
