import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { Role } from "@prisma/client";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle2, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Image as ImageIcon, 
  FileText, 
  IdCard, 
  Users, 
  MapPin, 
  DollarSign, 
  Tag, 
  Phone,
  Mail,
  Lock
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Application Status | Ustacik",
  description: "Check the status of your craftsman application on Ustacik.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ApplicationStatusPage() {
  const session = await getServerSession();
  const user = session?.user;

  // 1. Unauthenticated user -> redirect to sign-in
  if (!user) {
    redirect("/sign-in?redirect=/application-status");
  }

  // 2. Role checks
  if (user.role === Role.ADMIN) {
    redirect("/admin/dashboard");
  }

  if (user.role === Role.CRAFTSMAN) {
    redirect("/craftsman/dashboard");
  }

  // 3. Query user's craftsman applications directly using Prisma
  const applications = await prisma.craftsmanApplication.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const latestApplication = applications[0] || null;
  const history = applications.slice(1);

  // 4. Validate application & status redirects
  if (!latestApplication) {
    redirect("/become-craftsman");
  }

  if (latestApplication.status === "APPROVED") {
    redirect("/craftsman/dashboard");
  }

  if (latestApplication.status === "REJECTED") {
    redirect("/become-craftsman?reapply=true");
  }

  // At this point, the user is a CUSTOMER with a PENDING application
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={user} hasApplication={true} />

      <main className="flex-1 py-10 md:py-16 bg-muted/10">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Application Status
            </h1>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">
              Track your craftsman application progress and review your submitted credentials.
            </p>
          </div>

          {/* STATUS CARD */}
          <Card className="border border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg font-semibold">
                      Application Details
                    </CardTitle>
                    {latestApplication.referenceNumber && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        Ref: #{latestApplication.referenceNumber}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs font-normal">
                      <Lock className="h-3 w-3 mr-1 text-muted-foreground" /> Read-Only
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Submitted on {new Date(latestApplication.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </CardDescription>
                </div>

                {/* STATUS BADGES */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium text-sm">
                    <Clock className="h-4 w-4 animate-pulse" />
                    <span>Pending Review</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Status Info Message */}
              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-4 shadow-xs">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-bold text-base">Application Under Review</p>
                  <p className="text-xs opacity-90 leading-relaxed">
                    Your application (Ref: <span className="font-semibold">#{latestApplication.referenceNumber || latestApplication.id}</span>) was received on {new Date(latestApplication.createdAt).toLocaleDateString()} and is currently being reviewed by the Ustacik administration team.
                  </p>
                  <p className="text-xs opacity-75 pt-1">
                    You will receive an in-app notification once a decision has been made. All submitted information below is read-only.
                  </p>
                </div>
              </div>

              {/* READ-ONLY SUBMITTED INFORMATION */}
              <div className="space-y-6 pt-2">
                <div className="border-b border-border/40 pb-2">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Submitted Application Information
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Below is a read-only record of all information provided during submission.
                  </p>
                </div>

                {/* Section 1: Personal Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> Personal Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/20 border border-border/30">
                    {latestApplication.profilePhotoUrl && (
                      <div className="sm:col-span-2 md:col-span-3 flex items-center gap-3 pb-2 border-b border-border/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={latestApplication.profilePhotoUrl} 
                          alt={latestApplication.fullName} 
                          className="h-14 w-14 rounded-full object-cover border border-border"
                        />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Profile Photo</p>
                          <p className="text-sm font-semibold">{latestApplication.fullName}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Full Name</p>
                      <p className="text-sm font-medium text-foreground">{latestApplication.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Email Address</p>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {latestApplication.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Phone Number</p>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {latestApplication.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Business Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> Business Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/20 border border-border/30">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Business Name</p>
                      <p className="text-sm font-semibold text-foreground">{latestApplication.businessName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Region</p>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {latestApplication.regionName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Service Category</p>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" /> {latestApplication.categoryName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Sub-Service</p>
                      <p className="text-sm font-medium text-foreground">{latestApplication.subServiceName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Price Range</p>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> ₺{Number(latestApplication.priceMin).toLocaleString()} – ₺{Number(latestApplication.priceMax).toLocaleString()}
                      </p>
                    </div>
                    {latestApplication.bio && (
                      <div className="sm:col-span-2 md:col-span-3 pt-2 border-t border-border/20">
                        <p className="text-xs font-medium text-muted-foreground">Bio / Experience</p>
                        <p className="text-sm text-foreground mt-0.5 whitespace-pre-wrap">{latestApplication.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Portfolio Photos */}
                {latestApplication.portfolioUrls && latestApplication.portfolioUrls.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5" /> Portfolio Photos ({latestApplication.portfolioUrls.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 rounded-lg bg-muted/20 border border-border/30">
                      {latestApplication.portfolioUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-border/40 bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Work sample ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 4: Verification & References */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verification Documents &amp; References
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/20 border border-border/30">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">ID / Passport Number</p>
                      <p className="text-sm font-medium text-foreground">
                        {latestApplication.idNumber ? (
                          <span className="flex items-center gap-1">
                            <IdCard className="h-3.5 w-3.5 text-muted-foreground" /> {latestApplication.idNumber}
                          </span>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">Not provided</span>
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Business Registration Number</p>
                      <p className="text-sm font-medium text-foreground">
                        {latestApplication.businessRegistrationNumber || <span className="text-muted-foreground italic text-xs">Not provided</span>}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Workmanship Guarantee</p>
                      <p className="text-sm font-medium text-foreground">
                        {latestApplication.workmanshipGuarantee ? (
                          <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Yes (Guarantee Provided)
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">No</span>
                        )}
                      </p>
                    </div>

                    {/* References */}
                    <div className="sm:col-span-2 pt-2 border-t border-border/20 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> Customer References
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded bg-background/50 border border-border/30">
                          <p className="font-semibold text-foreground">Reference 1</p>
                          <p className="text-muted-foreground">{latestApplication.ref1Name || "Not provided"}</p>
                          {latestApplication.ref1Phone && <p className="text-muted-foreground/80">{latestApplication.ref1Phone}</p>}
                        </div>
                        <div className="p-2.5 rounded bg-background/50 border border-border/30">
                          <p className="font-semibold text-foreground">Reference 2</p>
                          <p className="text-muted-foreground">{latestApplication.ref2Name || "Not provided"}</p>
                          {latestApplication.ref2Phone && <p className="text-muted-foreground/80">{latestApplication.ref2Phone}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PAST APPLICATION HISTORY */}
          {history.length > 0 && (
            <Card className="border border-border/40 bg-card/60 shadow-xs">
              <CardHeader className="py-3 border-b border-border/30">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Previous Application Submissions ({history.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-xs">
                {history.map((pastApp) => (
                  <div key={pastApp.id} className="p-3 rounded-lg bg-muted/20 border border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        Ref: #{pastApp.referenceNumber || pastApp.id} — {pastApp.businessName}
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Submitted: {new Date(pastApp.createdAt).toLocaleDateString()}
                      </p>
                      {pastApp.reviewNotes && (
                        <p className="text-rose-600 dark:text-rose-400 text-[11px] mt-0.5">
                          Feedback: {pastApp.reviewNotes}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className={pastApp.status === "REJECTED" ? "text-rose-600 border-rose-500/30 shrink-0" : "shrink-0"}>
                      {pastApp.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
