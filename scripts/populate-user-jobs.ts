import { PrismaClient, Role, JobStatus, VerificationLevel, SubscriptionStatus, NotificationType } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function populateTargetUserJobs() {
  const targetUserId = "yGuLpQg1f44GkTvcf6Hdtez8csycxSeJ";
  console.log(`Checking user: ${targetUserId}...`);

  let user = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!user) {
    console.error(`User with ID ${targetUserId} not found in database.`);
    return;
  }

  console.log(`User found: ${user.name} (${user.email}), current role: ${user.role}`);

  // Ensure user has CRAFTSMAN role
  if (user.role !== Role.CRAFTSMAN) {
    user = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: Role.CRAFTSMAN },
    });
    console.log(`Updated user role to CRAFTSMAN.`);
  }

  // Get or create region
  let region = await prisma.region.findFirst();
  if (!region) {
    region = await prisma.region.create({ data: { name: "Nicosia" } });
  }

  // Find or create CraftsmanProfile
  let craftsmanProfile = await prisma.craftsmanProfile.findUnique({
    where: { userId: targetUserId },
  });

  if (!craftsmanProfile) {
    console.log(`Creating CraftsmanProfile for user...`);
    craftsmanProfile = await prisma.craftsmanProfile.create({
      data: {
        userId: targetUserId,
        businessName: `${user.name}'s Professional Services`,
        bio: "Experienced craftsman providing quality workmanship and customer satisfaction.",
        regionId: region.id,
        verificationLevel: VerificationLevel.APPROVED,
        workmanshipGuarantee: true,
        priceRangeMin: 150,
        priceRangeMax: 600,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        totalJobsCompleted: 12,
      },
    });
    console.log(`CraftsmanProfile created: ${craftsmanProfile.id}`);
  } else {
    console.log(`Existing CraftsmanProfile found: ${craftsmanProfile.id}`);
  }

  // Get existing categories and sub-services
  const categories = await prisma.category.findMany({
    include: { subServices: true },
  });

  if (categories.length === 0) {
    console.error("No categories found in database.");
    return;
  }

  // Link CraftsmanCategory & CraftsmanSubService for target user if not already linked
  for (const cat of categories.slice(0, 3)) {
    await prisma.craftsmanCategory.upsert({
      where: {
        craftsmanId_categoryId: {
          craftsmanId: craftsmanProfile.id,
          categoryId: cat.id,
        },
      },
      create: {
        craftsmanId: craftsmanProfile.id,
        categoryId: cat.id,
      },
      update: {},
    });

    for (const sub of cat.subServices.slice(0, 2)) {
      await prisma.craftsmanSubService.upsert({
        where: {
          craftsmanId_subServiceId: {
            craftsmanId: craftsmanProfile.id,
            subServiceId: sub.id,
          },
        },
        create: {
          craftsmanId: craftsmanProfile.id,
          subServiceId: sub.id,
        },
        update: {},
      });
    }
  }

  // Get customer users to link as customers of the jobs
  const customers = await prisma.user.findMany({
    where: { role: Role.CUSTOMER },
    take: 10,
  });

  if (customers.length === 0) {
    console.error("No customer users found in database.");
    return;
  }

  // Sample jobs to populate for this specific craftsman
  const sampleJobs = [
    {
      title: "Kitchen Tap & Sink Leak Repair",
      description: "Water leaking under the kitchen sink. Requires washer replacement and pipe sealing.",
      address: "Flat 4B, Jasmine Complex, Kyrenia Road, Nicosia",
      status: JobStatus.PENDING,
      daysAgo: 1,
    },
    {
      title: "Main Circuit Breaker Tripping Investigation",
      description: "Circuit breaker trips whenever the oven and AC are turned on simultaneously.",
      address: "Villa 12, Sunrise Avenue, Lapta, Kyrenia",
      status: JobStatus.PENDING,
      daysAgo: 2,
    },
    {
      title: "Full Living Room Ceiling Painting",
      description: "Water stain on living room ceiling needs plastering, sanding, and two coats of white emulsion paint.",
      address: "House 45, Palm Street, Famagusta",
      status: JobStatus.ACCEPTED,
      daysAgo: 4,
    },
    {
      title: "Solar Water Heater Tank Replacement",
      description: "Old rooftop solar tank is rusted and leaking hot water. Replace with 200L stainless steel tank.",
      address: "Block C, Apartment 102, Near City Center, Lefke",
      status: JobStatus.ACCEPTED,
      daysAgo: 5,
    },
    {
      title: "Split Air Conditioner Installation & Gas Refill",
      description: "Install 18000 BTU Inverter AC in master bedroom and check gas pressure.",
      address: "House 8, Olive Grove Estate, Alsancak, Kyrenia",
      status: JobStatus.COMPLETED,
      daysAgo: 10,
      completedDaysAgo: 2,
    },
    {
      title: "Custom Wooden Wardrobe Shelf Fittings",
      description: "Build and install 4 custom oak shelves inside built-in bedroom closet.",
      address: "Apartment 301, Seagate Residence, Famagusta",
      status: JobStatus.COMPLETED,
      daysAgo: 14,
      completedDaysAgo: 7,
    },
    {
      title: "Bathroom Drainage Unclogging",
      description: "Shower drain backing up slowly. Needs high-pressure jetting and drain line clearance.",
      address: "Villa 22, Bellapais Heights, Kyrenia",
      status: JobStatus.CANCELLED,
      daysAgo: 8,
    },
  ];

  console.log(`Populating ${sampleJobs.length} jobs for craftsman profile ${craftsmanProfile.id}...`);

  for (let i = 0; i < sampleJobs.length; i++) {
    const sj = sampleJobs[i];
    const customer = customers[i % customers.length];
    const category = categories[i % categories.length];
    const subService = category.subServices[0] || null;

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - sj.daysAgo);

    const completedAt = sj.completedDaysAgo
      ? new Date(Date.now() - sj.completedDaysAgo * 86400000)
      : null;

    const job = await prisma.job.create({
      data: {
        customerId: customer.id,
        craftsmanId: craftsmanProfile.id,
        categoryId: category.id,
        subServiceId: subService?.id || null,
        title: sj.title,
        description: sj.description,
        address: sj.address,
        status: sj.status,
        createdAt,
        completedAt,
      },
    });

    console.log(`Created job: "${job.title}" (Status: ${job.status})`);

    // Create Review for completed jobs if not exists
    if (sj.status === JobStatus.COMPLETED) {
      const review = await prisma.review.upsert({
        where: { jobId: job.id },
        create: {
          jobId: job.id,
          customerId: customer.id,
          craftsmanId: craftsmanProfile.id,
          punctuality: 5,
          workmanship: 5,
          priceHonesty: 4,
          communication: 5,
          comment: `Fantastic job on ${job.title}! Very professional, punctual, and completed the work cleanly.`,
        },
        update: {},
      });

      // Add sample ReviewPhoto for the first completed job
      if (i === 4) {
        await prisma.reviewPhoto.createMany({
          data: [
            {
              reviewId: review.id,
              imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop",
            },
            {
              reviewId: review.id,
              imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
            },
          ],
          skipDuplicates: true,
        });

        // Add sample ReviewReply for the first completed job review
        await prisma.reviewReply.upsert({
          where: { reviewId: review.id },
          create: {
            reviewId: review.id,
            craftsmanId: craftsmanProfile.id,
            reply: "Thank you so much for the kind words! It was a pleasure working on your AC installation.",
          },
          update: {},
        });
      }
    }
  }

  // Seed WorkPhotos for target craftsman
  const workPhotos = [
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
  ];

  for (const imageUrl of workPhotos) {
    const existing = await prisma.workPhoto.findFirst({
      where: { craftsmanId: craftsmanProfile.id, imageUrl },
    });
    if (!existing) {
      await prisma.workPhoto.create({
        data: {
          craftsmanId: craftsmanProfile.id,
          imageUrl,
        },
      });
    }
  }

  // Seed Notifications for target user across all NotificationType values
  const notificationsData = [
    {
      type: NotificationType.JOB_REQUEST,
      title: "New Job Request Received",
      message: "Customer Sarah Mitchell requested: Kitchen Tap & Sink Leak Repair",
      isRead: false,
    },
    {
      type: NotificationType.JOB_ACCEPTED,
      title: "Job Request Accepted",
      message: "You accepted Full Living Room Ceiling Painting for Customer Alex Johnson.",
      isRead: false,
    },
    {
      type: NotificationType.JOB_COMPLETED,
      title: "Job Work Finalized",
      message: "Split Air Conditioner Installation & Gas Refill was marked as completed.",
      isRead: true,
    },
    {
      type: NotificationType.REVIEW_RECEIVED,
      title: "New 5-Star Review Received",
      message: "Customer Omar Al-Hassan left a 5-star review for Split Air Conditioner Installation.",
      isRead: false,
    },
    {
      type: NotificationType.VERIFICATION_APPROVED,
      title: "Verification Status Approved",
      message: "Congratulations! Your Craftsman profile has been verified and approved by Ustacik Admins.",
      isRead: true,
    },
  ];

  for (const nData of notificationsData) {
    const existing = await prisma.notification.findFirst({
      where: { userId: targetUserId, title: nData.title },
    });
    if (!existing) {
      await prisma.notification.create({
        data: {
          userId: targetUserId,
          type: nData.type,
          title: nData.title,
          message: nData.message,
          isRead: nData.isRead,
        },
      });
    }
  }

  // Seed Verification Record if not exists
  const verRecord = await prisma.verificationRecord.findFirst({
    where: { craftsmanId: craftsmanProfile.id },
  });

  if (!verRecord) {
    const adminUser = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
    if (adminUser) {
      await prisma.verificationRecord.create({
        data: {
          craftsmanId: craftsmanProfile.id,
          level: VerificationLevel.APPROVED,
          phoneVerified: true,
          idVerified: true,
          referencesVerified: true,
          workPhotosVerified: true,
          businessRegistrationVerified: true,
          guaranteeVerified: true,
          verifiedBy: adminUser.id,
          notes: "Approved craftsman profile with full document verification.",
        },
      });
    }
  }

  console.log("Successfully populated all dashboard data for user:", targetUserId);
}

populateTargetUserJobs()
  .catch((err) => {
    console.error("Error populating jobs:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
