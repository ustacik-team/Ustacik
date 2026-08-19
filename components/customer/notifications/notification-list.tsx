"use client";

import { useMemo, useState } from "react";
import { NotificationItem, NotificationCard } from "./notification-card";
import { NotificationFilters } from "./notification-filters";
import { NotificationsEmptyState } from "./notifications-empty-state";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

interface NotificationListProps {
  notifications: NotificationItem[];
}

export function NotificationList({ notifications }: NotificationListProps) {
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
      // Tab filter: ALL, UNREAD, READ
      if (statusFilter === "UNREAD" && n.isRead) {
        return false;
      }
      if (statusFilter === "READ" && !n.isRead) {
        return false;
      }

      // Search query filter
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
    return <NotificationsEmptyState />;
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
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      ) : isFiltered ? (
        <div className="rounded-2xl border border-dashed py-12 px-4 text-center space-y-3 bg-muted/10">
          <SearchX className="size-8 mx-auto text-muted-foreground/60" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">No matching notifications found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn&apos;t find any notifications matching your active search query or filter selection.
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
      ) : (
        <NotificationsEmptyState />
      )}
    </div>
  );
}
