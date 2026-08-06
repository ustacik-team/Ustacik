// components/craftsmen/stats-cards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, Briefcase, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsCardsProps {
  /** Total number of craftsmen */
  totalCraftsmen: number;
  /** Number of verified craftsmen (VERIFIED + APPROVED) */
  verifiedCraftsmen: number;
  /** Total completed jobs */
  completedJobs: number;
  /** Total reviews */
  totalReviews: number;
  /** Additional CSS classes */
  className?: string;
}

const statItems = [
  {
    key: "totalCraftsmen",
    icon: Users,
    label: "Craftsmen",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "hover:border-blue-200 dark:hover:border-blue-800",
  },
  {
    key: "verifiedCraftsmen",
    icon: ShieldCheck,
    label: "Verified",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "hover:border-emerald-200 dark:hover:border-emerald-800",
  },
  {
    key: "completedJobs",
    icon: Briefcase,
    label: "Jobs Completed",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "hover:border-amber-200 dark:hover:border-amber-800",
  },
  {
    key: "totalReviews",
    icon: Star,
    label: "Reviews",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "hover:border-purple-200 dark:hover:border-purple-800",
  },
];

export function StatsCards({
  totalCraftsmen,
  verifiedCraftsmen,
  completedJobs,
  totalReviews,
  className,
}: StatsCardsProps) {
  const stats = { totalCraftsmen, verifiedCraftsmen, completedJobs, totalReviews };

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4",
        className
      )}
    >
      {statItems.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key as keyof typeof stats];
        return (
          <Card
            key={item.key}
            className={cn(
              "border transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
              item.borderColor
            )}
          >
            <CardContent className="flex flex-col items-center gap-1 p-4 sm:p-6">
              <div className={cn("rounded-full p-2.5", item.bgColor)}>
                <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", item.color)} />
              </div>
              <span className="text-2xl font-bold sm:text-3xl">
                {value.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}