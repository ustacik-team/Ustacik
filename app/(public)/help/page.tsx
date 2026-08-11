import { getServerSession } from "@/lib/get-session";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import {
  CircleHelp,
  ShieldCheck,
  UserCheck,
  Award,
  Hammer,
  Search,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  PhoneCall,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

export const metadata = {
  title: "Help & Support Center",
  description: "Learn how Ustacik works, how verification levels protect you, and find answers to common questions for homeowners and craftsmen.",
};

const trustLevels = [
  {
    level: "Registered",
    badgeStyle: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/30",
    icon: PhoneCall,
    description: "Basic identity setup for new platform members.",
    requirements: [
      "Phone number verified",
      "Operating region selected",
      "Primary trade category selected",
    ],
  },
  {
    level: "Verified",
    badgeStyle: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    icon: UserCheck,
    description: "Rigorously audited craftsman with verified credentials.",
    requirements: [
      "Official ID document verified",
      "2 previous customer references contacted & checked",
      "Authentic portfolio work photos submitted",
    ],
  },
  {
    level: "Approved Craftsman",
    badgeStyle: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    icon: Award,
    description: "Highest level of trust & formal business guarantee.",
    requirements: [
      "All Verified level requirements satisfied",
      "Official business registration verified",
      "Written workmanship guarantee agreement on file",
    ],
  },
];

const customerFaqs = [
  {
    question: "How do I request a craftsman on Ustacik?",
    answer:
      "Browse craftsmen by category or region on the Find Craftsmen page, view their verified credentials and portfolio photos, and click 'Request Job'. Enter your job details and preferred schedule to send your request directly to the craftsman.",
  },
  {
    question: "Is Ustacik free for homeowners?",
    answer:
      "Yes! Browsing, sending job requests, and receiving quotes on Ustacik is 100% free for homeowners and customers in Northern Cyprus.",
  },
  {
    question: "How are reviews verified?",
    answer:
      "Unlike general review platforms, reviews on Ustacik can ONLY be left by customers who initiated and completed a job request through the platform. There are no public or anonymous review forms, eliminating fake reviews.",
  },
  {
    question: "What do the four review scores mean?",
    answer:
      "Every review scores the craftsman from 1 to 5 across four key dimensions: Punctuality, Workmanship, Price Honesty, and Communication. Ratings become public once a craftsman receives at least 3 verified reviews.",
  },
  {
    question: "How do I agree on pricing?",
    answer:
      "Craftsmen display price ranges on their profiles for guidance. Once you request a job, you agree on the final scope and pricing directly with the craftsman before work begins.",
  },
];

const craftsmanFaqs = [
  {
    question: "How can I join Ustacik as a craftsman?",
    answer:
      "Click 'Become a Craftsman' in the top navigation menu and complete the online application. Once submitted, our team manually verifies your phone number, ID, references, and work photos.",
  },
  {
    question: "How do I upgrade my verification level?",
    answer:
      "Submit your government ID, supply two customer reference contacts, and upload photos of your past completed projects. If you have an official business registration and offer a written workmanship guarantee, you can achieve the highest Approved Craftsman badge.",
  },
  {
    question: "Can craftsmen delete negative reviews?",
    answer:
      "No. Reviews on Ustacik are strictly transparent. Craftsmen cannot delete or hide negative reviews, but they are entitled to post one official public response to clarify details.",
  },
  {
    question: "How do I receive customer job requests?",
    answer:
      "When a customer submits a job request for your trade and region, you receive notifications in your Craftsman Dashboard and via registered contact channels.",
  },
];

export default async function HelpPage() {
  const session = await getServerSession();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={session?.user ?? null} />

      <main className="flex-1 pb-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-primary/[0.08] via-background to-sky-500/[0.05] py-12 md:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 size-64 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="container mx-auto px-4 md:px-6 relative text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
              <CircleHelp className="size-4" />
              <span>Help & Support Center</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
              How can we help you today?
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Everything you need to know about finding verified craftsmen, understanding trust badges, managing job requests, and account security in Northern Cyprus.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gap-2 shadow-md shadow-primary/15">
                <Link href="/find-craftsmen">
                  <Search className="size-4" />
                  <span>Browse Craftsmen</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/become-craftsman">
                  <Hammer className="size-4 text-primary" />
                  <span>Apply as Craftsman</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Core Navigation Cards */}
        <section className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border/70 bg-card hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary mb-2">
                  <Search className="size-5" />
                </div>
                <CardTitle className="text-lg font-bold">For Homeowners</CardTitle>
                <CardDescription className="text-xs">
                  Find, compare, and request verified local craftsmen with complete transparency.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>• Search by category (Plumbing, Electrical, HVAC, Carpentry, etc.) and region.</p>
                <p>• Review verified customer ratings across 4 key scores.</p>
                <p>• Submit job requests with photos and access notes for quick quotes.</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="grid size-11 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                  <Hammer className="size-5" />
                </div>
                <CardTitle className="text-lg font-bold">For Craftsmen</CardTitle>
                <CardDescription className="text-xs">
                  Grow your business, build trusted reputation, and receive qualified job requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>• Free profile listing with business bio, region, and work portfolio photos.</p>
                <p>• Get verified to display trust badges and earn customer confidence.</p>
                <p>• Track incoming enquiries and manage completed jobs in your dashboard.</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="grid size-11 place-items-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-2">
                  <ShieldCheck className="size-5" />
                </div>
                <CardTitle className="text-lg font-bold">The Trust Layer</CardTitle>
                <CardDescription className="text-xs">
                  Manual identity checks and authentic customer feedback auditing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>• Manual verification performed by Ata Bilişim Teknolojileri audit team.</p>
                <p>• Zero unverified or public anonymous review submissions.</p>
                <p>• Written workmanship guarantees for Approved Craftsmen.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trust & Verification Levels Section */}
        <section className="bg-muted/30 border-y border-border/60 py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary mb-3">
                Verification Architecture
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Understanding Verification Levels
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ustacik manually verifies credentials to make it easy for strangers to trust a craftsman they have never met.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {trustLevels.map((tl) => {
                const Icon = tl.icon;
                return (
                  <Card key={tl.level} className="border-border/70 bg-card">
                    <CardHeader className="p-5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="size-5" />
                        </div>
                        <Badge variant="outline" className={`text-xs font-semibold px-2.5 py-0.5 ${tl.badgeStyle}`}>
                          {tl.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-bold">{tl.level} Badge</CardTitle>
                      <CardDescription className="text-xs">{tl.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 pt-0">
                      <div className="space-y-2 border-t border-border/50 pt-3">
                        <p className="text-xs font-semibold text-foreground">Requirements:</p>
                        {tl.requirements.map((req) => (
                          <div key={req} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="container mx-auto px-4 md:px-6 py-12 max-w-4xl space-y-10">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <HelpCircle className="size-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Homeowners & Customers</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Customer Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="mt-4 w-full">
              {customerFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`customer-${index}`}>
                  <AccordionTrigger className="text-sm font-semibold text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="pt-6 border-t border-border/60">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Hammer className="size-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Craftsmen & Tradespeople</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Craftsman Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="mt-4 w-full">
              {craftsmanFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`craftsman-${index}`}>
                  <AccordionTrigger className="text-sm font-semibold text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Support Banner */}
        <section className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Card className="border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Mail className="size-5 text-primary" />
                  Still have questions?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
                  Our platform audit team at Ata Bilişim Teknolojileri is here to assist customers and craftsmen across Northern Cyprus.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button asChild className="gap-2 text-xs">
                  <Link href="/settings">
                    <UserCheck className="size-4" />
                    <span>Account Settings</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2 text-xs">
                  <Link href="/find-craftsmen">
                    <span>Find Craftsmen</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
