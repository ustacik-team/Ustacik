import { BadgeCheck, MapPin, ReceiptText, WalletCards, Layers } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VerificationBadge } from "@/components/craftsmen/verification-badge";

interface RequestSummaryProps {
  craftsman: {
    name: string;
    region: string;
    priceMin: number | null;
    priceMax: number | null;
    verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  };
  selectedCategoryName?: string;
  selectedSubServiceName?: string;
  jobTitle?: string;
  address?: string;
}

export function RequestSummary({
  craftsman,
  selectedCategoryName,
  selectedSubServiceName,
  jobTitle,
  address,
}: RequestSummaryProps) {
  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="border-b border-border/60">
        <CardTitle className="flex items-center gap-2 text-base">
          <ReceiptText className="size-5 text-primary" />
          Request summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-5 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Craftsman</p>
          <p className="mt-1 font-semibold">{craftsman.name}</p>
        </div>

        <Separator />

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <BadgeCheck className="size-4 text-primary shrink-0" /> Category
            </span>
            <span className="font-medium text-right truncate max-w-40">
              {selectedCategoryName || "Not selected"}
            </span>
          </div>

          {selectedSubServiceName && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Layers className="size-4 text-primary shrink-0" /> Service
              </span>
              <span className="font-medium text-right truncate max-w-40">
                {selectedSubServiceName}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4 text-primary shrink-0" /> Region
            </span>
            <span className="font-medium">{craftsman.region}</span>
          </div>

          {(craftsman.priceMin !== null || craftsman.priceMax !== null) && (
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <WalletCards className="size-4 text-primary shrink-0" /> Est. Range
              </span>
              <span className="font-medium">
                ₺{craftsman.priceMin ?? 0}–₺{craftsman.priceMax ?? "N/A"}
              </span>
            </div>
          )}
        </div>

        {(jobTitle || address) && (
          <>
            <Separator />
            <div className="space-y-2 text-xs">
              {jobTitle && (
                <div>
                  <p className="text-muted-foreground font-medium">Title:</p>
                  <p className="font-semibold text-foreground line-clamp-1">{jobTitle}</p>
                </div>
              )}
              {address && (
                <div>
                  <p className="text-muted-foreground font-medium">Address:</p>
                  <p className="font-medium text-foreground line-clamp-2">{address}</p>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Verification</span>
            <VerificationBadge level={craftsman.verificationLevel} />
          </div>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground">Status preview</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">Pending review</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
