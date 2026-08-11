import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { ServicesHeader } from "@/components/craftsman/services/services-header";
import { ServicesOverview } from "@/components/craftsman/services/services-overview";
import { CategoryServicesList } from "@/components/craftsman/services/category-services-list";
import { ServicesEmptyState } from "@/components/craftsman/services/services-empty-state";
import { ServiceCategoryGroup } from "@/components/craftsman/services/service-category-card";

export default async function CraftsmanServicesPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    return null;
  }

  const craftsmanProfile = await prisma.craftsmanProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      subServices: {
        include: {
          subService: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!craftsmanProfile) {
    return <ServicesEmptyState />;
  }

  // Data Transformation: Group sub-services under their parent categories cleanly
  const categoryMap = new Map<string, ServiceCategoryGroup>();

  // 1. Initialize assigned categories
  for (const cc of craftsmanProfile.categories) {
    if (cc.category) {
      categoryMap.set(cc.category.id, {
        id: cc.category.id,
        name: cc.category.name,
        subServices: [],
      });
    }
  }

  // 2. Add assigned sub-services under their parent categories
  for (const cs of craftsmanProfile.subServices) {
    if (cs.subService) {
      const parentCat = cs.subService.category;
      if (!categoryMap.has(parentCat.id)) {
        categoryMap.set(parentCat.id, {
          id: parentCat.id,
          name: parentCat.name,
          subServices: [],
        });
      }

      const group = categoryMap.get(parentCat.id)!;
      if (!group.subServices.some((s) => s.id === cs.subService.id)) {
        group.subServices.push({
          id: cs.subService.id,
          name: cs.subService.name,
        });
      }
    }
  }

  const serviceCategories = Array.from(categoryMap.values());
  const totalSubServices = serviceCategories.reduce(
    (acc, cat) => acc + cat.subServices.length,
    0,
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ServicesHeader
        totalCategories={serviceCategories.length}
        totalSubServices={totalSubServices}
      />

      {serviceCategories.length > 0 ? (
        <>
          <ServicesOverview
            totalCategories={serviceCategories.length}
            totalSubServices={totalSubServices}
          />
          <CategoryServicesList categories={serviceCategories} />
        </>
      ) : (
        <ServicesEmptyState />
      )}
    </div>
  );
}
