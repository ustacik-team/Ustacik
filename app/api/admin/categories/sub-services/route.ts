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
    const { categoryId, name } = body;

    if (!categoryId || !name) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const subService = await prisma.subService.create({
      data: {
        categoryId,
        name: name.trim(),
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: `Created sub-service "${name}" under category ID ${categoryId}`,
        entityType: "SubService",
        entityId: subService.id,
      },
    });

    return NextResponse.json({ success: true, data: subService });
  } catch (error: unknown) {
    console.error("Failed to create sub-service:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
