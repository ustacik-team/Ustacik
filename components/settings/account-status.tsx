import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldCheck, CheckCircle2, AlertTriangle, Calendar, Award, Crown, Briefcase } from "lucide-react";
import { VerificationLevel, SubscriptionStatus } from "@prisma/client";

interface AccountStatusProps {
  user: {
    role: string;
    banned?: boolean | null;
    banReason?: string | null;
    createdAt: Date;
  };
  craftsmanProfile?: {
    verificationLevel: VerificationLevel | string;
    subscriptionStatus: SubscriptionStatus | string;
    totalJobsCompleted: number;
  } | null;
}

const vLevelBadge: Record<string, { label: string; style: string }> = {
  REGISTERED: {
    label: "Registered Member",
    style: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/30",
  },
  VERIFIED: {
    label: "ID & Phone Verified",
    style: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
  APPROVED: {
    label: "Fully Approved Craftsman",
    style: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
};

const subBadge: Record<string, { label: string; style: string }> = {
  FREE: {
    label: "Free Plan",
    style: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/30",
  },
  ACTIVE: {
    label: "Active Subscription",
    style: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  EXPIRED: {
    label: "Expired Subscription",
    style: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  },
};

export function AccountStatus({ user, craftsmanProfile }: AccountStatusProps) {
  const formattedJoinedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(user.createdAt));

  const isBanned = !!user.banned;

  return (
    <Card className="border-border/70 bg-card shadow-xs">
      <CardHeader className="p-5 sm:p-6 pb-3">
        <div className="flex items-center gap-2 text-primary">
          <Activity className="size-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Account Metrics</span>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight mt-1">Account Status</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Platform standing, verification state, and subscription tiers
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Standing / Banned Status */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="size-4 text-primary" />
              <span>Platform Standing</span>
            </div>
            <div className="flex items-center gap-2">
              {isBanned ? (
                <>
                  <AlertTriangle className="size-4 text-rose-500 shrink-0" />
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30">
                    Suspended
                  </Badge>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                    Active & Good Standing
                  </Badge>
                </>
              )}
            </div>
            {isBanned && user.banReason && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">
                Reason: {user.banReason}
              </p>
            )}
          </div>

          {/* Date Joined */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Calendar className="size-4 text-primary" />
              <span>Registration Date</span>
            </div>
            <p className="text-sm font-bold text-foreground">{formattedJoinedDate}</p>
          </div>

          {/* Craftsman Specific Status items */}
          {user.role === "CRAFTSMAN" && craftsmanProfile && (
            <>
              {/* Verification Level */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Award className="size-4 text-primary" />
                  <span>Verification Level</span>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold ${
                      vLevelBadge[craftsmanProfile.verificationLevel]?.style || vLevelBadge.REGISTERED.style
                    }`}
                  >
                    {vLevelBadge[craftsmanProfile.verificationLevel]?.label || craftsmanProfile.verificationLevel}
                  </Badge>
                </div>
              </div>

              {/* Subscription Status */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Crown className="size-4 text-amber-500" />
                  <span>Subscription Plan</span>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold ${
                      subBadge[craftsmanProfile.subscriptionStatus]?.style || subBadge.FREE.style
                    }`}
                  >
                    {subBadge[craftsmanProfile.subscriptionStatus]?.label || craftsmanProfile.subscriptionStatus}
                  </Badge>
                </div>
              </div>

              {/* Jobs Completed */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Briefcase className="size-4 text-primary" />
                  <span>Total Completed Jobs</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {craftsmanProfile.totalJobsCompleted} jobs
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
