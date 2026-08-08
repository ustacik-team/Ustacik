import { notFound } from "next/navigation";
import { WorkspacePage } from "@/components/dashboard/workspace-page";

const sections = new Set(["reviews", "saved", "notifications", "profile"]);
export default async function CustomerWorkspacePage({ params }: { params: Promise<{ section: string[] }> }) { const { section } = await params; const key = section.join("/"); if (!sections.has(key)) notFound(); return <WorkspacePage role="customer" section={key} />; }
