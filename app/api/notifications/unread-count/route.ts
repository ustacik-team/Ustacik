import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { getServerSession } from "@/lib/get-session";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return apiSuccess({ count: 0 });
    }

    const count = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    });

    return apiSuccess({ count });
  } catch (error) {
    return handleApiError(error);
  }
}
