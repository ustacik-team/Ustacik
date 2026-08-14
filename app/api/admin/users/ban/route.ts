import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, banned, banReason } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    // 1. Update Better Auth User Ban Fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        banned: !!banned,
        banReason: banned ? banReason || "Violated platform rules" : null,
      },
    });

    // 2. Create Admin Audit Log Entry
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: banned
          ? `Banned user ${updatedUser.email} (${banReason || "No reason specified"})`
          : `Unbanned user ${updatedUser.email}`,
        entityType: "User",
        entityId: userId,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: unknown) {
    console.error("Failed to toggle user ban status:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
