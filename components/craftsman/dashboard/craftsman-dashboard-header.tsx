import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, ShieldCheck, Sparkles } from "lucide-react";
import { VerificationLevel } from "@prisma/client";

interface CraftsmanDashboardHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  profile: {
    businessName?: string | null;
    verificationLevel: VerificationLevel | string;
    region?: {
      name: string;
    } | null;
  } | null;
}

const levelBadgeStyles: Record<string, { label: string; className: string }> = {
  REGISTERED: {
    label: "Registered Member",
    className: "border-gray-500/30 bg-gray-500/10 text-gray-700 dark:text-gray-300",
  },
  VERIFIED: {
    label: "ID & Phone Verified",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  APPROVED: {
    label: "Fully Approved Craftsman",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
};

export function CraftsmanDashboardHeader({ user, profile }: CraftsmanDashboardHeaderProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CR";

  const vLevel = profile?.verificationLevel || "REGISTERED";
  const badgeInfo = levelBadgeStyles[vLevel] || levelBadgeStyles.REGISTERED;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/70 bg-gradient-to-r from-card via-card to-primary/5 p-4 sm:p-6 shadow-xs">
      <div className="flex items-center gap-4 min-w-0">
        <Avatar className="size-14 sm:size-16 border-2 border-primary/20 shadow-xs shrink-0">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
              {user.name}
            </h1>
            <Badge variant="outline" className={`text-xs font-semibold px-2.5 py-0.5 ${badgeInfo.className}`}>
              <ShieldCheck className="size-3.5 mr-1" />
              {badgeInfo.label}
            </Badge>
          </div>

          <p className="text-sm font-medium text-muted-foreground truncate">
            {profile?.businessName || "Craftsman Specialist"}
            {profile?.region && (
              <span className="inline-flex items-center gap-1 ml-3 text-xs text-foreground/80 font-normal">
                <MapPin className="size-3.5 text-primary shrink-0" />
                {profile.region.name}
              </span>
            )}
          </p>

          <p className="text-xs text-muted-foreground hidden sm:block">
            Welcome back! Monitor incoming customer requests and track your active business activity.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
        <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs">
          <Link href="/settings">
            <User className="size-3.5" />
            <span>Settings</span>
          </Link>
        </Button>
        <Button size="sm" asChild className="gap-1.5 text-xs">
          <Link href="/craftsman/job-requests">
            <Sparkles className="size-3.5" />
            <span>Job Requests</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
