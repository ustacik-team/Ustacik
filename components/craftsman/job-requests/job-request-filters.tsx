"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X } from "lucide-react";

interface JobRequestFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  counts: {
    all: number;
    pending: number;
    accepted: number;
    completed: number;
    cancelled: number;
  };
}

export function JobRequestFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  counts,
}: JobRequestFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, customer, category..."
          className="pl-9 pr-8 h-9 text-xs sm:text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="overflow-x-auto pb-1 sm:pb-0">
        <Tabs value={statusFilter} onValueChange={onStatusChange} className="w-full sm:w-auto">
          <TabsList className="h-9 p-1 bg-muted/60 text-xs inline-flex w-max sm:w-auto">
            <TabsTrigger value="ALL" className="text-xs px-3 py-1">
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="text-xs px-3 py-1">
              Pending ({counts.pending})
            </TabsTrigger>
            <TabsTrigger value="ACCEPTED" className="text-xs px-3 py-1">
              Accepted ({counts.accepted})
            </TabsTrigger>
            <TabsTrigger value="COMPLETED" className="text-xs px-3 py-1">
              Completed ({counts.completed})
            </TabsTrigger>
            <TabsTrigger value="CANCELLED" className="text-xs px-3 py-1">
              Cancelled ({counts.cancelled})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
