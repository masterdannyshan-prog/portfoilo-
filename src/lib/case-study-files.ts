import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { StandardCaseStudyDocument } from "@/components/CaseStudyViews";

const caseStudyDirectory = path.join(process.cwd(), "src", "content", "case-studies");

export function isSafeCaseStudySlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function listStandardCaseStudySlugs() {
  const files = await readdir(caseStudyDirectory);
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""))
    .filter((slug) => !["sitescope", "ghost-frame"].includes(slug));
}

export async function readStandardCaseStudy(slug: string): Promise<StandardCaseStudyDocument | null> {
  if (!isSafeCaseStudySlug(slug) || ["sitescope", "ghost-frame"].includes(slug)) return null;
  try {
    const file = await readFile(path.join(caseStudyDirectory, `${slug}.json`), "utf8");
    const document = JSON.parse(file) as StandardCaseStudyDocument;
    return document.variant === "standard" && document.slug === slug ? document : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
