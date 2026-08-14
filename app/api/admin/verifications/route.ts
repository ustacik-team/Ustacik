import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role, VerificationLevel } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      craftsmanId,
      level,
      phoneVerified,
      idVerified,
      referencesVerified,
      workPhotosVerified,
      businessRegistrationVerified,
      guaranteeVerified,
      notes,
    } = body;

    if (!craftsmanId || !level) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 1. Update Craftsman Profile Verification Level
    const updatedProfile = await prisma.craftsmanProfile.update({
      where: { id: craftsmanId },
      data: {
        verificationLevel: level as VerificationLevel,
      },
    });

    // 2. Create Verification Record & Log Entry
    const record = await prisma.verificationRecord.create({
      data: {
        craftsmanId,
        level: level as VerificationLevel,
        phoneVerified: !!phoneVerified,
        idVerified: !!idVerified,
        referencesVerified: !!referencesVerified,
        workPhotosVerified: !!workPhotosVerified,
        businessRegistrationVerified: !!businessRegistrationVerified,
        guaranteeVerified: !!guaranteeVerified,
        notes: notes || null,
        verifiedBy: session.user.id,
        logs: {
          create: {
            action: `Verification level updated to ${level}`,
            notes: notes || null,
          },
        },
      },
    });

    // 3. Create Admin Audit Log Entry
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: `Updated craftsman ${updatedProfile.businessName || updatedProfile.userId} verification to ${level}`,
        entityType: "VerificationRecord",
        entityId: record.id,
      },
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error: unknown) {
    console.error("Failed to save verification record:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
