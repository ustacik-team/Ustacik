"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Image as ImageIcon, 
  ArrowRight, 
  Loader2, 
  FileText, 
  IdCard, 
  Users, 
  MapPin, 
  DollarSign, 
  Tag, 
  AlertCircle,
  Phone,
  Mail,
  Lock
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { useSession } from "@/lib/auth-client";

interface ApplicationData {
  id: string;
  referenceNumber?: string | null;
  fullName: string;
  email: string;
  phone: string;
  profilePhotoUrl?: string | null;
  businessName: string;
  bio?: string | null;
  regionName: string;
  categoryName: string;
  subServiceName: string;
  priceMin: string | number;
  priceMax: string | number;
  portfolioUrls: string[];
  idNumber?: string | null;
  businessRegistrationNumber?: string | null;
  workmanshipGuarantee: boolean;
  ref1Name?: string | null;
  ref1Phone?: string | null;
  ref2Name?: string | null;
  ref2Phone?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNotes?: string | null;
  createdAt: string;
}

export default function ApplicationStatusPage() {
  const { data: sessionData, isPending: sessionLoading } = useSession();
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [history, setHistory] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/applications");
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || json.error || "No application found.");
        }

        setApplication(json.data?.application || null);
        setHistory(json.data?.history || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load application status.");
      } finally {
        setLoading(false);
      }
    }

    if (!sessionLoading) {
      fetchStatus();
    }
  }, [sessionLoading]);

  const user = sessionData?.user
    ? {
        id: sessionData.user.id,
        email: sessionData.user.email,
        name: sessionData.user.name,
        role: sessionData.user.role || "CUSTOMER",
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={user} isLoading={sessionLoading} />

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

          {loading || sessionLoading ? (
            <Card className="p-12 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading your application details...</p>
            </Card>
          ) : error || !application ? (
            <Card className="p-8 text-center space-y-4 max-w-md mx-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No Application Found</h3>
              <p className="text-sm text-muted-foreground">
                {error || "You haven't submitted a craftsman application yet."}
              </p>
              <Button asChild className="mt-2">
                <Link href="/become-craftsman">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          ) : (
            <>
              {/* STATUS CARD */}
              <Card className="border border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/30 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-lg font-semibold">
                          Application Details
                        </CardTitle>
                        {application.referenceNumber && (
                          <Badge variant="secondary" className="font-mono text-xs">
                            Ref: #{application.referenceNumber}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs font-normal">
                          <Lock className="h-3 w-3 mr-1 text-muted-foreground" /> Read-Only
                        </Badge>
                      </div>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5">
                        Submitted on {new Date(application.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </CardDescription>
                    </div>

                    {/* STATUS BADGES */}
                    <div>
                      {application.status === "PENDING" && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium text-sm">
                          <Clock className="h-4 w-4 animate-pulse" />
                          <span>Pending Review</span>
                        </div>
                      )}

                      {application.status === "APPROVED" && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Approved</span>
                        </div>
                      )}

                      {application.status === "REJECTED" && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-medium text-sm">
                          <XCircle className="h-4 w-4" />
                          <span>Rejected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Status Info Message */}
                  {application.status === "PENDING" && (
                    <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-4 shadow-xs">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="font-bold text-base">Application Under Review</p>
                        <p className="text-xs opacity-90 leading-relaxed">
                          Your application (Ref: <span className="font-semibold">#{application.referenceNumber || application.id}</span>) was received on {new Date(application.createdAt).toLocaleDateString()} and is currently being reviewed by the Ustacik administration team.
                        </p>
                        <p className="text-xs opacity-75 pt-1">
                          You will receive an in-app notification once a decision has been made. All submitted information below is read-only.
                        </p>
                      </div>
                    </div>
                  )}

                  {application.status === "APPROVED" && (
                    <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start justify-between gap-4 flex-col sm:flex-row sm:items-center shadow-xs">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="font-bold text-base">🎉 Application Approved!</p>
                          <p className="text-xs opacity-90">
                            You are now a verified craftsman on Ustacik! Access your Craftsman Dashboard to manage job requests, portfolio, and settings.
                          </p>
                        </div>
                      </div>
                      
                      {/* PROMINENT ACTION BUTTON FOR APPROVED STATUS */}
                      <Button asChild size="default" className="shrink-0 font-medium bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Link href="/craftsman/dashboard">
                          Go to Craftsman Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  )}

                  {application.status === "REJECTED" && (
                    <div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-800 dark:text-rose-300 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 font-bold text-base">
                          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                          <span>Application Not Approved</span>
                        </div>
                        
                        {/* SUBMIT NEW APPLICATION BUTTON FOR REJECTED STATUS */}
                        <Button asChild size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-medium">
                          <Link href="/become-craftsman?reapply=true">
                            Submit New Application <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>

                      <p className="text-xs opacity-90">
                        Thank you for your interest in Ustacik. Unfortunately, your craftsman application (Ref: #{application.referenceNumber || application.id}) was not approved by our verification team.
                      </p>

                      {application.reviewNotes && (
                        <div className="mt-2 p-3 rounded bg-background/70 border border-rose-500/30 text-xs space-y-1">
                          <p className="font-semibold text-foreground">Rejection Feedback / Notes:</p>
                          <p className="text-muted-foreground whitespace-pre-wrap">{application.reviewNotes}</p>
                        </div>
                      )}
                    </div>
                  )}

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
                        {application.profilePhotoUrl && (
                          <div className="sm:col-span-2 md:col-span-3 flex items-center gap-3 pb-2 border-b border-border/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={application.profilePhotoUrl} 
                              alt={application.fullName} 
                              className="h-14 w-14 rounded-full object-cover border border-border"
                            />
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Profile Photo</p>
                              <p className="text-sm font-semibold">{application.fullName}</p>
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Full Name</p>
                          <p className="text-sm font-medium text-foreground">{application.fullName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email Address</p>
                          <p className="text-sm font-medium text-foreground flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {application.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Phone Number</p>
                          <p className="text-sm font-medium text-foreground flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {application.phone}
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
                          <p className="text-sm font-semibold text-foreground">{application.businessName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Region</p>
                          <p className="text-sm font-medium text-foreground flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {application.regionName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Service Category</p>
                          <p className="text-sm font-medium text-foreground flex items-center gap-1">
                            <Tag className="h-3.5 w-3.5 text-muted-foreground" /> {application.categoryName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Sub-Service</p>
                          <p className="text-sm font-medium text-foreground">{application.subServiceName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Price Range</p>
                          <p className="text-sm font-medium text-foreground flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> ₺{Number(application.priceMin).toLocaleString()} – ₺{Number(application.priceMax).toLocaleString()}
                          </p>
                        </div>
                        {application.bio && (
                          <div className="sm:col-span-2 md:col-span-3 pt-2 border-t border-border/20">
                            <p className="text-xs font-medium text-muted-foreground">Bio / Experience</p>
                            <p className="text-sm text-foreground mt-0.5 whitespace-pre-wrap">{application.bio}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 3: Portfolio Photos */}
                    {application.portfolioUrls && application.portfolioUrls.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <ImageIcon className="h-3.5 w-3.5" /> Portfolio Photos ({application.portfolioUrls.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 rounded-lg bg-muted/20 border border-border/30">
                          {application.portfolioUrls.map((url, idx) => (
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
                            {application.idNumber ? (
                              <span className="flex items-center gap-1">
                                <IdCard className="h-3.5 w-3.5 text-muted-foreground" /> {application.idNumber}
                              </span>
                            ) : (
                              <span className="text-muted-foreground italic text-xs">Not provided</span>
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Business Registration Number</p>
                          <p className="text-sm font-medium text-foreground">
                            {application.businessRegistrationNumber || <span className="text-muted-foreground italic text-xs">Not provided</span>}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Workmanship Guarantee</p>
                          <p className="text-sm font-medium text-foreground">
                            {application.workmanshipGuarantee ? (
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
                              <p className="text-muted-foreground">{application.ref1Name || "Not provided"}</p>
                              {application.ref1Phone && <p className="text-muted-foreground/80">{application.ref1Phone}</p>}
                            </div>
                            <div className="p-2.5 rounded bg-background/50 border border-border/30">
                              <p className="font-semibold text-foreground">Reference 2</p>
                              <p className="text-muted-foreground">{application.ref2Name || "Not provided"}</p>
                              {application.ref2Phone && <p className="text-muted-foreground/80">{application.ref2Phone}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {application.status === "APPROVED" && (
                  <CardFooter className="bg-muted/20 border-t border-border/30 py-4 flex justify-end">
                    <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                      <Link href="/craftsman/dashboard">
                        Go to Craftsman Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                )}
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
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

