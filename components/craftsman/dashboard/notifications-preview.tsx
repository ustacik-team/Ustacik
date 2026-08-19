import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight, CheckCheck } from "lucide-react";
import { NotificationType } from "@prisma/client";

export interface DashboardNotificationItem {
  id: string;
  type: NotificationType | string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
}

interface NotificationsPreviewProps {
  notifications: DashboardNotificationItem[];
}

export function NotificationsPreview({ notifications }: NotificationsPreviewProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Bell className="size-4 text-primary" />
              <span>Notifications Preview</span>
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs">
            System alerts, job updates, and customer activity
          </CardDescription>
        </div>
        <Button size="sm" variant="ghost" className="gap-1 text-xs h-8 text-primary hover:text-primary" asChild>
          <Link href="/craftsman/notifications">
            <span>Inbox</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-2.5">
        {notifications.length > 0 ? (
          notifications.slice(0, 3).map((notif) => {
            const formattedDate = new Date(notif.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={notif.id}
                className={`rounded-xl border p-3 space-y-1 transition-colors ${
                  notif.isRead
                    ? "border-border/50 bg-muted/15"
                    : "border-primary/30 bg-primary/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{formattedDate}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground space-y-1">
            <CheckCheck className="size-6 mx-auto text-emerald-500" />
            <p className="font-medium text-foreground">You&apos;re all caught up.</p>
            <p>No new notifications right now.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
