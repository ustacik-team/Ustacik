//app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/sign-in");
  }

  switch (session.user.role) {
    case "ADMIN":
      redirect("/admin/dashboard");

    case "CRAFTSMAN":
      redirect("/craftsman/dashboard");

    case "CUSTOMER":
    default:
      redirect("/customer/dashboard");
  }
}