"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelJobRequestAction(jobId: string) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to perform this action." };
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        customerId: true,
        status: true,
      },
    });

    if (!job) {
      return { success: false, error: "Job request not found." };
    }

    if (job.customerId !== session.user.id) {
      return { success: false, error: "You are not authorized to cancel this job request." };
    }

    if (job.status !== "PENDING") {
      return { success: false, error: "Only pending job requests can be cancelled." };
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { status: "CANCELLED" },
    });

    revalidatePath("/customer/my-job-requests");
    revalidatePath("/craftsman/job-requests");

    return { success: true };
  } catch (error) {
    console.error("Error cancelling job request:", error);
    return { success: false, error: "Failed to cancel job request. Please try again." };
  }
}
