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
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Missing region name" }, { status: 400 });
    }

    const region = await prisma.region.create({
      data: {
        name: name.trim(),
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: `Added new region "${name.trim()}"`,
        entityType: "Region",
        entityId: region.id,
      },
    });

    return NextResponse.json({ success: true, data: region });
  } catch (error: unknown) {
    console.error("Failed to create region:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
