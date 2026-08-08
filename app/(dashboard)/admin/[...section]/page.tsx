import { notFound } from "next/navigation";
import { WorkspacePage } from "@/components/dashboard/workspace-page";

const sections = new Set(["users/customers", "users/craftsmen", "verifications", "jobs", "reviews", "categories", "regions", "notifications", "analytics", "logs", "profile"]);
export default async function AdminWorkspacePage({ params }: { params: Promise<{ section: string[] }> }) { const { section } = await params; const key = section.join("/"); if (!sections.has(key)) notFound(); return <WorkspacePage role="admin" section={key} />; }
