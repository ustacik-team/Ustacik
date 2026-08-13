import { Card, CardContent } from "@/components/ui/card";
import { Bell, AlertCircle, CheckCircle2 } from "lucide-react";

interface NotificationSummaryProps {
  totalCount: number;
  unreadCount: number;
}

export function NotificationSummary({ totalCount, unreadCount }: NotificationSummaryProps) {
  const readCount = Math.max(totalCount - unreadCount, 0);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card className="border-border/70 bg-card">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
            <Bell className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-extrabold leading-none text-foreground">{totalCount}</p>
            <p className="mt-1 text-xs font-semibold text-foreground/80 truncate">Total Notifications</p>
            <p className="text-[11px] text-muted-foreground truncate">All system &amp; activity alerts</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
            <AlertCircle className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-extrabold leading-none text-foreground">{unreadCount}</p>
            <p className="mt-1 text-xs font-semibold text-foreground/80 truncate">Unread Alerts</p>
            <p className="text-[11px] text-muted-foreground truncate">Requires your attention</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card">
        <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-extrabold leading-none text-foreground">{readCount}</p>
            <p className="mt-1 text-xs font-semibold text-foreground/80 truncate">Read Activity</p>
            <p className="text-[11px] text-muted-foreground truncate">Acknowledged notifications</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
