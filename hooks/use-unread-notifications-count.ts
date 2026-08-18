"use client";

import { useEffect, useState, useCallback } from "react";

export const NOTIFICATIONS_UPDATED_EVENT = "ustacik:notifications-updated";

/**
 * Global helper function to trigger unread notification count refetching across all mounted components.
 * Call this whenever a notification status changes (e.g. marked as read, cleared, or new notification received).
 */
export function notifyNotificationsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
  }
}

export function useUnreadNotificationsCount(initialCount: number = 0) {
  const [count, setCount] = useState<number>(initialCount);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread-count", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && typeof json.data?.count === "number") {
          setCount(json.data.count);
        }
      }
    } catch {
      // Ignore network errors silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const performFetch = async () => {
      try {
        const res = await fetch("/api/notifications/unread-count", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && typeof json.data?.count === "number") {
            setCount(json.data.count);
          }
        }
      } catch {
        // Ignore errors
      }
    };

    performFetch();

    const handleUpdate = () => {
      performFetch();
    };

    window.addEventListener("focus", handleUpdate);
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);

    const intervalId = setInterval(performFetch, 60000);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
      clearInterval(intervalId);
    };
  }, []);

  return {
    count,
    isLoading,
    refetch: fetchUnreadCount,
  };
}
