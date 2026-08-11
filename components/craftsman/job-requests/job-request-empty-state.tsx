import { Inbox, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";

interface JobRequestEmptyStateProps {
  isFiltered: boolean;
  onClearFilters?: () => void;
}

export function JobRequestEmptyState({ isFiltered, onClearFilters }: JobRequestEmptyStateProps) {
  if (isFiltered) {
    return (
      <Empty className="border border-dashed py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX className="size-6 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>No job requests found</EmptyTitle>
          <EmptyDescription>
            Try changing your search or filter options to find what you are looking for.
          </EmptyDescription>
        </EmptyHeader>
        {onClearFilters && (
          <EmptyContent>
            <Button size="sm" variant="outline" onClick={onClearFilters}>
              Clear search & filters
            </Button>
          </EmptyContent>
        )}
      </Empty>
    );
  }

  return (
    <Empty className="border border-dashed py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox className="size-6 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No job requests yet</EmptyTitle>
        <EmptyDescription>
          When customers request your services, their requests will appear here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
