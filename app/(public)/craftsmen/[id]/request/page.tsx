import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CraftsmanSummary } from "@/components/request-job/craftsman-summary";
import { RequestHeader } from "@/components/request-job/request-header";
import { RequestJobForm } from "@/components/request-job/request-job-form";
import { RequestSummary } from "@/components/request-job/request-summary";
import { TrustSection } from "@/components/request-job/trust-section";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { getServerSession } from "@/lib/get-session";
import { allCraftsmen } from "@/lib/mock-craftsmen";

export const metadata: Metadata = { title: "Request a job" };

export default async function RequestJobPage({ params }: PageProps<"/craftsmen/[id]/request">) {
  const { id } = await params;
  const craftsman = allCraftsmen.find((item) => item.id === id);
  if (!craftsman) notFound();
  const session = await getServerSession();
  if (!session?.user) {
    redirect(`/sign-in?redirect=${encodeURIComponent(`/craftsmen/${id}/request`)}`);
  }
  const regions = [...new Set(allCraftsmen.map((item) => item.region))];
  const formCraftsman = { id: craftsman.id, name: craftsman.name, category: craftsman.category, subServices: craftsman.subServices, region: craftsman.region };

  return <div className="flex min-h-screen flex-col bg-(image:--find-craftsmen-bg) bg-cover bg-center bg-fixed"><Navbar user={session?.user ?? null} /><main className="flex-1"><div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10"><RequestHeader craftsmanId={craftsman.id} craftsmanName={craftsman.name} category={craftsman.category} /><div className="mt-8 space-y-6"><CraftsmanSummary craftsman={craftsman} /><div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"><div className="space-y-6"><RequestJobForm craftsman={formCraftsman} regions={regions} /><TrustSection hasGuarantee={craftsman.verificationLevel === "APPROVED"} hasBusinessRegistration={craftsman.verificationLevel !== "REGISTERED"} /></div><aside className="lg:sticky lg:top-24"><RequestSummary craftsman={craftsman} /></aside></div></div></div></main><Footer /></div>;
}
