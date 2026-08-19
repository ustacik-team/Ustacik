import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { AdminReviewsClient } from "@/components/admin/admin-reviews-client";

export default async function AdminReviewsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/reviews");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const reviewsList = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
        },
      },
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      craftsman: {
        select: {
          businessName: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      photos: {
        select: {
          imageUrl: true,
        },
      },
      reply: {
        select: {
          reply: true,
        },
      },
    },
  });

  const formattedReviews = reviewsList.map((r) => {
    const avg = ((r.punctuality + r.workmanship + r.priceHonesty + r.communication) / 4).toFixed(1);
    return {
      id: r.id,
      jobId: r.job.id,
      jobTitle: r.job.title,
      customerName: r.customer.name,
      customerEmail: r.customer.email,
      craftsmanBusinessName: r.craftsman.businessName,
      craftsmanUserName: r.craftsman.user.name,
      punctuality: r.punctuality,
      workmanship: r.workmanship,
      priceHonesty: r.priceHonesty,
      communication: r.communication,
      averageRating: avg,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      replyText: r.reply ? r.reply.reply : null,
      photos: r.photos.map((p) => p.imageUrl),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Review &amp; Rating Moderation</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Inspect customer reviews from verified platform jobs and enforce platform trust rules.
        </p>
      </div>

      <AdminReviewsClient reviews={formattedReviews} />
    </div>
  );
}
