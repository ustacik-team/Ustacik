import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AdminNotificationsHeader } from "@/components/admin/notifications/admin-notifications-header";
import { AdminNotificationSummary } from "@/components/admin/notifications/admin-notification-summary";
import { AdminNotificationList } from "@/components/admin/notifications/admin-notification-list";
import { ShieldCheck } from "lucide-react";

export default async function AdminNotificationsPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/sign-in?redirect=/admin/notifications");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedNotifications = notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  }));

  const totalCount = formattedNotifications.length;
  const unreadCount = formattedNotifications.filter((n) => !n.isRead).length;

  if (totalCount === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <AdminNotificationsHeader totalCount={0} unreadCount={0} />
        <div className="rounded-2xl border border-dashed py-16 px-4 text-center space-y-3 bg-muted/10">
          <ShieldCheck className="size-10 mx-auto text-muted-foreground/60" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">No Admin Notifications</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You currently have no administrative alerts, verification requests, or system logs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 1. Header Banner */}
      <AdminNotificationsHeader totalCount={totalCount} unreadCount={unreadCount} />

      {/* 2. Notification Activity Summary */}
      <AdminNotificationSummary totalCount={totalCount} unreadCount={unreadCount} />

      {/* 3. Interactive Notification List */}
      <AdminNotificationList notifications={formattedNotifications} />
    </div>
  );
}
