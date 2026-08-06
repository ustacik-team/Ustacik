import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafetyNoticeProps {
  className?: string;
}

export function SafetyNotice({ className }: SafetyNoticeProps) {
  return (
    <Alert className={cn("border-border/40 bg-card/60 backdrop-blur-sm shadow-sm", className)}>
      <ShieldAlert className="h-5 w-5 text-amber-500" />
      <AlertTitle className="text-sm font-semibold">Safety Notice</AlertTitle>
      <AlertDescription className="text-sm text-muted-foreground leading-relaxed">
        Ustacik connects customers with craftsmen but does not guarantee workmanship or manage payments. Check each craftsman&apos;s verification status before engaging their services.{" "}        <Link href="/terms" className="font-medium text-primary underline-offset-4 hover:underline transition-colors">
          Terms of Service
        </Link>
      </AlertDescription>
    </Alert>
  );
}