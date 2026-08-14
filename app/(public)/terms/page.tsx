import type { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the Ustacik terms of use. Understand how the platform connects customers with independent craftsmen across Northern Cyprus and what each party is responsible for.",
};
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { getServerSession } from "@/lib/get-session";

export default async function TermsPage() {
  const session = await getServerSession();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={session?.user ?? null} />
      <main className="container mx-auto flex-1 px-4 py-12 md:px-6">
        <article className="mx-auto max-w-3xl rounded-2xl border bg-card/90 p-6 shadow-sm sm:p-10">
          <div className="flex items-center gap-2 text-primary">
            <FileText className="size-5" />
            <span className="text-sm font-semibold">Ustacik</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold">Terms of use</h1>
          <div className="mt-7 space-y-5 text-sm leading-7 text-muted-foreground">
            <p>
              Ustacik connects customers with independent craftsmen across Northern Cyprus. Craftsmen are independent service providers responsible for the services they provide and for agreeing on scope, pricing, and timing directly with customers.
            </p>
            <p className="font-medium text-foreground">
              Verification Disclaimer: Verification badges describe manual checks completed by Ustacik at the stated verification level. The platform matches customers and craftsmen but does not guarantee workmanship.
            </p>
            <p>
              Customers and craftsmen should communicate respectfully and keep request information accurate. We may update these terms as the platform develops.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
