"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserPhotoAction(imageUrl: string | null) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    revalidatePath("/settings");

    return { success: true };
  } catch (error) {
    console.error("Error updating profile image:", error);
    return { success: false, error: "Failed to update profile photo" };
  }
}

export async function deleteAccountAction() {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Delete user from database (cascades sessions, accounts, craftsman profile, notifications)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: "Failed to delete account. Please try again or contact support." };
  }
}
