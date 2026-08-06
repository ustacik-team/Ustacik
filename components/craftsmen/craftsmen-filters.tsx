// components/craftsmen/craftsmen-filters.tsx
"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  category: string;
  region: string;
  verification: string;
  sort: string;
}

interface CraftsmenFiltersProps {
  /** Current filter values */
  filters: FilterOptions;
  /** Callback when any filter changes */
  onFilterChange: (filters: FilterOptions) => void;
  /** Available categories (defaults to the 8 from the brief) */
  categories?: { value: string; label: string }[];
  /** Available regions */
  regions?: { value: string; label: string }[];
  /** Verification levels */
  verificationLevels?: { value: string; label: string }[];
  /** Sort options */
  sortOptions?: { value: string; label: string }[];
  /** Whether to show the reset button */
  showReset?: boolean;
}

const defaultCategories = [
  { value: "all", label: "All Categories" },
  { value: "Plumbing & Water Systems", label: "Plumbing & Water Systems" },
  { value: "Electrical", label: "Electrical" },
  { value: "HVAC & Refrigeration", label: "HVAC & Refrigeration" },
  { value: "Appliance & Electronics Repair", label: "Appliance & Electronics Repair" },
  { value: "Painting & Plastering", label: "Painting & Plastering" },
  { value: "Carpentry & Furniture", label: "Carpentry & Furniture" },
  { value: "Aluminium, PVC & Glass", label: "Aluminium, PVC & Glass" },
  { value: "Garden & Pool Maintenance", label: "Garden & Pool Maintenance" },
];

const defaultRegions = [
  { value: "all", label: "All Regions" },
  { value: "Nicosia", label: "Nicosia" },
  { value: "Kyrenia", label: "Kyrenia" },
  { value: "Famagusta", label: "Famagusta" },
  { value: "Morphou", label: "Morphou" },
  { value: "Larnaca", label: "Larnaca" },
];

const defaultVerificationLevels = [
  { value: "all", label: "All" },
  { value: "REGISTERED", label: "Registered" },
  { value: "VERIFIED", label: "Verified" },
  { value: "APPROVED", label: "Approved" },
];

const defaultSortOptions = [
  { value: "rating_desc", label: "Highest Rated" },
  { value: "reviews_desc", label: "Most Reviews" },
  { value: "jobs_desc", label: "Most Jobs Completed" },
  { value: "newest", label: "Newest" },
  { value: "name_asc", label: "Name A-Z" },
];

export function CraftsmenFilters({
  filters,
  onFilterChange,
  categories = defaultCategories,
  regions = defaultRegions,
  verificationLevels = defaultVerificationLevels,
  sortOptions = defaultSortOptions,
  showReset = true,
}: CraftsmenFiltersProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const updated = { ...filters, [key]: value };
    onFilterChange(updated);
  };

  const handleReset = () => {
    const reset = {
      category: "all",
      region: "all",
      verification: "all",
      sort: "rating_desc",
    };
    onFilterChange(reset);
    if (isSheetOpen) setIsSheetOpen(false);
  };

  const isFiltered = () => {
    return (
      filters.category !== "all" ||
      filters.region !== "all" ||
      filters.verification !== "all"
    );
  };

  const activeFilterCount = (["category", "region", "verification"] as const).filter(
    (key) => filters[key] !== "all"
  ).length;
  return (
    <div className="w-full">
      {/* Desktop: full filter bar */}
      <div className="hidden md:flex md:flex-wrap md:items-center md:gap-3">
        {/* Category */}
        <Select
          value={filters.category}
          onValueChange={(val) => handleFilterChange("category", val)}
        >
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Region */}
        <Select
          value={filters.region}
          onValueChange={(val) => handleFilterChange("region", val)}
        >
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((reg) => (
              <SelectItem key={reg.value} value={reg.value}>
                {reg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Verification */}
        <Select
          value={filters.verification}
          onValueChange={(val) => handleFilterChange("verification", val)}
        >
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            {verificationLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sort}
          onValueChange={(val) => handleFilterChange("sort", val)}
        >
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showReset && isFiltered() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-10 px-3 text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Mobile: Filter button + Sheet */}
      <div className="flex items-center gap-3 md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {isFiltered() && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-5">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(val) => handleFilterChange("category", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <Select
                  value={filters.region}
                  onValueChange={(val) => handleFilterChange("region", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((reg) => (
                      <SelectItem key={reg.value} value={reg.value}>
                        {reg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Verification */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Verification</label>
                <Select
                  value={filters.verification}
                  onValueChange={(val) => handleFilterChange("verification", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Verification" />
                  </SelectTrigger>
                  <SelectContent>
                    {verificationLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by</label>
                <Select
                  value={filters.sort}
                  onValueChange={(val) => handleFilterChange("sort", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex gap-3">
                {showReset && (
                  <Button variant="outline" className="flex-1" onClick={handleReset}>
                    Reset Filters
                  </Button>
                )}
                <SheetClose asChild>
                  <Button className="flex-1">Apply Filters</Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {isFiltered() && (
          <span className="text-xs text-muted-foreground">
            {Object.entries(filters)
              .filter(([key, val]) => val !== "all" && key !== "sort")
              .map(([key, val]) => val)
              .join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}