import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { NotificationsHeader } from "@/components/craftsman/notifications/notifications-header";
import { NotificationSummary } from "@/components/craftsman/notifications/notification-summary";
import { NotificationList } from "@/components/craftsman/notifications/notification-list";
import { NotificationsEmptyState } from "@/components/craftsman/notifications/notifications-empty-state";

export default async function CraftsmanNotificationsPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return null;
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (totalCount === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <NotificationsHeader totalCount={0} unreadCount={0} />
        <NotificationsEmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 1. Header Banner */}
      <NotificationsHeader totalCount={totalCount} unreadCount={unreadCount} />

      {/* 2. Notification Activity Summary */}
      <NotificationSummary totalCount={totalCount} unreadCount={unreadCount} />

      {/* 3. Interactive Notification List */}
      <NotificationList notifications={notifications} />
    </div>
  );
}
