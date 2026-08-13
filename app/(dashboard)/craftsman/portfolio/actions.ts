"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addWorkPhotosAction(imageUrls: string[]) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!imageUrls || imageUrls.length === 0) {
      return { success: false, error: "No image URLs provided" };
    }

    const craftsmanProfile = await prisma.craftsmanProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!craftsmanProfile) {
      return { success: false, error: "Craftsman profile not found" };
    }

    await prisma.workPhoto.createMany({
      data: imageUrls.map((url) => ({
        craftsmanId: craftsmanProfile.id,
        imageUrl: url,
      })),
    });

    revalidatePath("/craftsman/portfolio");
    revalidatePath("/craftsman/dashboard");

    return { success: true, count: imageUrls.length };
  } catch (error) {
    console.error("Error adding work photos:", error);
    return { success: false, error: "Failed to save work photos to database" };
  }
}

export async function deleteWorkPhotoAction(photoId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const photo = await prisma.workPhoto.findUnique({
      where: { id: photoId },
      include: {
        craftsman: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!photo) {
      return { success: false, error: "Photo not found" };
    }

    // Strict Authorization: Verify the photo belongs to the authenticated craftsman
    if (photo.craftsman.userId !== session.user.id) {
      return { success: false, error: "Forbidden: You do not own this photo" };
    }

    await prisma.workPhoto.delete({
      where: { id: photoId },
    });

    revalidatePath("/craftsman/portfolio");
    revalidatePath("/craftsman/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting work photo:", error);
    return { success: false, error: "Failed to delete work photo" };
  }
}
