import type { Metadata } from "next";
import { Shield, Cookie, Lock, Settings, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { getServerSession } from "@/lib/get-session";

export const metadata: Metadata = {
  title: "Cookie Policy | Ustacik",
  description:
    "Read the Ustacik Cookie Policy. Learn about essential authentication cookies used to manage secure sessions on our platform.",
  openGraph: {
    title: "Cookie Policy | Ustacik",
    description:
      "Read the Ustacik Cookie Policy. Learn about essential authentication cookies used to manage secure sessions on our platform.",
  },
};

export default async function CookiesPage() {
  const session = await getServerSession();

  return (
    <div className="flex min-h-screen flex-col bg-(image:--page-bg) bg-cover bg-center bg-fixed">
      <Navbar user={session?.user ?? null} />

      <main className="flex-1 container mx-auto px-4 py-12 md:px-6 md:py-16">
        <article className="mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card/95 p-6 shadow-sm sm:p-10 backdrop-blur-md">
          
          {/* Header */}
          <div className="border-b border-border/40 pb-6 mb-8">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
              <Shield className="h-5 w-5" />
              <span>Ustacik Legal Information</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Cookie Policy
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
                This Cookie Policy accurately reflects the actual session storage and cookie mechanisms implemented in the Ustacik codebase. No third-party ad tracking or behavioral advertising cookies are used.
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" /> 1. What Are Cookies?
              </h2>
              <p>
                Cookies are small text files stored on your device (computer, smartphone, or tablet) when you visit web applications. They allow websites to recognize your device, maintain active login sessions, and support core platform functionality.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> 2. Essential Authentication Cookies
              </h2>
              <p>
                Ustacik uses <strong>strictly essential cookies</strong> necessary for secure user authentication and session management. We do not use third-party advertising, cross-site tracking, or behavioral profiling cookies.
              </p>
              
              <div className="pt-2">
                <div className="overflow-x-auto rounded-lg border border-border/30">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/40 text-foreground font-semibold border-b border-border/30">
                      <tr>
                        <th className="p-3">Cookie Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Purpose</th>
                        <th className="p-3">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      <tr>
                        <td className="p-3 font-mono font-medium text-foreground">better-auth.session_token</td>
                        <td className="p-3">Strictly Necessary</td>
                        <td className="p-3">Stores encrypted session token to maintain logged-in user state across requests.</td>
                        <td className="p-3">Session / 7 Days</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-medium text-foreground">theme</td>
                        <td className="p-3">Functional</td>
                        <td className="p-3">Remembers light/dark theme preference across page loads.</td>
                        <td className="p-3">1 Year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> 3. How to Manage Cookies
              </h2>
              <p>
                You can control or disable cookies through your browser settings. However, because Ustacik relies on essential session tokens for user authentication, disabling essential cookies will prevent you from signing in, submitting job requests, or accessing your customer or craftsman dashboard.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy if we introduce new technical session features. Any updates will be posted directly on this page with a revised &quot;Last Updated&quot; date.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Contact Information</h2>
              <p>
                If you have questions about our use of essential cookies, please contact us at:
              </p>
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30 text-xs">
                <p className="font-semibold text-foreground">Ustacik Technical Support</p>
                <p>Email: support@ustacik.com</p>
              </div>
            </section>

          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
