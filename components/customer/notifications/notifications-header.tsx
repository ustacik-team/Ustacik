"use client";

import { useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { markAllNotificationsAsReadAction } from "@/app/(dashboard)/customer/notifications/actions";
import { toast } from "sonner";

interface NotificationsHeaderProps {
  totalCount: number;
  unreadCount: number;
}

export function NotificationsHeader({ totalCount, unreadCount }: NotificationsHeaderProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkAllRead = async () => {
    setIsUpdating(true);
    const toastId = toast.loading("Marking all notifications as read...");

    try {
      const result = await markAllNotificationsAsReadAction();
      if (result.success) {
        toast.success("All notifications marked as read.", { id: toastId });
      } else {
        toast.error(result.error || "Failed to update notifications.", { id: toastId });
      }
    } catch (error) {
      console.error("Error marking all read:", error);
      toast.error("An unexpected error occurred.", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Bell className="size-5" />
          <span className="text-sm font-semibold">Customer Workspace</span>
        </div>
        <div className="flex items-center gap-2.5 mt-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 ? (
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold px-2.5 py-0.5">
              {unreadCount} unread
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5">
              {totalCount} {totalCount === 1 ? "notification" : "notifications"}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Stay updated with your job requests, craftsmen, reviews, and important Ustacik activity.
        </p>
      </div>

      {unreadCount > 0 && (
        <Button
          size="sm"
          variant="outline"
          disabled={isUpdating}
          onClick={handleMarkAllRead}
          className="gap-1.5 text-xs font-medium border-primary/30 text-primary hover:bg-primary/5 shrink-0 self-start sm:self-center"
        >
          {isUpdating ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <CheckCheck className="size-3.5 text-emerald-500" />
          )}
          <span>Mark all as read</span>
        </Button>
      )}
    </div>
  );
}
