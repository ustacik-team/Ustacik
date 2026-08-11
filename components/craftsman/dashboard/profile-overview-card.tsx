import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, DollarSign, FileCheck, CheckCircle2 } from "lucide-react";
import { VerificationLevel, SubscriptionStatus } from "@prisma/client";

interface ProfileOverviewCardProps {
  profile: {
    businessName?: string | null;
    bio?: string | null;
    businessRegistrationNumber?: string | null;
    workmanshipGuarantee: boolean;
    priceRangeMin?: number | string | { toString: () => string } | null;
    priceRangeMax?: number | string | { toString: () => string } | null;
    verificationLevel: VerificationLevel | string;
    subscriptionStatus: SubscriptionStatus | string;
    region?: {
      name: string;
    } | null;
  } | null;
}

export function ProfileOverviewCard({ profile }: ProfileOverviewCardProps) {
  if (!profile) {
    return (
      <Card className="border-border/70 bg-card">
        <CardHeader className="p-4 sm:p-5">
          <CardTitle className="text-base font-bold">Business Profile</CardTitle>
          <CardDescription className="text-xs">No profile registered yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const minPrice = profile.priceRangeMin != null ? String(profile.priceRangeMin) : null;
  const maxPrice = profile.priceRangeMax != null ? String(profile.priceRangeMax) : null;
  const hasPriceRange = minPrice != null || maxPrice != null;
  const priceDisplay = hasPriceRange
    ? `$${minPrice ?? 0} - $${maxPrice ?? 0}`
    : "Not specified";

  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            <span>Business Profile Overview</span>
          </CardTitle>
          <Badge variant="secondary" className="text-xs font-semibold">
            {profile.subscriptionStatus}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Public profile and trust credentials visible to marketplace customers
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        {profile.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2 bg-muted/20 p-2.5 rounded-lg border border-border/50">
            &quot;{profile.bio}&quot;
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-border/50 p-2.5 space-y-0.5">
            <span className="text-[11px] text-muted-foreground block flex items-center gap-1">
              <DollarSign className="size-3 text-primary" /> Price Range
            </span>
            <span className="font-semibold text-foreground">{priceDisplay}</span>
          </div>

          <div className="rounded-lg border border-border/50 p-2.5 space-y-0.5">
            <span className="text-[11px] text-muted-foreground block flex items-center gap-1">
              <FileCheck className="size-3 text-primary" /> Registration #
            </span>
            <span className="font-semibold text-foreground truncate block">
              {profile.businessRegistrationNumber || "N/A"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {profile.workmanshipGuarantee && (
            <Badge variant="outline" className="text-[11px] border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 gap-1">
              <CheckCircle2 className="size-3" />
              Workmanship Guarantee
            </Badge>
          )}
          {profile.region && (
            <Badge variant="outline" className="text-[11px] gap-1">
              Region: {profile.region.name}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
