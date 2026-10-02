import content from "@/content/case-studies/ghost-frame.json";

export type GhostFrameMedia = {
  assetKey: string;
  label: string;
  caption: string;
  src?: string;
  width?: number;
  height?: number;
};

export type GhostFrameDecision = {
  heading: string;
  explanation: string;
  media: GhostFrameMedia;
};

export type GhostFrameSection = {
  title: string;
  paragraphs?: string[];
  flow?: string[];
  media?: GhostFrameMedia[];
  decisions?: GhostFrameDecision[];
  note?: string;
  layout?: "compact";
};

export const ghostFrameCaseStudy = content as Omit<typeof content, "sections"> & { sections: GhostFrameSection[] };
