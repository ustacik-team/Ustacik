"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markNotificationAsReadAction(notificationId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    // Authorization: Verify notification belongs to the currently logged-in customer
    if (notification.userId !== session.user.id) {
      return { success: false, error: "Forbidden: Notification belongs to another user" };
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    revalidatePath("/customer/notifications");
    revalidatePath("/customer/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to update notification" };
  }
}

export async function markAllNotificationsAsReadAction() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    revalidatePath("/customer/notifications");
    revalidatePath("/customer/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: "Failed to update notifications" };
  }
}
