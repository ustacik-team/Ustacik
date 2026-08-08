"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface VerificationCardProps {
  verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  phoneVerified: boolean;
  idVerified: boolean;
  referencesVerified: boolean;
  workPhotosVerified: boolean;
  businessRegistrationVerified: boolean;
  guaranteeVerified: boolean;
  verifiedBy?: { name: string } | null;
  verifiedAt?: Date | string | null;
}

export function VerificationCard({
  verificationLevel,
  phoneVerified,
  idVerified,
  referencesVerified,
  workPhotosVerified,
  businessRegistrationVerified,
  guaranteeVerified,
  verifiedBy,
  verifiedAt,
}: VerificationCardProps) {
  const levelConfig = {
    REGISTERED: {
      label: "Registered",
      badgeColor:
        "bg-slate-500/15 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-800",
    },
    VERIFIED: {
      label: "Verified",
      badgeColor:
        "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    APPROVED: {
      label: "Approved Craftsman",
      badgeColor:
        "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
  };

  const currentLevel = levelConfig[verificationLevel];

  const checklistItems = [
    {
      id: "phone",
      label: "Phone Verified",
      isVerified: phoneVerified,
      tooltip: "Phone number verified via SMS OTP.",
    },
    {
      id: "id",
      label: "Government ID Verified",
      isVerified: idVerified,
      tooltip: "Government-issued identity document validated.",
    },
    {
      id: "references",
      label: "Previous Customer References",
      isVerified: referencesVerified,
      tooltip: "Past customers contacted to verify quality and reliability.",
    },
    {
      id: "photos",
      label: "Work Photos Verified",
      isVerified: workPhotosVerified,
      tooltip: "Portfolio images reviewed and confirmed as original.",
    },
    {
      id: "business_reg",
      label: "Business Registration Verified",
      isVerified: businessRegistrationVerified,
      tooltip: "Official business registry check completed.",
    },
    {
      id: "guarantee",
      label: "Workmanship Guarantee",
      isVerified: guaranteeVerified,
      tooltip: "Craftsman provides a written guarantee on their work.",
    },
  ];

  const formattedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const verifiedCount = checklistItems.filter((item) => item.isVerified).length;
  const verificationProgress = Math.round((verifiedCount / checklistItems.length) * 100);

  return (
    <TooltipProvider delayDuration={200}>
      {/* ✅ REMOVED "h-full" from here so it only takes up its natural height */}
      <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/20">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Trust &amp; Verification
          </CardTitle>
          <Badge variant="outline" className={cn("px-3 py-1 text-xs font-semibold", currentLevel.badgeColor)}>
            {currentLevel.label}
          </Badge>
        </CardHeader>

        <CardContent className="pt-4 pb-4 space-y-3">
          <div className="rounded-xl border border-primary/10 bg-primary/[0.035] p-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Verification checklist</span>
              <span className="text-primary">{verifiedCount} of {checklistItems.length} complete</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400" style={{ width: verificationProgress + "%" }} />
            </div>
          </div>
          <div className="space-y-1.5">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-1 border-b border-border/10 last:border-0"
              >
                <div className="flex items-center gap-3">
                  {item.isVerified ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      item.isVerified ? "text-foreground" : "text-muted-foreground/50"
                    )}
                  >
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-muted-foreground/60 cursor-help underline decoration-dotted underline-offset-2">
                        {item.isVerified ? "Verified" : "Pending"}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-center text-xs">
                      <p>{item.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>

          {(verifiedBy || formattedDate) && (
            <div className="pt-2 border-t border-border/20 grid grid-cols-2 gap-3 text-sm">
              {verifiedBy && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Verified By
                  </span>
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{verifiedBy.name}</span>
                  </div>
                </div>
              )}
              {formattedDate && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Verification Date
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{formattedDate}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
