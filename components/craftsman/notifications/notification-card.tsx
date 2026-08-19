"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  CheckCircle2,
  CheckCheck,
  Star,
  ShieldCheck,
  Clock,
  Check,
  Loader2,
  Bell,
  LucideIcon,
} from "lucide-react";
import { NotificationType } from "@prisma/client";
import { markNotificationAsReadAction } from "@/app/(dashboard)/craftsman/notifications/actions";
import { notifyNotificationsUpdated } from "@/hooks/use-unread-notifications-count";
import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  type: NotificationType | string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
}

interface NotificationCardProps {
  notification: NotificationItem;
}

const typeConfigs: Record<
  string,
  {
    icon: LucideIcon;
    label: string;
    iconColor: string;
    iconBg: string;
    badgeStyle: string;
  }
> = {
  JOB_REQUEST: {
    icon: Briefcase,
    label: "Job Request",
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    badgeStyle: "border-primary/30 bg-primary/10 text-primary",
  },
  JOB_ACCEPTED: {
    icon: CheckCircle2,
    label: "Accepted Job",
    iconColor: "text-sky-600 dark:text-sky-400",
    iconBg: "bg-sky-500/10",
    badgeStyle: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  JOB_COMPLETED: {
    icon: CheckCheck,
    label: "Work Finalized",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
    badgeStyle: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  REVIEW_RECEIVED: {
    icon: Star,
    label: "Customer Review",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/10",
    badgeStyle: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  VERIFICATION_APPROVED: {
    icon: ShieldCheck,
    label: "Verification Status",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
    badgeStyle: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
};

export function NotificationCard({ notification }: NotificationCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const config = typeConfigs[notification.type] || {
    icon: Bell,
    label: "System Alert",
    iconColor: "text-muted-foreground",
    iconBg: "bg-muted/20",
    badgeStyle: "border-border/60 bg-muted/20 text-muted-foreground",
  };

  const Icon = config.icon;

  const formattedDate = new Date(notification.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleMarkRead = async () => {
    setIsUpdating(true);
    const toastId = toast.loading("Updating notification status...");

    try {
      const result = await markNotificationAsReadAction(notification.id);
      if (result.success) {
        toast.success("Notification marked as read.", { id: toastId });
        notifyNotificationsUpdated();
      } else {
        toast.error(result.error || "Failed to update notification.", { id: toastId });
      }
    } catch (error) {
      console.error("Error updating notification:", error);
      toast.error("An unexpected error occurred.", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={`group relative rounded-xl border p-3.5 sm:p-4 transition-all duration-200 ${
        notification.isRead
          ? "border-border/60 bg-card/60 text-muted-foreground"
          : "border-primary/40 bg-gradient-to-r from-card via-card to-primary/5 shadow-xs"
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {/* Type Icon */}
        <div
          className={`grid size-10 shrink-0 place-items-center rounded-xl font-bold ${config.iconBg} ${config.iconColor} shadow-xs mt-0.5`}
        >
          <Icon className="size-5" />
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.2 ${config.badgeStyle}`}>
                {config.label}
              </Badge>
              {!notification.isRead && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded-full border border-amber-500/20">
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Unread
                </span>
              )}
            </div>

            <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
              <Clock className="size-3" />
              <span>{formattedDate}</span>
            </span>
          </div>

          <h3 className={`text-sm leading-snug font-bold ${notification.isRead ? "text-foreground/80" : "text-foreground"}`}>
            {notification.title}
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {notification.message}
          </p>
        </div>

        {/* Action Button */}
        {!notification.isRead && (
          <div className="shrink-0 self-center pl-1">
            <Button
              size="sm"
              variant="outline"
              disabled={isUpdating}
              onClick={handleMarkRead}
              className="gap-1 text-xs h-7 px-2.5 font-medium border-primary/30 text-primary hover:bg-primary/10 active:scale-95 transition-all"
              title="Mark notification as read"
            >
              {isUpdating ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Check className="size-3 text-emerald-500" />
              )}
              <span>Mark read</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
