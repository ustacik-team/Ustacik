import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiCreated, apiError, apiSuccess, validateBody } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { Role, ApplicationStatus, Prisma } from "@prisma/client";
import { getServerSession } from "@/lib/get-session";

// Application payload schema based on form & Prisma model
const ApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  profilePhotoUrl: z.string().nullable().optional(),
  
  businessName: z.string().min(1, "Business name is required"),
  bio: z.string().optional().nullable(),
  region: z.string().min(1, "Region is required"),
  category: z.string().min(1, "Category is required"),
  subService: z.string().min(1, "Sub-service is required"),
  priceMin: z.coerce.number().min(0),
  priceMax: z.coerce.number().min(0),
  
  portfolioUrls: z.array(z.string()).default([]),
  
  idNumber: z.string().optional().nullable(),
  businessRegistrationNumber: z.string().optional().nullable(),
  workmanshipGuarantee: z.boolean().default(false),
  
  ref1Name: z.string().optional().nullable(),
  ref1Phone: z.string().optional().nullable(),
  ref2Name: z.string().optional().nullable(),
  ref2Phone: z.string().optional().nullable(),
  
  confirmAccuracy: z.boolean(),
  agreePublish: z.boolean(),
  agreeDisclaimer: z.boolean(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get("email");
    const statusParam = searchParams.get("status");

    // If Admin, can query all applications or filter by status
    if (session?.user?.role === Role.ADMIN) {
      const whereClause: Prisma.CraftsmanApplicationWhereInput = {};
      if (statusParam && Object.values(ApplicationStatus).includes(statusParam as ApplicationStatus)) {
        whereClause.status = statusParam as ApplicationStatus;
      }
      const applications = await prisma.craftsmanApplication.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true, role: true },
          },
        },
      });
      return apiSuccess({ applications });
    }

    // For customer/applicant: search primarily by userId (if authenticated) or email
    const userId = session?.user?.id;
    const userEmail = session?.user?.email || emailParam;

    if (!userId && !userEmail) {
      return apiError("Unauthorized or email parameter missing", 401);
    }

    const whereClause: Prisma.CraftsmanApplicationWhereInput = userId
      ? { userId }
      : { email: userEmail ?? undefined };

    const applications = await prisma.craftsmanApplication.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
      },
    });

    if (!applications || applications.length === 0) {
      return apiError("No craftsman application found", 404);
    }

    const latestApplication = applications[0];
    const previousApplications = applications.slice(1);

    return apiSuccess({
      application: latestApplication,
      history: previousApplications,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const validation = await validateBody(req, ApplicationSchema);
    if (!validation.success) {
      return validation.error;
    }

    const data = validation.data;
    const session = await getServerSession();

    // 1. Check if user already exists
    const existingUser = session?.user?.id
      ? await prisma.user.findUnique({
          where: { id: session.user.id },
          include: { craftsmanProfile: true, craftsmanApplications: true },
        })
      : await prisma.user.findUnique({
          where: { email: data.email },
          include: { craftsmanProfile: true, craftsmanApplications: true },
        });

    // 2. Security Check: If user is already CRAFTSMAN, refuse new application
    if (existingUser?.craftsmanProfile || existingUser?.role === Role.CRAFTSMAN) {
      return apiError("You are already a registered craftsman on Ustacik.", 409);
    }

    // 3. Security Check: If user has a PENDING application, refuse submission
    const pendingApplication = existingUser?.id
      ? await prisma.craftsmanApplication.findFirst({
          where: {
            userId: existingUser.id,
            status: ApplicationStatus.PENDING,
          },
        })
      : await prisma.craftsmanApplication.findFirst({
          where: {
            email: data.email,
            status: ApplicationStatus.PENDING,
          },
        });

    if (pendingApplication) {
      return apiError("You already have a craftsman application under review. Please wait for an administrator to review it.", 409);
    }

    // 4. Obtain or create User record (preserving role as CUSTOMER)
    let user = existingUser;

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: session?.user?.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          image: data.profilePhotoUrl || null,
          role: Role.CUSTOMER,
        },
        include: { craftsmanProfile: true, craftsmanApplications: true },
      });
    }

    // 5. Generate Reference Number: UST-2026-XXXXXX
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const referenceNumber = `UST-${new Date().getFullYear()}-${randomDigits}`;

    // 6. Save new CraftsmanApplication record with status PENDING
    const applicationRecord = await prisma.craftsmanApplication.create({
      data: {
        referenceNumber,
        userId: user.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        profilePhotoUrl: data.profilePhotoUrl || null,
        businessName: data.businessName,
        bio: data.bio || null,
        regionName: data.region,
        categoryName: data.category,
        subServiceName: data.subService,
        priceMin: data.priceMin,
        priceMax: data.priceMax,
        portfolioUrls: data.portfolioUrls,
        idNumber: data.idNumber || null,
        businessRegistrationNumber: data.businessRegistrationNumber || null,
        workmanshipGuarantee: data.workmanshipGuarantee,
        ref1Name: data.ref1Name || null,
        ref1Phone: data.ref1Phone || null,
        ref2Name: data.ref2Name || null,
        ref2Phone: data.ref2Phone || null,
        status: ApplicationStatus.PENDING,
      },
    });

    // 7. Send In-App Receipt Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "VERIFICATION_APPROVED",
        title: "Application Received",
        message: `Thank you ${data.fullName}! Your craftsman application for "${data.businessName}" (Ref: #${referenceNumber}) has been received and is under review.`,
      },
    });

    return apiCreated({
      message: "Craftsman application submitted successfully",
      applicationId: applicationRecord.id,
      referenceNumber: applicationRecord.referenceNumber,
      status: ApplicationStatus.PENDING,
    });
  } catch (error) {
    return handleApiError(error);
  }
}


