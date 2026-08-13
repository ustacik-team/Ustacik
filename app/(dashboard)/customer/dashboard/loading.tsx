import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      {/* Header skeleton */}
      <Skeleton className="h-28 w-full rounded-2xl" />

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>

      {/* Current job & find craftsmen grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>

      {/* Recent requests & reviews grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>

      {/* Notifications & account overview grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>

      {/* Quick actions skeleton */}
      <Skeleton className="h-36 w-full rounded-2xl" />
    </div>
  );
}
