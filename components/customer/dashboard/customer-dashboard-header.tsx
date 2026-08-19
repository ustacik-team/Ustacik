import { format } from "date-fns";
import { Calendar, UserCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CustomerDashboardHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    createdAt?: Date | string;
  };
}

export function CustomerDashboardHeader({ user }: CustomerDashboardHeaderProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CU";

  const memberSince = user.createdAt
    ? format(new Date(user.createdAt), "MMMM yyyy")
    : null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/70 bg-gradient-to-r from-card via-card to-primary/5 p-4 sm:p-6 shadow-xs">
      <div className="flex items-center gap-4 min-w-0">
        <Avatar className="size-14 sm:size-16 border-2 border-primary/20 shadow-xs shrink-0">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
              {user.name}
            </h1>
            <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 border-primary/30 bg-primary/10 text-primary">
              <UserCheck className="size-3.5 mr-1" />
              Customer Portal
            </Badge>
          </div>

          <p className="text-sm font-medium text-muted-foreground truncate">
            {user.email}
            {memberSince && (
              <span className="inline-flex items-center gap-1 ml-3 text-xs text-foreground/80 font-normal">
                <Calendar className="size-3.5 text-primary shrink-0" />
                Member since {memberSince}
              </span>
            )}
          </p>

          <p className="text-xs text-muted-foreground hidden sm:block">
            Welcome back! Browse verified craftsmen and manage your service requests from your workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
