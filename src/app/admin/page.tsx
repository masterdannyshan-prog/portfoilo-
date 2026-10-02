import { notFound } from "next/navigation";
import { PortfolioEditor } from "@/components/PortfolioEditor";
import { assertLocalEditorAccess } from "@/lib/local-editor-access";
import "./editor.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    await assertLocalEditorAccess();
  } catch {
    notFound();
  }
  return <PortfolioEditor />;
}
