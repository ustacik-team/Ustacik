// components/craftsmen/craftsmen-grid.tsx
"use client";

import { CraftsmanCard, CraftsmanCardProps } from "@/components/craftsmen/craftsman-card";
import { CraftsmanCardSkeleton } from "@/components/craftsmen/craftsman-card-skeleton";
import { EmptyState } from "@/components/craftsmen/empty-state";
import { cn } from "@/lib/utils";

interface CraftsmenGridProps {
  /** Array of craftsman data to display */
  craftsmen: CraftsmanCardProps[];
  /** Whether the data is being loaded */
  loading?: boolean;
  /** Number of skeleton cards to show while loading (default: 8) */
  skeletonCount?: number;
  /** Callback when the "Reset Filters" button is clicked */
  onResetFilters?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Empty state customisations */
  emptyState?: {
    title?: string;
    description?: string;
    buttonText?: string;
  };
  displayMode?: "grid" | "list";
  comparisonIds?: string[];
  onToggleComparison?: (craftsmanId: string) => void;
}

export function CraftsmenGrid({
  craftsmen,
  loading = false,
  skeletonCount = 8,
  onResetFilters,
  className,
  emptyState = {},
  displayMode = "grid",
  comparisonIds = [],
  onToggleComparison,
}: CraftsmenGridProps) {
  // Show skeletons while loading
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          displayMode === "grid" && "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          className
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <CraftsmanCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show empty state when no craftsmen
  if (craftsmen.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title={emptyState.title}
          description={emptyState.description}
          buttonText={emptyState.buttonText}
          onResetFilters={onResetFilters}
        />
      </div>
    );
  }

  // Render the grid with cards
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6",
        displayMode === "grid" && "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {craftsmen.map((craftsman) => (
        <CraftsmanCard
          key={craftsman.id}
          {...craftsman}
          comparisonSelected={comparisonIds.includes(craftsman.id)}
          onToggleComparison={onToggleComparison}
        />
      ))}
    </div>
  );
}
