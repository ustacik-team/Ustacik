import { getServerSession } from "@/lib/get-session";

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
export default async function BecomeCraftsmanPage() {
  const session = await getServerSession();
  const user = session?.user || null;

  return (
    <div className="flex min-h-screen flex-col bg-(image:--find-craftsmen-bg) bg-cover bg-center bg-no-repeat bg-fixed">
      {/* 1. Navbar */}
      <Navbar user={user} />

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