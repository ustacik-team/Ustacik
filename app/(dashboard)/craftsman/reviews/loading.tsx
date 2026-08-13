import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function CraftsmanReviewsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      {/* Summary Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-5 flex flex-col justify-between">
          <Skeleton className="h-5 w-32 mb-2" />
          <div className="flex flex-col items-center py-4 space-y-2">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-6 w-40 mx-auto rounded-full" />
        </Card>

        <Card className="p-5 md:col-span-2 space-y-4">
          <Skeleton className="h-5 w-44" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Review List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
          </Card>
        ))}
      </div>
    </div>
  );
}
