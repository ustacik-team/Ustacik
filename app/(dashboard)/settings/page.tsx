import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Settings2 } from "lucide-react";
import { ProfileOverview } from "@/components/settings/profile-overview";
import { AccountInformation } from "@/components/settings/account-information";
import { AccountStatus } from "@/components/settings/account-status";
import { CraftsmanAccountSummary } from "@/components/settings/craftsman-account-summary";
import { ActiveSessions } from "@/components/settings/active-sessions";
import { AccountSecurity } from "@/components/settings/account-security";

export const metadata = {
  title: "Account Settings",
  description: "Manage your profile overview, account details, security actions, and preferences.",
};

export default async function SettingsPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const userId = session.user.id;

  // Fetch full user data directly from Prisma on the server
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      craftsmanProfile: {
        include: {
          region: true,
        },
      },
      sessions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Settings2 className="size-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Account Management</span>
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Settings & Account
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Manage your personal details, profile overview, security actions, and platform standing.
        </p>
      </div>

      {/* 1. Profile Overview */}
      <ProfileOverview user={user} />

      {/* 2. Account Information */}
      <AccountInformation user={user} />

      {/* 3. Account Status */}
      <AccountStatus
        user={{
          role: user.role,
          banned: user.banned,
          banReason: user.banReason,
          createdAt: user.createdAt,
        }}
        craftsmanProfile={user.craftsmanProfile}
      />

      {/* 4. Craftsman Specific Summary (if CRAFTSMAN) */}
      {user.role === "CRAFTSMAN" && user.craftsmanProfile && (
        <CraftsmanAccountSummary profile={user.craftsmanProfile} />
      )}

      {/* 5. Active Sessions */}
      <ActiveSessions sessions={user.sessions} />

      {/* 6. Account Security & Actions */}
      <AccountSecurity />
    </div>
  );
}
