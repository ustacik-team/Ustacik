"use client";

import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function NotificationButton() {
  // TODO: Fetch unread notification count from database
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5 text-foreground" />
      <span className="sr-only">Notifications</span>
    </Button>
  );
}