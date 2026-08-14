import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";

export const metadata: Metadata = {
  title: "Become a Craftsman",
  description:
    "Join Ustacik as a verified craftsman in Northern Cyprus. Reach more customers, build trust with our verification badges, and grow your trade business.",
  openGraph: {
    title: "Become a Craftsman | Ustacik",
    description:
      "Join Ustacik as a verified craftsman in Northern Cyprus. Reach more customers, build trust with our verification badges, and grow your trade business.",
    type: "website",
  },
};
import { prisma } from "@/lib/prisma";

// ─── Global Components ──────────────────────────────────────────────────
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

// ─── Page Components ────────────────────────────────────────────────────
import { Hero } from "@/components/become-craftsman/hero";
import { Benefits } from "@/components/become-craftsman/benefits";
import { VerificationLevels } from "@/components/become-craftsman/verification-levels";
import { ApplicationForm } from "@/components/become-craftsman/application-form";
import { HowItWorks } from "@/components/become-craftsman/how-it-works";

// ─── Server Page ─────────────────────────────────────────────────────────
export default async function BecomeCraftsmanPage({
  searchParams,
}: {
  searchParams: Promise<{ reapply?: string }>;
}) {
  const session = await getServerSession();
  const user = session?.user || null;
  const params = await searchParams;

  if (user?.role === "CRAFTSMAN") {
    redirect("/craftsman/dashboard");
  }

  if (user?.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  let hasApplication = false;
  if (user) {
    const latestApp = await prisma.craftsmanApplication.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (latestApp) {
      hasApplication = true;
    }

    if (latestApp?.status === "PENDING") {
      redirect("/application-status");
    }

    if (latestApp?.status === "APPROVED") {
      redirect("/craftsman/dashboard");
    }

    if (latestApp?.status === "REJECTED" && params.reapply !== "true") {
      redirect("/application-status");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-(image:--find-craftsmen-bg) bg-cover bg-center bg-no-repeat bg-fixed">
      {/* 1. Navbar */}
      <Navbar user={user} hasApplication={hasApplication} />

      {/* 2. Main Content Area */}
      <main className="flex-1">
        {/* Using space-y-12 to give consistent vertical breathing room between sections */}
        <div className="space-y-12 md:space-y-16">
          <Hero />
          <Benefits />
          <VerificationLevels />
          <ApplicationForm />
          <HowItWorks />
        </div>
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}