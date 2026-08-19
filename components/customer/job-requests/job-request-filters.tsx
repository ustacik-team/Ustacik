import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface JobRequestFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: "ALL", label: "All Requests" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function JobRequestFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  onClearFilters,
}: JobRequestFiltersProps) {
  const hasActiveFilters = searchQuery.trim().length > 0 || selectedStatus !== "ALL";

  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-card/85 p-4 shadow-2xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, craftsman name, business, category, or address..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1.5 self-end sm:self-auto text-xs text-muted-foreground">
            <X className="size-3.5" /> Clear Filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-border/50 pt-3">
        {statusOptions.map((opt) => {
          const isActive = selectedStatus === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
