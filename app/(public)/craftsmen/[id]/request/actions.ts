"use server";

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createJobSchema = z.object({
  craftsmanId: z.string().min(1, "Craftsman ID is required"),
  categoryId: z.string().min(1, "Category is required"),
  subServiceId: z.string().optional().nullable(),
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
  description: z.string().trim().min(15, "Description must be at least 15 characters").max(2000, "Description cannot exceed 2000 characters"),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(300, "Address cannot exceed 300 characters"),
});

export async function createJobRequestAction(input: z.infer<typeof createJobSchema>) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to submit a job request." };
    }

    if (session.user.role === "CRAFTSMAN") {
      return { success: false, error: "Craftsman accounts cannot submit customer job requests." };
    }

    const parseResult = createJobSchema.safeParse(input);
    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues[0]?.message || "Invalid input data.";
      return { success: false, error: errorMessage };
    }

    const { craftsmanId, categoryId, subServiceId, title, description, address } = parseResult.data;

    // Verify craftsman exists
    const craftsman = await prisma.craftsmanProfile.findUnique({
      where: { id: craftsmanId },
      select: { id: true },
    });

    if (!craftsman) {
      return { success: false, error: "The selected craftsman was not found." };
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      return { success: false, error: "The selected category does not exist." };
    }

    // Verify sub-service exists and belongs to the selected category if provided
    if (subServiceId) {
      const subService = await prisma.subService.findUnique({
        where: { id: subServiceId },
        select: { id: true, categoryId: true },
      });

      if (!subService || subService.categoryId !== categoryId) {
        return { success: false, error: "The selected service does not belong to the selected category." };
      }
    }

    // Create the job record
    const job = await prisma.job.create({
      data: {
        customerId: session.user.id,
        craftsmanId: craftsman.id,
        categoryId,
        subServiceId: subServiceId || null,
        title,
        description,
        address,
        status: "PENDING",
      },
    });

    revalidatePath("/customer/my-job-requests");
    revalidatePath("/craftsman/job-requests");

    return { success: true, jobId: job.id };
  } catch (error) {
    console.error("Error creating job request:", error);
    return { success: false, error: "Failed to submit job request. Please try again." };
  }
}
