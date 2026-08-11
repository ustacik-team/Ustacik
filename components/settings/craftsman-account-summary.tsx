import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Building2,
  MapPin,
  ShieldCheck,
  Award,
  Crown,
  CheckCircle2,
  XCircle,
  Briefcase,
  Images,
  ExternalLink,
} from "lucide-react";
import { VerificationLevel, SubscriptionStatus } from "@prisma/client";

interface CraftsmanAccountSummaryProps {
  profile: {
    id: string;
    businessName?: string | null;
    bio?: string | null;
    verificationLevel: VerificationLevel | string;
    subscriptionStatus: SubscriptionStatus | string;
    totalJobsCompleted: number;
    workmanshipGuarantee: boolean;
    businessRegistrationNumber?: string | null;
    region?: {
      id: string;
      name: string;
    } | null;
  };
}

export function CraftsmanAccountSummary({ profile }: CraftsmanAccountSummaryProps) {
  return (
    <Card className="border-border/70 bg-card shadow-xs">
      <CardHeader className="p-5 sm:p-6 pb-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Building2 className="size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Business Summary</span>
            </div>
            <CardTitle className="text-lg font-bold tracking-tight mt-1">
              Craftsman Profile Overview
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Concise summary of your professional presence and capabilities
            </CardDescription>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs">
              <Link href="/craftsman/services">
                <Wrench className="size-3.5" />
                <span>Services</span>
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs">
              <Link href="/craftsman/portfolio">
                <Images className="size-3.5" />
                <span>Portfolio</span>
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Business Name */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Building2 className="size-3.5 text-primary" />
              <span>Business Name</span>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">
              {profile.businessName || "Individual Specialist"}
            </p>
          </div>

          {/* Operating Region */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <MapPin className="size-3.5 text-primary" />
              <span>Region / Location</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {profile.region?.name || "Northern Cyprus"}
            </p>
          </div>

          {/* Verification Level */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Award className="size-3.5 text-primary" />
              <span>Verification Level</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{profile.verificationLevel}</p>
          </div>

          {/* Subscription Status */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Crown className="size-3.5 text-amber-500" />
              <span>Subscription Tier</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{profile.subscriptionStatus}</p>
          </div>

          {/* Workmanship Guarantee */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Workmanship Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              {profile.workmanshipGuarantee ? (
                <>
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Active & Covered
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="size-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">Not Enabled</span>
                </>
              )}
            </div>
          </div>

          {/* Business Reg Number */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Building2 className="size-3.5 text-primary" />
              <span>Registration No.</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {profile.businessRegistrationNumber || "Not provided"}
            </p>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs">
            <Link href="/craftsman/services">
              <Wrench className="size-3.5 text-primary" />
              <span>Manage Services</span>
              <ExternalLink className="size-3 opacity-60 ml-0.5" />
            </Link>
          </Button>

          <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs">
            <Link href="/craftsman/portfolio">
              <Images className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>View Portfolio</span>
              <ExternalLink className="size-3 opacity-60 ml-0.5" />
            </Link>
          </Button>

          <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs">
            <Link href="/craftsman/job-requests">
              <Briefcase className="size-3.5 text-sky-600 dark:text-sky-400" />
              <span>View Job Requests</span>
              <ExternalLink className="size-3 opacity-60 ml-0.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
