import type { Metadata } from "next";
import { Shield, Lock, Eye, Server, UserCheck, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { getServerSession } from "@/lib/get-session";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Ustacik Privacy Policy. Understand what personal information is collected, how customer and craftsman application data is used, stored, and protected.",
  openGraph: {
    title: "Privacy Policy",
    description:
      "Read the Ustacik Privacy Policy. Understand what personal information is collected, how customer and craftsman application data is used, stored, and protected.",
  },
};

export default async function PrivacyPage() {
  const session = await getServerSession();

  return (
    <div className="flex min-h-screen flex-col bg-(image:--page-bg) bg-cover bg-center bg-fixed">
      <Navbar user={session?.user ?? null} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
        <article className="mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card/95 p-6 shadow-sm sm:p-10 backdrop-blur-md">
          
          {/* Header */}
          <div className="border-b border-border/40 pb-6 mb-8">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
              <Shield className="h-5 w-5" />
              <span>Ustacik Legal Information</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Privacy Policy
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
                This Privacy Policy accurately reflects the data collection, database schema, and session management practices currently implemented in the Ustacik application codebase. This document should be reviewed by qualified legal counsel prior to formal production launch.
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" /> 1. Information We Collect
              </h2>
              <p>
                Ustacik collects personal and operational data necessary to connect customers with trade professionals in Northern Cyprus. We collect information through account creation, craftsman applications, job requests, and reviews.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <h3 className="font-semibold text-foreground text-sm mb-1.5">A. User Account Information</h3>
                  <p className="text-xs">
                    When registering an account (as a Customer or Craftsman), we collect your <strong>full name</strong>, <strong>email address</strong>, <strong>phone number</strong>, and optional <strong>profile photo URL</strong>. Authentication data is stored securely via session tokens.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <h3 className="font-semibold text-foreground text-sm mb-1.5">B. Craftsman Application &amp; Verification Data</h3>
                  <p className="text-xs">
                    Craftsmen applying for verification submit business details including <strong>business name</strong>, <strong>operating region</strong>, <strong>service category &amp; sub-services</strong>, <strong>price range estimates</strong>, <strong>bio/experience summary</strong>, <strong>portfolio work photos</strong>, <strong>ID/passport numbers</strong> (optional), <strong>business registration numbers</strong> (optional), and <strong>customer reference contact details</strong> (names and phone numbers).
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <h3 className="font-semibold text-foreground text-sm mb-1.5">C. Job Requests &amp; Reviews</h3>
                  <p className="text-xs">
                    When customers submit job requests, we store the <strong>job title</strong>, <strong>service description</strong>, and <strong>job site address</strong>. When reviews are submitted, we collect rating criteria (punctuality, workmanship, price honesty, communication), written review text, and optional work photos.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <h3 className="font-semibold text-foreground text-sm mb-1.5">D. Session &amp; Technical Technical Data</h3>
                  <p className="text-xs">
                    For platform security and session management, our server logs record <strong>IP addresses</strong> and <strong>browser user agent strings</strong> associated with active login sessions.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" /> 2. How We Use Your Information
              </h2>
              <p>We use collected information exclusively to provide and improve the Ustacik marketplace platform:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To enable account creation, authentication, and security checks.</li>
                <li>To display verified craftsman profiles, portfolio work samples, and customer reviews.</li>
                <li>To match customer job requests with appropriate regional craftsmen.</li>
                <li>To conduct manual administrative verification reviews of craftsman credentials.</li>
                <li>To send in-app notifications regarding job request status changes and verification decisions.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" /> 3. Data Sharing &amp; Access Controls
              </h2>
              <p>
                Ustacik respects user privacy and restricts access to personal data based on strict application boundaries:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Public Profiles</strong>: Craftsman business names, service categories, operating regions, bio, portfolio work photos, and customer reviews are publicly viewable on profile pages. Personal contact numbers are shared only for valid job interactions.</li>
                <li><strong>Private Application Records</strong>: Sensitive craftsman verification documents (such as ID numbers, registration numbers, and customer references) are accessible strictly to authorized Ustacik administrators for verification processing.</li>
                <li><strong>No Sale of Data</strong>: Ustacik does not sell, rent, or trade personal information to third-party advertisers.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> 4. Data Security &amp; Retention
              </h2>
              <p>
                We implement industry-standard security measures including encrypted database connections (PostgreSQL over SSL), server-side authentication session validation, role-based database queries, and secure HTTP security headers.
              </p>
              <p>
                Account data is retained for as long as your account remains active. Users may request account deletion or data removal by contacting support.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Your Privacy Rights</h2>
              <p>
                Users have the right to access, update, or correct their profile information through account settings. You may also request a copy of stored personal data or request deletion of your account and application history.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Contact Information</h2>
              <p>
                For privacy-related inquiries or data subject access requests, please contact us at:
              </p>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30 text-xs">
                <p className="font-semibold text-foreground">Ustacik Privacy Office</p>
                <p>Email: privacy@ustacik.com</p>
              </div>
            </section>

          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
