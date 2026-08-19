import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap } from "lucide-react";
import { SubscriptionStatus } from "@prisma/client";

interface SubscriptionCardProps {
  status: SubscriptionStatus | string;
}

const statusConfig: Record<string, { label: string; className: string; description: string }> = {
  FREE: {
    label: "Free Plan",
    className: "border-gray-500/30 bg-gray-500/10 text-gray-700 dark:text-gray-300",
    description: "Standard visibility on Ustacik marketplace.",
  },
  ACTIVE: {
    label: "Pro Active Subscription",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold",
    description: "Featured craftsman badge & priority search ranking active.",
  },
  EXPIRED: {
    label: "Subscription Expired",
    className: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    description: "Your pro plan has expired. Renew to restore featured placement.",
  },
};

export function SubscriptionCard({ status }: SubscriptionCardProps) {
  const config = statusConfig[status] || statusConfig.FREE;

  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Crown className="size-4 text-amber-500" />
            <span>Subscription Status</span>
          </CardTitle>
          <Badge variant="outline" className={`text-xs px-2.5 py-0.5 ${config.className}`}>
            {config.label}
          </Badge>
        </div>
        <CardDescription className="text-xs">{config.description}</CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-2.5">
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Zap className="size-3.5 text-primary shrink-0" />
            <span>Marketplace Visibility Perks</span>
          </div>
          <ul className="text-muted-foreground space-y-1 pl-5 list-disc text-[11px]">
            <li>Customer request notifications</li>
            <li>Verified craftsman badge eligibility</li>
            <li>Search category listing placement</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
