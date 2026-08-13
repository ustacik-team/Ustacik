import { Skeleton } from "@/components/ui/skeleton";

export default function RequestJobLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="h-16 border-b border-border/40" />
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10 space-y-8">
          {/* Header skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Craftsman summary skeleton */}
          <Skeleton className="h-32 w-full rounded-2xl" />

          {/* Form & summary skeleton grid */}
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-6">
              <Skeleton className="h-[450px] w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
