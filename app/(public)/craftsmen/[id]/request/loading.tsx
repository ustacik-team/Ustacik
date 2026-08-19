import { Skeleton } from "@/components/ui/skeleton";

export default function RequestJobLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar placeholder */}
      <div className="h-16 border-b border-border/40 bg-background/80" />

      <main className="flex-1">
        <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12 space-y-8">
          {/* Header skeleton */}
          <div className="space-y-4">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start pt-2">
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-8 w-56 sm:w-72" />
                <Skeleton className="h-4 w-full max-w-xl" />
              </div>
            </div>
          </div>

          {/* Craftsman summary card skeleton */}
          <div className="rounded-xl border border-border/40 bg-card p-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Skeleton className="size-20 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-6 w-44" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full max-w-md" />
                <div className="flex gap-4 pt-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-border/20">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-5 w-40 rounded-md" />
            </div>
          </div>

          {/* Main content grid (Form & Summary) */}
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            {/* Form & Trust Section */}
            <div className="space-y-6">
              {/* Form Card Skeleton */}
              <div className="rounded-xl border border-border/40 bg-card/60 p-6 space-y-6">
                <div className="space-y-2 border-b border-border/20 pb-4">
                  <Skeleton className="h-6 w-56" />
                  <Skeleton className="h-4 w-80" />
                </div>

                {/* 2-col category & sub-service select */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>

                {/* Job Title */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-3 w-64" />
                </div>

                {/* Description Textarea */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-32 w-full rounded-md" />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {/* Submit Button */}
                <Skeleton className="h-11 w-full sm:w-48 rounded-md" />
              </div>

              {/* Trust Section Skeleton */}
              <div className="rounded-xl border border-border/40 bg-card/40 p-6 space-y-4">
                <Skeleton className="h-5 w-40" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Sidebar Summary Card Skeleton */}
            <div className="rounded-xl border border-border/40 bg-card/60 p-5 space-y-5 lg:sticky lg:top-24">
              <Skeleton className="h-5 w-36" />
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="border-t border-border/20 pt-4 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
