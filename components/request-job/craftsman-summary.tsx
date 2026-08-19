import { BriefcaseBusiness, CheckCircle2, MapPin, WalletCards } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationBadge } from "@/components/craftsmen/verification-badge";

interface CraftsmanSummaryProps {
  craftsman: {
    id: string;
    name: string;
    businessName: string | null;
    image: string | null;
    bio: string | null;
    verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
    region: string;
    categories: { id: string; name: string }[];
    subServices: { id: string; name: string }[];
    priceMin: number | null;
    priceMax: number | null;
    totalJobsCompleted: number;
    workmanshipGuarantee: boolean;
  };
}

export function CraftsmanSummary({ craftsman }: CraftsmanSummaryProps) {
  const initials = craftsman.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const hasGuarantee = craftsman.workmanshipGuarantee || craftsman.verificationLevel === "APPROVED";

  return (
    <Card className="border-primary/15 bg-card/90 shadow-md shadow-primary/5">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="size-20 border-4 border-primary/10 shadow-sm shrink-0">
            <AvatarImage src={craftsman.image ?? undefined} alt={craftsman.name} />
            <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{craftsman.name}</h2>
                {craftsman.businessName && (
                  <p className="text-sm text-muted-foreground">{craftsman.businessName}</p>
                )}
              </div>
              <VerificationBadge level={craftsman.verificationLevel} />
            </div>
            {craftsman.bio && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{craftsman.bio}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm pt-1">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4 text-primary shrink-0" />
                {craftsman.region}
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <BriefcaseBusiness className="size-4 text-primary shrink-0" />
                {craftsman.totalJobsCompleted} jobs completed
              </span>
              {(craftsman.priceMin !== null || craftsman.priceMax !== null) && (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <WalletCards className="size-4 text-primary shrink-0" />
                  ₺{craftsman.priceMin ?? 0}–₺{craftsman.priceMax ?? "N/A"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {craftsman.categories.map((cat) => (
            <Badge key={cat.id} variant="secondary" className="font-medium">
              {cat.name}
            </Badge>
          ))}
          {hasGuarantee && (
            <Badge className="gap-1 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              Workmanship guarantee
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
