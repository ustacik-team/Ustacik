import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, ArrowRight, CheckCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationType } from "@prisma/client";

interface NotificationsPreviewProps {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: NotificationType | string;
    isRead: boolean;
    createdAt: Date | string;
  }>;
}

const typeStyles: Record<string, { label: string; className: string }> = {
  JOB_REQUEST: { label: "Request", className: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" },
  JOB_ACCEPTED: { label: "Accepted", className: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20" },
  JOB_COMPLETED: { label: "Completed", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" },
  REVIEW_RECEIVED: { label: "Review", className: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" },
  VERIFICATION_APPROVED: { label: "Verified", className: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20" },
};

export function NotificationsPreview({ notifications }: NotificationsPreviewProps) {
  const displayNotifications = notifications.slice(0, 5);

  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <span>Notifications</span>
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-xs text-primary p-0 h-auto font-semibold">
            <Link href="/customer/notifications">
              <span>View All</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <CardDescription className="text-xs">
          Recent updates regarding your job requests and activity
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0">
        {displayNotifications.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCheck className="size-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">You&apos;re all caught up</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                No unread notifications or system alerts at this moment.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {displayNotifications.map((n) => {
              const style = typeStyles[n.type] || { label: n.type, className: "bg-muted text-muted-foreground" };
              const timeAgo = formatDistanceToNow(new Date(n.createdAt), { addSuffix: true });

              return (
                <div key={n.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="pt-1">
                    {!n.isRead ? (
                      <span className="size-2 rounded-full bg-primary block shadow-2xs" />
                    ) : (
                      <span className="size-2 rounded-full bg-muted-foreground/30 block" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-foreground truncate">{n.title}</p>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${style.className}`}>
                        {style.label}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/80 pt-0.5">{timeAgo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
