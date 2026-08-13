import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, UserCheck, User, Star, Bell, Bookmark, Sparkles } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Find a Craftsman",
      description: "Search local specialists",
      href: "/find-craftsmen",
      icon: UserCheck,
      color: "text-primary bg-primary/10",
    },
    {
      title: "My Job Requests",
      description: "Track direct inquiries",
      href: "/customer/my-job-requests",
      icon: Briefcase,
      color: "text-sky-600 dark:text-sky-400 bg-sky-500/10",
    },
    {
      title: "Saved Craftsmen",
      description: "Bookmarked specialists",
      href: "/customer/saved",
      icon: Bookmark,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "My Reviews",
      description: "Ratings & feedback shared",
      href: "/customer/reviews",
      icon: Star,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    },
    {
      title: "Notifications",
      description: "Updates & system alerts",
      href: "/customer/notifications",
      icon: Bell,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    },
    {
      title: "Account Settings",
      description: "Manage credentials & profile",
      href: "/settings",
      icon: User,
      color: "text-violet-600 dark:text-violet-400 bg-violet-500/10",
    },
  ];

  return (
    <Card className="border-border/70 bg-card">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span>Quick Actions</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Shortcuts to your customer portal sections
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0">
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Button
                key={act.title}
                variant="outline"
                asChild
                className="h-auto flex-col items-start p-3.5 border-border/70 hover:border-primary/40 hover:bg-primary/5 transition-all text-left justify-start group"
              >
                <Link href={act.href}>
                  <div className={`grid size-8 place-items-center rounded-lg ${act.color} mb-2 group-hover:scale-105 transition-transform`}>
                    <Icon className="size-4" />
                  </div>
                  <span className="font-bold text-xs text-foreground block truncate w-full">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal block truncate w-full mt-0.5">
                    {act.description}
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
