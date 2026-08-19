import { Users, ShieldCheck, Briefcase, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CraftsmenHeroProps {
  /** Total number of craftsmen on the platform */
  totalCraftsmen: number;
  /** Number of verified craftsmen (VERIFIED + APPROVED) */
  verifiedCraftsmen: number;
  /** Total completed jobs across the platform */
  completedJobs: number;
  /** Total number of reviews submitted */
  totalReviews: number;
  /** Whether stats are currently loading */
  loading?: boolean;
  /** Optional title override */
  title?: string;
  /** Optional subtitle override */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
}

const statConfig = [
  {
    key: "totalCraftsmen",
    icon: Users,
    label: "Total Craftsmen",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    key: "verifiedCraftsmen",
    icon: ShieldCheck,
    label: "Verified",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
  },
  {
    key: "completedJobs",
    icon: Briefcase,
    label: "Jobs Completed",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950",
  },
  {
    key: "totalReviews",
    icon: Star,
    label: "Reviews",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
];

export function CraftsmenHero({
  totalCraftsmen,
  verifiedCraftsmen,
  completedJobs,
  totalReviews,
  loading = false,
  title = "Find Trusted Craftsmen",
  subtitle = "Find verified craftsmen across Northern Cyprus.",
  className,
}: CraftsmenHeroProps) {
  const stats = { totalCraftsmen, verifiedCraftsmen, completedJobs, totalReviews };

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50",
        "py-8 px-4 sm:px-6 md:py-12 md:px-8",
        className
      )}
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Title & Subtitle */}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {subtitle}
        </p>

        {/* Stats Grid */}
        <div className="mt-8 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {statConfig.map((stat) => {
            const Icon = stat.icon;
            const value = stats[stat.key as keyof typeof stats];
            return (
              <Card key={stat.key} className="border-0 shadow-sm">
                <CardContent className="flex flex-col items-center gap-1 p-3 sm:p-4">
                  <div className={cn("rounded-full p-2", stat.bgColor)}>
                    <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", stat.color)} />
                  </div>
                  {loading ? (
                    <Skeleton className="h-7 w-16 my-0.5 rounded-md" />
                  ) : (
                    <span className="text-xl font-bold sm:text-2xl">
                      {value.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}