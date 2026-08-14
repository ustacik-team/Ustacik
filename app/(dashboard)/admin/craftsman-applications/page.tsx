import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { Role } from "@prisma/client";
import { CraftsmanApplicationsReview } from "@/components/admin/craftsman-applications-review";

export default async function CraftsmanApplicationsPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in?redirect=/admin/craftsman-applications");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Craftsman Applications</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review, approve, or reject incoming craftsman registration applications.
        </p>
      </div>

      <CraftsmanApplicationsReview />
    </div>
  );
}