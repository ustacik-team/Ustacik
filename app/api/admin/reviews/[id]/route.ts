import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing review ID" }, { status: 400 });
    }

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        customer: { select: { name: true, email: true } },
        craftsman: { select: { businessName: true, userId: true } },
      },
    });

    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    // Delete review
    await prisma.review.delete({
      where: { id },
    });

    // Log admin moderation action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: `Removed review by ${review.customer.name} for craftsman ${review.craftsman.businessName || review.craftsman.userId} due to moderation violation`,
        entityType: "Review",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete review:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
