"use client";

import { useState, useMemo } from "react";
import {
  Filter,
  X,
  Banknote,
  ChevronDown,
  Layers,
  Wrench,
  MapPin,
  ShieldCheck,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export interface FilterOptions {
  category: string;
  subService: string;
  region: string;
  verification: string;
  minPrice?: string;
  maxPrice?: string;
  sort: string;
}

interface CraftsmenFiltersProps {
  /** Current filter values */
  filters: FilterOptions;
  /** Callback when any filter changes */
  onFilterChange: (filters: FilterOptions) => void;
  /** Available categories */
  categories?: { value: string; label: string }[];
  /** Available sub-services grouped by category (includes category key) */
  subServiceOptions?: { category: string; value: string; label: string }[];
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
  { value: "Famagusta", label: "Famagusta" },
  { value: "Lefke", label: "Lefke" },
  { value: "Kyrenia", label: "Kyrenia" },
  { value: "Nicosia", label: "Nicosia" },
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
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "name_asc", label: "Name A-Z" },
];

const pricePresets = [
  { label: "Under ₺500", min: "", max: "500" },
  { label: "₺500 – ₺1,000", min: "500", max: "1000" },
  { label: "₺1,000 – ₺2,500", min: "1000", max: "2500" },
  { label: "₺2,500+", min: "2500", max: "" },
];

// Pre-defined grouped mock sub-services based on your categories
const defaultSubServiceOptions = [
  { category: "Plumbing & Water Systems", value: "Pipe Installation", label: "Pipe Installation" },
  { category: "Plumbing & Water Systems", value: "Water Heater Repair", label: "Water Heater Repair" },
  { category: "Plumbing & Water Systems", value: "Drain Cleaning", label: "Drain Cleaning" },
  { category: "Electrical", value: "Wiring & Lighting", label: "Wiring & Lighting" },
  { category: "Electrical", value: "Panel Upgrades", label: "Panel Upgrades" },
  { category: "Electrical", value: "Home Automation", label: "Home Automation" },
  { category: "HVAC & Refrigeration", value: "AC Installation", label: "AC Installation" },
  { category: "HVAC & Refrigeration", value: "AC Repair", label: "AC Repair" },
  { category: "HVAC & Refrigeration", value: "Ventilation", label: "Ventilation" },
  { category: "Appliance & Electronics Repair", value: "Washing Machine Repair", label: "Washing Machine Repair" },
  { category: "Appliance & Electronics Repair", value: "TV Repair", label: "TV Repair" },
  { category: "Appliance & Electronics Repair", value: "Fridge Repair", label: "Fridge Repair" },
  { category: "Painting & Plastering", value: "Interior Painting", label: "Interior Painting" },
  { category: "Painting & Plastering", value: "Exterior Painting", label: "Exterior Painting" },
  { category: "Painting & Plastering", value: "Drywall & Plaster", label: "Drywall & Plaster" },
  { category: "Carpentry & Furniture", value: "Custom Furniture", label: "Custom Furniture" },
  { category: "Carpentry & Furniture", value: "Door Installation", label: "Door Installation" },
  { category: "Carpentry & Furniture", value: "Flooring", label: "Flooring" },
  { category: "Aluminium, PVC & Glass", value: "Window Installation", label: "Window Installation" },
  { category: "Aluminium, PVC & Glass", value: "Door Frames", label: "Door Frames" },
  { category: "Aluminium, PVC & Glass", value: "Glass Repair", label: "Glass Repair" },
  { category: "Garden & Pool Maintenance", value: "Landscaping", label: "Landscaping" },
  { category: "Garden & Pool Maintenance", value: "Pool Cleaning", label: "Pool Cleaning" },
  { category: "Garden & Pool Maintenance", value: "Irrigation", label: "Irrigation" },
];

