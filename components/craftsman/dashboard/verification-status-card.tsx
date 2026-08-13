import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Check, Clock } from "lucide-react";
import { VerificationLevel } from "@prisma/client";

interface VerificationStatusCardProps {
  level: VerificationLevel | string;
  record?: {
    phoneVerified: boolean;
    idVerified: boolean;
    referencesVerified: boolean;
    workPhotosVerified: boolean;
    businessRegistrationVerified: boolean;
    guaranteeVerified: boolean;
    notes?: string | null;
  } | null;
}

export function VerificationStatusCard({ level, record }: VerificationStatusCardProps) {
  const isApproved = level === VerificationLevel.APPROVED;
  const isVerified = level === VerificationLevel.VERIFIED || isApproved;

  const checks = [
    { label: "Phone Number Verified", passed: record?.phoneVerified ?? isVerified },
    { label: "Identity Documents", passed: record?.idVerified ?? isVerified },
    { label: "Work Portfolio Photos", passed: record?.workPhotosVerified ?? isVerified },
    { label: "Customer References", passed: record?.referencesVerified ?? isApproved },
    { label: "Business Registration", passed: record?.businessRegistrationVerified ?? isApproved },
    { label: "Workmanship Guarantee", passed: record?.guaranteeVerified ?? isApproved },
  ];

  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span>Verification Status</span>
          </CardTitle>
          <Badge
            variant="outline"
            className={
              isApproved
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                : isVerified
                ? "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold"
                : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold"
            }
          >
            {isApproved ? "Approved Craftsman" : isVerified ? "Verified Craftsman" : "Registered Member"}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {isApproved
            ? "Your account holds the highest trust rating with complete background checks."
            : isVerified
            ? "Your identity is verified. Complete reference checks to get Approved status."
            : "Verification checks build trust with potential customers on Ustacik."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {checks.map((chk) => (
            <div
              key={chk.label}
              className={`flex items-center gap-1.5 rounded-lg border p-2 ${
                chk.passed
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-950 dark:text-emerald-100"
                  : "border-border/50 bg-muted/30 text-muted-foreground"
              }`}
            >
              {chk.passed ? (
                <Check className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <Clock className="size-3.5 text-amber-500 shrink-0" />
              )}
              <span className="truncate font-medium">{chk.label}</span>
            </div>
          ))}
        </div>

        {record?.notes && (
          <p className="text-[11px] text-muted-foreground border-t pt-2 italic">
            Verification Note: &quot;{record.notes}&quot;
          </p>
        )}
      </CardContent>
    </Card>
  );
}
