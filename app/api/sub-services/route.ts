import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

export async function GET() {
  try {
    // Fetch all categories with their sub-services
    const categories = await prisma.category.findMany({
      include: {
        subServices: {
          select: { name: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    // Transform to a flat list for the filter dropdown
    const subServiceOptions = categories.flatMap((cat) =>
      cat.subServices.map((sub) => ({
        category: cat.name,
        value: sub.name,
        label: sub.name,
      }))
    );

    return apiSuccess(subServiceOptions);
  } catch (error) {
    return handleApiError(error);
  }
}