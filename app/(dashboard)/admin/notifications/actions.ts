"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

export async function markAdminNotificationAsReadAction(notificationId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized" };
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    if (notification.userId !== session.user.id) {
      return { success: false, error: "Forbidden: Notification belongs to another administrator" };
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    revalidatePath("/admin/notifications");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error marking admin notification as read:", error);
    return { success: false, error: "Failed to update notification" };
  }
}

export async function markAllAdminNotificationsAsReadAction() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    revalidatePath("/admin/notifications");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error marking all admin notifications as read:", error);
    return { success: false, error: "Failed to update notifications" };
  }
}
