import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfilePhoto } from "@/components/settings/profile-photo";
import { UserCheck, Calendar, Mail, Phone, Shield, User as UserIcon } from "lucide-react";

interface ProfileOverviewProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: string;
    createdAt: Date;
    emailVerified: boolean;
    image?: string | null;
  };
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  // Format Date Joined: "Joined August 11, 2026"
  const formattedJoinedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(user.createdAt));

  const roleLabel =
    user.role === "ADMIN"
      ? "Administrator"
      : user.role === "CRAFTSMAN"
      ? "Craftsman"
      : "Customer";

  const roleBadgeStyle =
    user.role === "ADMIN"
      ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30"
      : user.role === "CRAFTSMAN"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
      : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30";

  return (
    <Card className="border-border/70 bg-card shadow-xs">
      <CardHeader className="p-5 sm:p-6 pb-4">
        <div className="flex items-center gap-2 text-primary">
          <UserIcon className="size-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Profile Overview</span>
        </div>
        <CardTitle className="text-xl font-bold tracking-tight mt-1">Profile Overview</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Your main identity and platform profile summary
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 rounded-2xl bg-muted/40 border border-border/50">
          <ProfilePhoto user={{ name: user.name, image: user.image }} />

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                {user.name}
              </h2>
              <Badge variant="outline" className={`text-xs font-semibold px-2.5 py-0.5 ${roleBadgeStyle}`}>
                <Shield className="size-3 mr-1" />
                {roleLabel}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Phone className="size-3.5 text-primary shrink-0" />
                <span>{user.phone || "No phone provided"}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Joined {formattedJoinedDate}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>{user.emailVerified ? "Verified Email" : "Unverified Email"}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground/70 font-mono">
              Account ID: <span className="select-all">{user.id}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
