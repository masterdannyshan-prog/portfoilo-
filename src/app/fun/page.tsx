import type { Metadata } from "next";
import { FunView } from "@/components/PortfolioViews";
import site from "@/content/site.json";

export const metadata: Metadata = site.metadata.fun;

export default function FunPage() {
  return <FunView />;
}
