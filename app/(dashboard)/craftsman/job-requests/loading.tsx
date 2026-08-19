import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function JobRequestsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters Bar Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-full sm:w-80" />
        <Skeleton className="h-9 w-full sm:w-96" />
      </div>

      {/* Job Cards Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader className="p-4 pb-3 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3 flex-1">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-4 border-t flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