export function CraftsmenFilters({
  filters,
  onFilterChange,
  categories = defaultCategories,
  subServiceOptions = defaultSubServiceOptions,
  regions = defaultRegions,
  verificationLevels = defaultVerificationLevels,
  sortOptions = defaultSortOptions,
  showReset = true,
}: CraftsmenFiltersProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false);

  // Filters sub-services based on the selected category
  const filteredSubServices = useMemo(() => {
    if (filters.category === "all") {
      return subServiceOptions;
    }
    return subServiceOptions.filter((sub) => sub.category === filters.category);
  }, [filters.category, subServiceOptions]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    if (key === "category") {
      const updated = { ...filters, [key]: value, subService: "all" };
      onFilterChange(updated);
      return;
    }
    const updated = { ...filters, [key]: value };
    onFilterChange(updated);
  };

  const handlePriceChange = (min: string, max: string) => {
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleReset = () => {
    const reset: FilterOptions = {
      category: "all",
      subService: "all",
      region: "all",
      verification: "all",
      minPrice: "",
      maxPrice: "",
      sort: "rating_desc",
    };
    onFilterChange(reset);
    if (isSheetOpen) setIsSheetOpen(false);
    if (isPricePopoverOpen) setIsPricePopoverOpen(false);
  };

  const hasPriceFilter = Boolean(filters.minPrice || filters.maxPrice);

  const getPriceButtonLabel = () => {
    if (filters.minPrice && filters.maxPrice) {
      return `₺${Number(filters.minPrice).toLocaleString()} – ₺${Number(filters.maxPrice).toLocaleString()}`;
    }
    if (filters.minPrice) {
      return `Min ₺${Number(filters.minPrice).toLocaleString()}`;
    }
    if (filters.maxPrice) {
      return `Max ₺${Number(filters.maxPrice).toLocaleString()}`;
    }
    return "Price Range";
  };

  const isFiltered = () => {
    return (
      filters.category !== "all" ||
      filters.subService !== "all" ||
      filters.region !== "all" ||
      filters.verification !== "all" ||
      hasPriceFilter
    );
  };

  const activeFilterCount =
    (["category", "subService", "region", "verification"] as const).filter(
      (key) => filters[key] !== "all"
    ).length + (hasPriceFilter ? 1 : 0);

  return (
    <div className="w-full">
      {/* Desktop: full filter bar */}
      <div className="hidden md:flex md:flex-wrap md:items-center md:gap-3">
        {/* Category */}
        <Select
          value={filters.category}
          onValueChange={(val) => handleFilterChange("category", val)}
        >
          <SelectTrigger className="w-[195px] h-10 gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
              <Layers className="h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" sideOffset={4}>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sub-Service Dropdown */}
        <Select
          value={filters.subService}
          onValueChange={(val) => handleFilterChange("subService", val)}
          disabled={!filteredSubServices || filteredSubServices.length === 0}
        >
          <SelectTrigger className="w-[195px] h-10 gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
              <Wrench className="h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Sub-Service" />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" sideOffset={4}>
            <SelectItem value="all">All Sub-Services</SelectItem>
            {filteredSubServices.map((sub) => (
              <SelectItem key={sub.value} value={sub.value}>
                {sub.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Region */}
        <Select
          value={filters.region}
          onValueChange={(val) => handleFilterChange("region", val)}
        >
          <SelectTrigger className="w-[165px] h-10 gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Region" />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" sideOffset={4}>
            {regions.map((reg) => (
              <SelectItem key={reg.value} value={reg.value}>
                {reg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Range Popover */}
        <Popover open={isPricePopoverOpen} onOpenChange={setIsPricePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`h-10 border justify-between px-3 font-normal gap-2 ${
                hasPriceFilter
                  ? "border-primary bg-primary/5 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2 line-clamp-1">
                <Banknote className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{getPriceButtonLabel()}</span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" sideOffset={4} align="start" className="w-80 p-4 space-y-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-sm leading-none">Price Range (₺)</h4>
              <p className="text-xs text-muted-foreground">Filter craftsmen by estimated rate</p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {pricePresets.map((preset, i) => {
                const isSelected =
                  filters.minPrice === preset.min && filters.maxPrice === preset.max;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePriceChange(preset.min, preset.max)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary font-medium"
                        : "bg-muted/40 hover:bg-muted text-foreground border-border/60"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label htmlFor="min-price-desktop" className="text-xs font-medium text-muted-foreground">Min (₺)</label>
                <Input
                  id="min-price-desktop"
                  type="number"
                  placeholder="e.g. 500"
                  value={filters.minPrice || ""}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="h-9 text-sm"
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="max-price-desktop" className="text-xs font-medium text-muted-foreground">Max (₺)</label>
                <Input
                  id="max-price-desktop"
                  type="number"
                  placeholder="e.g. 2500"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="h-9 text-sm"
                  min={0}
                />
              </div>
            </div>

            {hasPriceFilter && (
              <div className="flex justify-end pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePriceChange("", "")}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear Price
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Verification */}
        <Select
          value={filters.verification}
          onValueChange={(val) => handleFilterChange("verification", val)}
        >
          <SelectTrigger className="w-[165px] h-10 gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
              <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Verification" />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" sideOffset={4}>
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
          <SelectTrigger className="w-[195px] h-10 gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
              <ArrowUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" sideOffset={4}>
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
          <SheetContent side="bottom" className="h-[85vh] rounded-t-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-5">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  Category
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(val) => handleFilterChange("category", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={4}>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub-Service Mobile */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  Sub-Service
                </label>
                <Select
                  value={filters.subService}
                  onValueChange={(val) => handleFilterChange("subService", val)}
                  disabled={!filteredSubServices || filteredSubServices.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sub-Service" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={4}>
                    <SelectItem value="all">All Sub-Services</SelectItem>
                    {filteredSubServices.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>
                        {sub.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Mobile */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                  Price Range (₺)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="Min ₺"
                    value={filters.minPrice || ""}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="h-10"
                    min={0}
                  />
                  <Input
                    type="number"
                    placeholder="Max ₺"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="h-10"
                    min={0}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pricePresets.map((preset, i) => {
                    const isSelected =
                      filters.minPrice === preset.min && filters.maxPrice === preset.max;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePriceChange(preset.min, preset.max)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary font-medium"
                            : "bg-muted/40 hover:bg-muted text-foreground border-border/60"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Region */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Region
                </label>
                <Select
                  value={filters.region}
                  onValueChange={(val) => handleFilterChange("region", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={4}>
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
                <label className="text-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  Verification
                </label>
                <Select
                  value={filters.verification}
                  onValueChange={(val) => handleFilterChange("verification", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Verification" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={4}>
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
                <label className="text-sm font-medium flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  Sort by
                </label>
                <Select
                  value={filters.sort}
                  onValueChange={(val) => handleFilterChange("sort", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" sideOffset={4}>
                    {sortOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex gap-3 pb-4">
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
              .filter(([key, val]) => val !== "all" && key !== "sort" && val !== "")
              .map(([key, val]) => (key === "minPrice" ? `Min ₺${val}` : key === "maxPrice" ? `Max ₺${val}` : val))
              .join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}