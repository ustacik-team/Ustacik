// components/craftsmen/craftsman-card-skeleton.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CraftsmanCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-border bg-card dark:bg-card">
      <CardHeader className="flex flex-row items-start gap-4 p-4 pb-0">
        {/* Avatar skeleton */}
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
        {/* Name + Business skeleton */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Verification Badge + Rating skeleton */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Details Grid (2 columns) */}
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full col-span-2" />
        </div>

        {/* Jobs completed skeleton */}
        <div className="pt-1 border-t border-border/50">
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}