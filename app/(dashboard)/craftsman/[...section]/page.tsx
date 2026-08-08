import { notFound } from "next/navigation";
import { WorkspacePage } from "@/components/dashboard/workspace-page";

const sections = new Set(["jobs", "services", "portfolio", "verification", "reviews", "notifications", "profile"]);
export default async function CraftsmanWorkspacePage({ params }: { params: Promise<{ section: string[] }> }) { const { section } = await params; const key = section.join("/"); if (!sections.has(key)) notFound(); return <WorkspacePage role="craftsman" section={key} />; }
