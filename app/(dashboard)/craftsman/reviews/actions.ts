"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReviewReplyAction(reviewId: string, replyText: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!replyText || replyText.trim().length === 0) {
      return { success: false, error: "Reply text cannot be empty" };
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        craftsman: {
          select: {
            id: true,
            userId: true,
          },
        },
        reply: true,
      },
    });

    if (!review) {
      return { success: false, error: "Review not found" };
    }

    // Strict Authorization: Verify the review belongs to the logged-in craftsman
    if (review.craftsman.userId !== session.user.id) {
      return { success: false, error: "Forbidden: You are not the craftsman for this review" };
    }

    if (review.reply) {
      return { success: false, error: "A reply has already been submitted for this review" };
    }

    const newReply = await prisma.reviewReply.create({
      data: {
        reviewId: review.id,
        craftsmanId: review.craftsman.id,
        reply: replyText.trim(),
      },
    });

    revalidatePath("/craftsman/reviews");
    revalidatePath("/craftsman/dashboard");

    return { success: true, reply: newReply };
  } catch (error) {
    console.error("Error creating review reply:", error);
    return { success: false, error: "Failed to submit review reply" };
  }
}
