import { BadgeCheck, MapPin, ReceiptText, WalletCards } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VerificationBadge, type VerificationLevel } from "@/components/craftsmen/verification-badge";

interface RequestSummaryProps { craftsman: { name: string; category: string; region: string; priceMin: number; priceMax: number; verificationLevel: VerificationLevel } }

export function RequestSummary({ craftsman }: RequestSummaryProps) {
  return <Card className="border-border/70 bg-card/90 shadow-sm"><CardHeader className="border-b border-border/60"><CardTitle className="flex items-center gap-2"><ReceiptText className="size-5 text-primary" />Your request</CardTitle></CardHeader><CardContent className="space-y-4 pt-5 text-sm">
    <div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Sending to</p><p className="mt-1 font-semibold">{craftsman.name}</p></div><Separator />
    <div className="space-y-3"><p className="flex items-center gap-2"><BadgeCheck className="size-4 text-primary" /><span className="text-muted-foreground">Category</span><span className="ml-auto text-right font-medium">{craftsman.category}</span></p><p className="flex items-center gap-2"><MapPin className="size-4 text-primary" /><span className="text-muted-foreground">Region</span><span className="ml-auto font-medium">{craftsman.region}</span></p><p className="flex items-center gap-2"><WalletCards className="size-4 text-primary" /><span className="text-muted-foreground">Estimated range</span><span className="ml-auto font-medium">₺{craftsman.priceMin}–₺{craftsman.priceMax}</span></p></div><Separator />
    <div className="flex items-center justify-between gap-2"><span className="text-muted-foreground">Verification</span><VerificationBadge level={craftsman.verificationLevel} /></div>
  </CardContent></Card>;
}
