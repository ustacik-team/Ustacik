import type { Metadata } from "next";
import Image from "next/image";
import { FileText, Scale, UserCheck, AlertTriangle, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { getServerSession } from "@/lib/get-session";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Ustacik Terms of Service. Learn about platform eligibility, user responsibilities, craftsman verification disclaimers, and dispute guidelines in Northern Cyprus.",
  openGraph: {
    title: "Terms of Service",
    description:
      "Read the Ustacik Terms of Service. Learn about platform eligibility, user responsibilities, craftsman verification disclaimers, and dispute guidelines in Northern Cyprus.",
  },
};

export default async function TermsPage() {
  const session = await getServerSession();

  return (
    <div className="flex min-h-screen flex-col bg-(image:--page-bg) bg-cover bg-center bg-fixed">
      <Navbar user={session?.user ?? null} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <article className="mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card/95 p-6 shadow-sm sm:p-10 backdrop-blur-md">
          
          {/* Header */}
          <div className="border-b border-border/40 pb-6 mb-8">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
              <Image src="/logo.png" alt="Ustacik Logo" width={20} height={20} className="object-contain" />
              <span>Ustacik Legal Information</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Terms of Service
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Last Updated: August 14, 2026
            </p>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="mb-8 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-800 dark:text-amber-300 text-xs leading-relaxed flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1">Notice to Users &amp; Legal Disclaimer</p>
              <p>
                This document outlines the standard operational terms for using the Ustacik marketplace platform in Northern Cyprus. This policy serves as an initial legal framework and should be reviewed by qualified legal counsel prior to formal corporate enforcement.
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" /> 1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the Ustacik platform (the &quot;Platform&quot;), including our website, web application, and related services, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use the Platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> 2. Ustacik&apos;s Role as a Marketplace Platform
              </h2>
              <p>
                Ustacik functions strictly as a technology marketplace connecting customers seeking trade services (&quot;Customers&quot;) with independent local trade professionals (&quot;Craftsmen&quot;) operating in Northern Cyprus.
              </p>
              <p className="font-medium text-foreground bg-muted/30 p-3 rounded-lg border border-border/40">
                Important Disclaimer: Ustacik is not a contractor, employer, or direct service provider. Craftsmen operate as independent contractors. Ustacik does not perform trade work directly, nor does it guarantee the completion, timing, or quality of services rendered by individual craftsmen.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" /> 3. User Accounts &amp; Registration
              </h2>
              <p>
                To request jobs or offer craftsman services, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Provide accurate, current, and complete registration information (full name, email, phone number).</li>
                <li>Maintain the security and confidentiality of your authentication credentials.</li>
                <li>Notify Ustacik immediately of any unauthorized access to your account.</li>
                <li>Ensure you meet the legal age of majority in Northern Cyprus to enter binding agreements.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> 4. Craftsman Verification Disclaimers
              </h2>
              <p>
                Ustacik offers multi-tier verification badges (&quot;Registered&quot;, &quot;Verified&quot;, and &quot;Approved&quot;) based on manual document checks performed by Ustacik administrators:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Registered</strong>: Phone number and basic profile details confirmed.</li>
                <li><strong>Verified</strong>: Government-issued ID / passport and customer references checked.</li>
                <li><strong>Approved</strong>: Optional business registration documentation and workmanship guarantee commitment verified.</li>
              </ul>
              <p>
                While verification badges represent administrative document checks completed at the time of review, Customers remain responsible for confirming project scope, permits, and pricing directly with Craftsmen before work commences.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Job Requests &amp; Interactions</h2>
              <p>
                Job requests submitted via the Platform allow Customers and Craftsmen to communicate, schedule on-site visits, and agree on job requirements. All agreements regarding pricing, timelines, materials, and execution are formed directly between Customer and Craftsman.
              </p>
              <p>
                Ustacik does not currently process direct job payments or act as an escrow payment agent. Payment arrangements must be settled directly between parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Reviews &amp; Ratings</h2>
              <p>
                Customers who complete a job interaction may submit ratings and reviews evaluating punctuality, workmanship, price honesty, and communication. Reviews must reflect genuine firsthand experiences, remain truthful, and comply with platform content guidelines. Ustacik reserves the right to remove fraudulent, abusive, or defamatory reviews.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">7. Prohibited Conduct &amp; Abuse</h2>
              <p>
                Users agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Submit false, misleading, or impersonated identity or business information.</li>
                <li>Harass, abuse, or defraud other users of the Platform.</li>
                <li>Bypass platform authentication, query unauthorized application data, or scrape platform profiles.</li>
                <li>Submit spam job requests or bogus craftsman applications.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">8. Account Suspension &amp; Termination</h2>
              <p>
                Ustacik reserves the right to suspend or terminate any user account, reject craftsman applications, or restrict platform access for violations of these Terms, fraudulent activity, or conduct detrimental to the community.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, Ustacik and its operators shall not be liable for any indirect, incidental, consequential, or punitive damages, property damage, or loss of profits resulting from service interactions between Customers and Craftsmen matched through the Platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">10. Contact Information</h2>
              <p>
                For legal inquiries or questions regarding these Terms of Service, please contact us at:
              </p>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30 text-xs">
                <p className="font-semibold text-foreground">Ustacik Legal Operations</p>
                <p>Northern Cyprus Marketplace Support</p>
                <p>Email: legal@ustacik.com</p>
              </div>
            </section>

          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
