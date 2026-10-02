import content from "@/content/case-studies/sitescope.json";

export type SiteScopeMedia = {
  label: string;
  caption?: string;
  src?: string;
  width?: number;
  height?: number;
};

export type SiteScopeSection = {
  title: string;
  paragraphs?: string[];
  points?: string[];
  flow?: string[];
  media?: SiteScopeMedia[];
  layout?: "compact" | "rows";
};

export const siteScopeCaseStudy = content as Omit<typeof content, "sections"> & { sections: SiteScopeSection[] };
