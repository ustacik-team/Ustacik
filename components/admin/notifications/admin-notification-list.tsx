"use client";

import { useMemo, useState } from "react";
import { AdminNotificationItem, AdminNotificationCard } from "./admin-notification-card";
import { NotificationFilters } from "@/components/craftsman/notifications/notification-filters";
import { Button } from "@/components/ui/button";
import { SearchX, ShieldCheck } from "lucide-react";

interface AdminNotificationListProps {
  notifications: AdminNotificationItem[];
}

export function AdminNotificationList({ notifications }: AdminNotificationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const counts = useMemo(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    return {
      all: notifications.length,
      unread,
      read: Math.max(notifications.length - unread, 0),
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (statusFilter === "UNREAD" && n.isRead) return false;
      if (statusFilter === "READ" && !n.isRead) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = n.title.toLowerCase().includes(query);
        const messageMatch = n.message.toLowerCase().includes(query);
        return titleMatch || messageMatch;
      }

      return true;
    });
  }, [notifications, statusFilter, searchQuery]);

  const isFiltered = notifications.length > 0 && (statusFilter !== "ALL" || searchQuery.trim().length > 0);

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed py-16 px-4 text-center space-y-3 bg-muted/10">
        <ShieldCheck className="size-10 mx-auto text-muted-foreground/60" />
        <div className="space-y-1">
          <h3 className="font-bold text-base text-foreground">No Admin Notifications</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You currently have no administrative alerts, verification requests, or system logs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Tabs Filter Bar */}
      <NotificationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        counts={counts}
      />

      {/* Notifications Grid / List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <AdminNotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      ) : isFiltered ? (
        <div className="rounded-2xl border border-dashed py-12 px-4 text-center space-y-3 bg-muted/10">
          <SearchX className="size-8 mx-auto text-muted-foreground/60" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">No matching notifications found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn&apos;t find any admin notifications matching your active search query or filter selection.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("ALL");
            }}
            className="text-xs"
          >
            Clear Filters
          </Button>
        </div>
      ) : null}
    </div>
  );
}
