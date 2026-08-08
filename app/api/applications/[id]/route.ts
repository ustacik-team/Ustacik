import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { Role, ApplicationStatus, VerificationLevel } from "@prisma/client";
import { getServerSession } from "@/lib/get-session";

const ReviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  reviewNotes: z.string().optional().nullable(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    const application = await prisma.craftsmanApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
      },
    });

    if (!application) {
      return apiError("Application not found", 404);
    }

    // Check authorization: must be admin or the owner
    const isAdmin = session?.user?.role === Role.ADMIN;
    const isOwner = session?.user?.id === application.userId || session?.user?.email === application.email;

    if (!isAdmin && !isOwner) {
      return apiError("Forbidden", 403);
    }

    return apiSuccess({ application });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();

    if (!session || session.user.role !== Role.ADMIN) {
      return apiError("Forbidden: Admin access required", 403);
    }

    const body = await req.json();
    const validation = ReviewSchema.safeParse(body);
    if (!validation.success) {
      return apiError(validation.error.issues[0]?.message || "Invalid review payload", 400);
    }

    const { action, reviewNotes } = validation.data;

    const application = await prisma.craftsmanApplication.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!application) {
      return apiError("Application not found", 404);
    }

    if (application.status !== ApplicationStatus.PENDING) {
      return apiError(`Application has already been ${application.status.toLowerCase()}`, 400);
    }

    if (!application.userId) {
      return apiError("Application is not associated with a user account", 400);
    }

    const adminId = session.user.id;

    if (action === "APPROVE") {
      const result = await prisma.$transaction(async (tx) => {
        // 1. Update application status
        const updatedApp = await tx.craftsmanApplication.update({
          where: { id },
          data: {
            status: ApplicationStatus.APPROVED,
            reviewedBy: adminId,
            reviewedAt: new Date(),
            reviewNotes: reviewNotes || null,
          },
        });

        // 2. Update user's role to CRAFTSMAN
        await tx.user.update({
          where: { id: application.userId! },
          data: {
            role: Role.CRAFTSMAN,
            phone: application.phone || undefined,
            image: application.profilePhotoUrl || undefined,
          },
        });

        // 3. Find or Create Region
        let region = await tx.region.findFirst({
          where: { name: { equals: application.regionName, mode: "insensitive" } },
        });

        if (!region) {
          region = await tx.region.create({
            data: { name: application.regionName },
          });
        }

        // 4. Find or Create Category
        let category = await tx.category.findFirst({
          where: { name: { equals: application.categoryName, mode: "insensitive" } },
        });

        if (!category) {
          category = await tx.category.create({
            data: { name: application.categoryName },
          });
        }

        // 5. Find or Create SubService
        let subService = await tx.subService.findFirst({
          where: {
            name: { equals: application.subServiceName, mode: "insensitive" },
            categoryId: category.id,
          },
        });

        if (!subService) {
          subService = await tx.subService.create({
            data: {
              name: application.subServiceName,
              categoryId: category.id,
            },
          });
        }

        // 6. Calculate initial verification level
        const hasReferences = Boolean(application.ref1Name && application.ref1Phone && application.ref2Name && application.ref2Phone);
        const hasWorkPhotos = application.portfolioUrls.length > 0;
        const hasId = Boolean(application.idNumber);
        const hasReg = Boolean(application.businessRegistrationNumber);
        const hasGuarantee = application.workmanshipGuarantee;

        let initialLevel: VerificationLevel = VerificationLevel.REGISTERED;
        if (hasId && hasReferences && hasWorkPhotos) {
          initialLevel = VerificationLevel.VERIFIED;
        }
        if (initialLevel === VerificationLevel.VERIFIED && hasReg && hasGuarantee) {
          initialLevel = VerificationLevel.APPROVED;
        }

        // 7. Create CraftsmanProfile if it doesn't exist
        let profile = await tx.craftsmanProfile.findUnique({
          where: { userId: application.userId! },
        });

        if (!profile) {
          profile = await tx.craftsmanProfile.create({
            data: {
              userId: application.userId!,
              businessName: application.businessName,
              bio: application.bio || null,
              regionId: region.id,
              verificationLevel: initialLevel,
              businessRegistrationNumber: application.businessRegistrationNumber || null,
              workmanshipGuarantee: application.workmanshipGuarantee,
              priceRangeMin: application.priceMin,
              priceRangeMax: application.priceMax,
              categories: {
                create: {
                  categoryId: category.id,
                },
              },
              subServices: {
                create: {
                  subServiceId: subService.id,
                },
              },
              photos: {
                create: application.portfolioUrls.map((url) => ({
                  imageUrl: url,
                })),
              },
            },
          });
        }

        // 8. Create Verification Record
        const notesParts = [
          `Application ID: ${application.id}`,
          application.idNumber ? `ID: ${application.idNumber}` : "ID: Not provided",
          application.ref1Name ? `Ref 1: ${application.ref1Name} (${application.ref1Phone})` : "Ref 1: None",
          application.ref2Name ? `Ref 2: ${application.ref2Name} (${application.ref2Phone})` : "Ref 2: None",
          reviewNotes ? `Admin Notes: ${reviewNotes}` : null,
        ].filter(Boolean);

        await tx.verificationRecord.create({
          data: {
            craftsmanId: profile.id,
            level: initialLevel,
            phoneVerified: true,
            idVerified: hasId,
            referencesVerified: hasReferences,
            workPhotosVerified: hasWorkPhotos,
            businessRegistrationVerified: hasReg,
            guaranteeVerified: hasGuarantee,
            notes: notesParts.join(" | "),
            verifiedBy: adminId,
          },
        });

        // 9. Send Notification to User
        await tx.notification.create({
          data: {
            userId: application.userId!,
            type: "VERIFICATION_APPROVED",
            title: "Application Approved! 🎉",
            message: `Congratulations ${application.fullName}! Your craftsman application for "${application.businessName}" has been approved. You are now a registered craftsman on Ustacik!`,
          },
        });

        // 10. Audit Log Entry
        await tx.adminLog.create({
          data: {
            adminId,
            action: `APPROVED Craftsman Application for ${application.businessName} (${application.referenceNumber || application.id})`,
            entityType: "CraftsmanApplication",
            entityId: application.id,
          },
        });

        return updatedApp;
      });

      return apiSuccess({
        message: "Application approved successfully. User role updated to CRAFTSMAN.",
        application: result,
      });
    } else {
      // REJECT
      const result = await prisma.$transaction(async (tx) => {
        const updatedApp = await tx.craftsmanApplication.update({
          where: { id },
          data: {
            status: ApplicationStatus.REJECTED,
            reviewedBy: adminId,
            reviewedAt: new Date(),
            reviewNotes: reviewNotes || null,
          },
        });

        // Send Notification to User
        await tx.notification.create({
          data: {
            userId: application.userId!,
            type: "VERIFICATION_APPROVED",
            title: "Application Status Update",
            message: `Your craftsman application for "${application.businessName}" was not approved.${
              reviewNotes ? ` Reason: ${reviewNotes}` : ""
            }`,
          },
        });

        // Audit Log Entry
        await tx.adminLog.create({
          data: {
            adminId,
            action: `REJECTED Craftsman Application for ${application.businessName} (${application.referenceNumber || application.id})`,
            entityType: "CraftsmanApplication",
            entityId: application.id,
          },
        });

        return updatedApp;
      });

      return apiSuccess({
        message: "Application rejected.",
        application: result,
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
