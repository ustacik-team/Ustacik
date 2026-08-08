import { PrismaClient, Role, VerificationLevel, JobStatus, SubscriptionStatus, NotificationType } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

// High-quality Unsplash image URLs
const UNSPLASH_IMAGES = {
  avatars: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517423452873-1070868c0780?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
  ],
  work: [
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&h=600&fit=crop",
  ],
  review: [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&h=400&fit=crop",
  ],
};

async function main() {
  console.log("🌱 Starting Database Seed...");

  // 1. Clean Database
  console.log("🧹 Cleaning old records...");
  await prisma.adminLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.reviewPhoto.deleteMany();
  await prisma.reviewReply.deleteMany();
  await prisma.review.deleteMany();
  await prisma.job.deleteMany();
  await prisma.verificationLog.deleteMany();
  await prisma.verificationRecord.deleteMany();
  await prisma.workPhoto.deleteMany();
  await prisma.craftsmanSubService.deleteMany();
  await prisma.craftsmanCategory.deleteMany();
  await prisma.craftsmanProfile.deleteMany();
  await prisma.subService.deleteMany();
  await prisma.category.deleteMany();
  await prisma.region.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Regions
  console.log("📍 Seeding Regions...");
  const regionNames = ["Famagusta", "Lefke", "Kyrenia", "Nicosia"];
  const regions = await Promise.all(
    regionNames.map((name) => prisma.region.create({ data: { name } }))
  );
  const regionMap = Object.fromEntries(regions.map((r) => [r.name, r.id]));

  // 3. Seed Categories & Sub-Services
  console.log("🏷️ Seeding Categories & Sub-Services...");
  const categoryDefinitions = [
    {
      name: "Plumbing & Water Systems",
      subServices: ["Pipe Installation", "Water Heater Repair", "Drain Cleaning", "Leak Detection"],
    },
    {
      name: "Electrical",
      subServices: ["Wiring & Lighting", "Panel Upgrades", "Home Automation"],
    },
    {
      name: "HVAC & Refrigeration",
      subServices: ["AC Installation", "AC Repair", "Ventilation"],
    },
    {
      name: "Appliance & Electronics Repair",
      subServices: ["Washing Machine Repair", "TV Repair", "Fridge Repair"],
    },
    {
      name: "Painting & Plastering",
      subServices: ["Interior Painting", "Exterior Painting", "Drywall & Plaster"],
    },
    {
      name: "Carpentry & Furniture",
      subServices: ["Custom Furniture", "Door Installation", "Flooring"],
    },
    {
      name: "Aluminium, PVC & Glass",
      subServices: ["Window Installation", "Door Frames", "Glass Repair"],
    },
    {
      name: "Garden & Pool Maintenance",
      subServices: ["Landscaping", "Pool Cleaning", "Irrigation"],
    },
  ];

  const categories = [];
  const subServicesMap: Record<string, { id: string; name: string }[]> = {};

  for (const catDef of categoryDefinitions) {
    const category = await prisma.category.create({
      data: { name: catDef.name },
    });
    categories.push(category);

    const subList = [];
    for (const subName of catDef.subServices) {
      const sub = await prisma.subService.create({
        data: { name: subName, categoryId: category.id },
      });
      subList.push(sub);
    }
    subServicesMap[category.id] = subList;
  }

  // 4. Seed Admin User
  console.log("👑 Seeding Admin User...");
  const adminUser = await prisma.user.create({
    data: {
      id: "admin-user-1",
      name: "Super Admin",
      email: "admin@ustacik.com",
      role: Role.ADMIN,
      image: UNSPLASH_IMAGES.avatars[0],
      phone: "+90 533 000 0000",
    },
  });

  // 5. Seed Customers (10 Customers)
  console.log("👥 Seeding Customers...");
  const customerUsers = [];
  const customerNames = [
    "Sarah Mitchell", "David Karim", "Elena Rossi", "Marios Papas", "Ayesha Khan",
    "Omar Al-Hassan", "Maria Santos", "John Taylor", "Sofia Garcia", "Alex Smith"
  ];

  for (let i = 0; i < customerNames.length; i++) {
    const cust = await prisma.user.create({
      data: {
        id: `customer-${i + 1}`,
        name: customerNames[i],
        email: `customer${i + 1}@example.com`,
        role: Role.CUSTOMER,
        image: UNSPLASH_IMAGES.avatars[i % UNSPLASH_IMAGES.avatars.length],
        phone: `+90 533 111 000${i}`,
      },
    });
    customerUsers.push(cust);
  }

  // 6. Seed Craftsmen Profiles (5 FEATURED + 15 REGULAR)
  console.log("🛠️ Seeding Craftsmen Profiles...");

  const featuredCraftsmenData = [
    {
      name: "Ahmet Yılmaz",
      businessName: "Yılmaz Master Plumbing",
      bio: "Licensed master plumber with over 15 years of experience in residential and commercial plumbing systems across Northern Cyprus.",
      regionName: "Nicosia",
      categoryName: "Plumbing & Water Systems",
      subServiceNames: ["Pipe Installation", "Water Heater Repair", "Drain Cleaning"],
      priceMin: 200,
      priceMax: 800,
      totalJobs: 35,
      image: UNSPLASH_IMAGES.avatars[1],
    },
    {
      name: "Mehmet Demir",
      businessName: "Demir Electrical Solutions",
      bio: "Certified high-voltage electrician specializing in modern smart home automation, panel upgrades, and emergency electrical repair.",
      regionName: "Kyrenia",
      categoryName: "Electrical",
      subServiceNames: ["Wiring & Lighting", "Panel Upgrades", "Home Automation"],
      priceMin: 250,
      priceMax: 950,
      totalJobs: 28,
      image: UNSPLASH_IMAGES.avatars[3],
    },
    {
      name: "Hasan Eminağa",
      businessName: "Eminağa Bespoke Carpentry",
      bio: "Master woodworker crafting premium solid wood furniture, custom kitchen cabinetry, and precision hardwood flooring.",
      regionName: "Famagusta",
      categoryName: "Carpentry & Furniture",
      subServiceNames: ["Custom Furniture", "Door Installation", "Flooring"],
      priceMin: 400,
      priceMax: 1800,
      totalJobs: 42,
      image: UNSPLASH_IMAGES.avatars[5],
    },
    {
      name: "Emre Can",
      businessName: "Can HVAC & Climate Control",
      bio: "HVAC expert specializing in VRF air conditioning installation, heat pump maintenance, and industrial refrigeration systems.",
      regionName: "Nicosia",
      categoryName: "HVAC & Refrigeration",
      subServiceNames: ["AC Installation", "AC Repair", "Ventilation"],
      priceMin: 300,
      priceMax: 1200,
      totalJobs: 31,
      image: UNSPLASH_IMAGES.avatars[7],
    },
    {
      name: "Cansu Şahin",
      businessName: "Şahin Electronics & Appliance Repair",
      bio: "Fast, reliable repair technician for washing machines, dishwashers, double-door refrigerators, and modern LED/OLED displays.",
      regionName: "Lefke",
      categoryName: "Appliance & Electronics Repair",
      subServiceNames: ["Washing Machine Repair", "TV Repair", "Fridge Repair"],
      priceMin: 150,
      priceMax: 500,
      totalJobs: 25,
      image: UNSPLASH_IMAGES.avatars[8],
    },
  ];

  const regularCraftsmenData = [
    { name: "Ayşe Kaya", business: "Kaya Decor & Painting", cat: "Painting & Plastering", region: "Famagusta", level: VerificationLevel.VERIFIED },
    { name: "Mustafa Çelik", business: "Çelik Woodcraft", cat: "Carpentry & Furniture", region: "Lefke", level: VerificationLevel.VERIFIED },
    { name: "Zeynep Öztürk", business: "Öztürk Pool & Garden", cat: "Garden & Pool Maintenance", region: "Lefke", level: VerificationLevel.REGISTERED },
    { name: "Ali Can", business: "Can AC Services", cat: "HVAC & Refrigeration", region: "Nicosia", level: VerificationLevel.VERIFIED },
    { name: "Elif Yıldız", business: "Yıldız Electronics", cat: "Appliance & Electronics Repair", region: "Kyrenia", level: VerificationLevel.REGISTERED },
    { name: "Fatma Şahin", business: "Şahin Aluminium & Glass", cat: "Aluminium, PVC & Glass", region: "Lefke", level: VerificationLevel.REGISTERED },
    { name: "Kemal Aydın", business: "Aydın Painting Co.", cat: "Painting & Plastering", region: "Lefke", level: VerificationLevel.VERIFIED },
    { name: "Hatice Yılmaz", business: "Yılmaz Electric", cat: "Electrical", region: "Nicosia", level: VerificationLevel.REGISTERED },
    { name: "Serkan Kaya", business: "Kaya Water Works", cat: "Plumbing & Water Systems", region: "Kyrenia", level: VerificationLevel.VERIFIED },
    { name: "Merve Demir", business: "Demir Cooling", cat: "HVAC & Refrigeration", region: "Famagusta", level: VerificationLevel.REGISTERED },
    { name: "Okan Çelik", business: "Çelik Outdoor Care", cat: "Garden & Pool Maintenance", region: "Lefke", level: VerificationLevel.VERIFIED },
    { name: "Seda Öztürk", business: "Öztürk Glass Tech", cat: "Aluminium, PVC & Glass", region: "Lefke", level: VerificationLevel.REGISTERED },
    { name: "Simge Yıldız", business: "Yıldız Finishers", cat: "Painting & Plastering", region: "Kyrenia", level: VerificationLevel.VERIFIED },
    { name: "Burak Eminağa", business: "Eminağa Smart Power", cat: "Electrical", region: "Famagusta", level: VerificationLevel.REGISTERED },
    { name: "Murat Aydın", business: "Aydın Hydro Solutions", cat: "Plumbing & Water Systems", region: "Lefke", level: VerificationLevel.REGISTERED },
  ];

  const allCraftsmenProfiles = [];

  // Seed Featured Craftsmen
  for (let i = 0; i < featuredCraftsmenData.length; i++) {
    const data = featuredCraftsmenData[i];
    const category = categories.find((c) => c.name === data.categoryName)!;
    const regionId = regionMap[data.regionName] || regions[0].id;

    const user = await prisma.user.create({
      data: {
        id: `craftsman-user-featured-${i + 1}`,
        name: data.name,
        email: `featured.craftsman${i + 1}@ustacik.com`,
        role: Role.CRAFTSMAN,
        image: data.image,
        phone: `+90 533 999 000${i}`,
      },
    });

    const profile = await prisma.craftsmanProfile.create({
      data: {
        id: `craftsman-featured-${i + 1}`,
        userId: user.id,
        businessName: data.businessName,
        bio: data.bio,
        regionId,
        verificationLevel: VerificationLevel.APPROVED,
        businessRegistrationNumber: `TRNC-BIZ-2024-00${i + 1}`,
        workmanshipGuarantee: true,
        priceRangeMin: data.priceMin,
        priceRangeMax: data.priceMax,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        totalJobsCompleted: data.totalJobs,
      },
    });

    // Link Category & SubServices
    await prisma.craftsmanCategory.create({
      data: { craftsmanId: profile.id, categoryId: category.id },
    });

    const categorySubServices = subServicesMap[category.id] || [];
    for (const subName of data.subServiceNames) {
      const sub = categorySubServices.find((s) => s.name === subName);
      if (sub) {
        await prisma.craftsmanSubService.create({
          data: { craftsmanId: profile.id, subServiceId: sub.id },
        });
      }
    }

    // Add Work Photos
    for (let p = 0; p < 3; p++) {
      await prisma.workPhoto.create({
        data: {
          craftsmanId: profile.id,
          imageUrl: UNSPLASH_IMAGES.work[(i * 2 + p) % UNSPLASH_IMAGES.work.length],
        },
      });
    }

    // Add Verification Record
    const verRec = await prisma.verificationRecord.create({
      data: {
        craftsmanId: profile.id,
        level: VerificationLevel.APPROVED,
        phoneVerified: true,
        idVerified: true,
        referencesVerified: true,
        workPhotosVerified: true,
        businessRegistrationVerified: true,
        guaranteeVerified: true,
        verifiedBy: adminUser.id,
        notes: "Full background check and document verification passed.",
      },
    });

    await prisma.verificationLog.create({
      data: {
        verificationRecordId: verRec.id,
        action: "APPROVED_LEVEL_GRANTED",
        notes: "Granted Approved Craftsman status.",
      },
    });

    allCraftsmenProfiles.push({ profile, isFeatured: true, categoryId: category.id });
  }

  // Seed Regular Craftsmen
  for (let i = 0; i < regularCraftsmenData.length; i++) {
    const data = regularCraftsmenData[i];
    const category = categories.find((c) => c.name === data.cat) || categories[0];
    const regionId = regionMap[data.region] || regions[0].id;

    const user = await prisma.user.create({
      data: {
        id: `craftsman-user-regular-${i + 1}`,
        name: data.name,
        email: `craftsman${i + 1}@ustacik.com`,
        role: Role.CRAFTSMAN,
        image: UNSPLASH_IMAGES.avatars[(i + 5) % UNSPLASH_IMAGES.avatars.length],
        phone: `+90 533 777 00${i < 10 ? '0' + i : i}`,
      },
    });

    const profile = await prisma.craftsmanProfile.create({
      data: {
        id: `craftsman-regular-${i + 1}`,
        userId: user.id,
        businessName: data.business,
        bio: `Experienced specialist offering professional service in ${category.name}.`,
        regionId,
        verificationLevel: data.level,
        workmanshipGuarantee: data.level === VerificationLevel.VERIFIED,
        priceRangeMin: 150 + i * 10,
        priceRangeMax: 400 + i * 20,
        subscriptionStatus: SubscriptionStatus.FREE,
        totalJobsCompleted: 5 + i,
      },
    });

    await prisma.craftsmanCategory.create({
      data: { craftsmanId: profile.id, categoryId: category.id },
    });

    const categorySubServices = subServicesMap[category.id] || [];
    if (categorySubServices.length > 0) {
      await prisma.craftsmanSubService.create({
        data: { craftsmanId: profile.id, subServiceId: categorySubServices[0].id },
      });
    }

    allCraftsmenProfiles.push({ profile, isFeatured: false, categoryId: category.id });
  }

  // 7. Seed Jobs & Reviews
  console.log("📝 Seeding Jobs & Reviews...");

  const jobTitles = [
    "Emergency Leak Repair", "Full Living Room Rewiring", "Split AC Unit Service",
    "Kitchen Cabinet Customization", "Interior Apartment Painting", "Bathroom Tiling & Plastering",
    "Garden Pool Cleaning", "Window Frame Replacement"
  ];

  // For Featured Craftsmen: Create 12 COMPLETED jobs with 5-star reviews to guarantee reviewCount >= 10 and rating >= 4.5
  for (const { profile, isFeatured, categoryId } of allCraftsmenProfiles) {
    const jobCount = isFeatured ? 12 : 3;

    for (let j = 0; j < jobCount; j++) {
      const customer = customerUsers[j % customerUsers.length];
      const title = jobTitles[j % jobTitles.length];
      const categorySubServices = subServicesMap[categoryId] || [];
      const subServiceId = categorySubServices[0]?.id || null;

      const isCompleted = isFeatured || j < 2;
      const status = isCompleted ? JobStatus.COMPLETED : (j === 2 ? JobStatus.PENDING : JobStatus.ACCEPTED);

      const job = await prisma.job.create({
        data: {
          customerId: customer.id,
          craftsmanId: profile.id,
          categoryId,
          subServiceId,
          title,
          description: `Customer requested ${title} at residential property.`,
          address: `Block ${j + 1}, Main Avenue, Northern Cyprus`,
          status,
          completedAt: isCompleted ? new Date() : null,
        },
      });

      // Create Review for completed jobs
      if (isCompleted) {
        const ratingScore = isFeatured ? 5 : (4 + (j % 2));
        const review = await prisma.review.create({
          data: {
            jobId: job.id,
            customerId: customer.id,
            craftsmanId: profile.id,
            punctuality: ratingScore,
            workmanship: ratingScore,
            priceHonesty: ratingScore,
            communication: ratingScore,
            comment: `Excellent work on ${title}! Highly recommended craftsman.`,
          },
        });

        // Add Review Photo
        if (j % 2 === 0) {
          await prisma.reviewPhoto.create({
            data: {
              reviewId: review.id,
              imageUrl: UNSPLASH_IMAGES.review[j % UNSPLASH_IMAGES.review.length],
            },
          });
        }

        // Add Craftsman Reply
        if (j % 3 === 0) {
          await prisma.reviewReply.create({
            data: {
              reviewId: review.id,
              craftsmanId: profile.id,
              reply: "Thank you for your business and kind words! Glad we could help.",
            },
          });
        }
      }
    }
  }

  // 8. Seed Notifications & Admin Logs
  console.log("🔔 Seeding Notifications & Admin Logs...");

  for (const cust of customerUsers.slice(0, 3)) {
    await prisma.notification.create({
      data: {
        userId: cust.id,
        type: NotificationType.JOB_ACCEPTED,
        title: "Job Accepted",
        message: "Your craftsman has accepted your service request.",
      },
    });
  }

  await prisma.adminLog.create({
    data: {
      adminId: adminUser.id,
      action: "MANUAL_VERIFICATION_APPROVED",
      entityType: "CraftsmanProfile",
      entityId: allCraftsmenProfiles[0].profile.id,
    },
  });

  console.log("✅ Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
