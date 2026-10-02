import content from "@/content/projects.json";

export type Project = {
  slug: string;
  title: string;
  headline: string;
  category: string;
  status: string;
  description: string;
  role: string;
  year: string;
  image: string;
  imageAlt: string;
  layout: "lead" | "reverse";
  href?: string;
  linkLabel: string;
};

export const projects = content.projects as Project[];
export const funProjects = content.funProjects as Project[];
