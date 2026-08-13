import Link from "next/link";
import { ClipboardX, SearchX, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobRequestEmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export function JobRequestEmptyState({ hasFilters, onClearFilters }: JobRequestEmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card/50">
        <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground mb-3">
          <SearchX className="size-6" />
        </div>
        <h3 className="text-lg font-bold">No matching job requests</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          No requests match your search criteria or status filter. Try clearing your filters or adjusting your search.
        </p>
        {onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters} className="mt-4">
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card/50">
      <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary mb-4">
        <ClipboardX className="size-7" />
      </div>
      <h3 className="text-xl font-bold">No job requests yet</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        You haven&apos;t submitted any job requests to craftsmen yet. Find verified local craftsmen in your area to get started.
      </p>
      <Button asChild size="lg" className="mt-6 gap-2 font-semibold">
        <Link href="/find-craftsmen">
          <UserCheck className="size-4" /> Find a Craftsman
        </Link>
      </Button>
    </div>
  );
}
