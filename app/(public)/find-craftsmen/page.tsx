"use client";

import { useMemo, useState } from "react";
import { Grid2X2, List, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ComparisonTray } from "@/components/craftsmen/comparison-tray";
import { CraftsmenFilters } from "@/components/craftsmen/craftsmen-filters";
import { CraftsmenGrid } from "@/components/craftsmen/craftsmen-grid";
import { CraftsmenHero } from "@/components/craftsmen/craftsmen-hero";
import { CraftsmenPagination } from "@/components/craftsmen/craftsmen-pagination";
import { RecentlyViewedCraftsmen } from "@/components/craftsmen/recently-viewed-craftsmen";
import { CraftsmenSearch } from "@/components/craftsmen/craftsmen-search";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { allCraftsmen, type Craftsman } from "@/lib/mock-craftsmen";

type DirectoryFilters = {
  category: string;
  subService: string;
  region: string;
  verification: string;
  sort: string;
};

type DirectoryState = {
  query: string;
  filters: DirectoryFilters;
  page: number;
  displayMode: "grid" | "list";
};

const defaultFilters: DirectoryFilters = {
  category: "all",
  subService: "all",
  region: "all",
  verification: "all",
  sort: "rating_desc",
};

const pageSize = 9;

function readInitialState(): DirectoryState {
  if (typeof window === "undefined") {
    return { query: "", filters: defaultFilters, page: 1, displayMode: "grid" };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") ?? "",
    filters: {
      category: params.get("category") ?? defaultFilters.category,
      subService: params.get("service") ?? defaultFilters.subService,
      region: params.get("region") ?? defaultFilters.region,
      verification: params.get("trust") ?? defaultFilters.verification,
      sort: params.get("sort") ?? defaultFilters.sort,
    },
    page: Math.max(1, Number(params.get("page")) || 1),
    displayMode: params.get("view") === "list" ? "list" : "grid",
  };
}

function persistDirectoryState(nextState: DirectoryState) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams();
  if (nextState.query) params.set("q", nextState.query);
  if (nextState.filters.category !== "all") params.set("category", nextState.filters.category);
  if (nextState.filters.subService !== "all") params.set("service", nextState.filters.subService);
  if (nextState.filters.region !== "all") params.set("region", nextState.filters.region);
  if (nextState.filters.verification !== "all") params.set("trust", nextState.filters.verification);
  if (nextState.filters.sort !== defaultFilters.sort) params.set("sort", nextState.filters.sort);
  if (nextState.page !== 1) params.set("page", String(nextState.page));
  if (nextState.displayMode !== "grid") params.set("view", nextState.displayMode);

  const queryString = params.toString();
  window.history.replaceState(null, "", queryString ? `/find-craftsmen?${queryString}` : "/find-craftsmen");
}

function getFilteredCraftsmen(query: string, filters: DirectoryFilters) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = allCraftsmen.filter((craftsman) => {
    const searchableText = [
      craftsman.name,
      craftsman.businessName,
      craftsman.category,
      craftsman.region,
      ...craftsman.subServices,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
      (filters.category === "all" || craftsman.category === filters.category) &&
      (filters.subService === "all" || craftsman.subServices.includes(filters.subService)) &&
      (filters.region === "all" || craftsman.region === filters.region) &&
      (filters.verification === "all" || craftsman.verificationLevel === filters.verification)
    );
  });

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "reviews_desc":
        return b.reviewCount - a.reviewCount;
      case "jobs_desc":
        return b.jobsCompleted - a.jobsCompleted;
      case "newest":
        return Number(b.id.split("-").at(-1)) - Number(a.id.split("-").at(-1));
      case "name_asc":
        return a.name.localeCompare(b.name);
      default:
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
    }
  });
}

export default function CraftsmenPage() {
  const { data: session, isPending } = useSession();
  const [directoryState, setDirectoryState] = useState(readInitialState);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

  const subServiceOptions = useMemo(() => {
    const seen = new Set<string>();
    return allCraftsmen.flatMap((craftsman) =>
      craftsman.subServices.flatMap((service) => {
        const key = `${craftsman.category}-${service}`;
        if (seen.has(key)) return [];
        seen.add(key);
        return [{ category: craftsman.category, value: service, label: service }];
      }),
    );
  }, []);

  const filteredCraftsmen = useMemo(
    () => getFilteredCraftsmen(directoryState.query, directoryState.filters),
    [directoryState.filters, directoryState.query],
  );
  const totalPages = Math.max(1, Math.ceil(filteredCraftsmen.length / pageSize));
  const currentPage = Math.min(directoryState.page, totalPages);
  const visibleCraftsmen = filteredCraftsmen.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const comparisonCraftsmen = allCraftsmen.filter((craftsman) => comparisonIds.includes(craftsman.id));
  const activeFilterCount = Object.entries(directoryState.filters).filter(
    ([key, value]) => key !== "sort" && value !== "all",
  ).length + (directoryState.query ? 1 : 0);
  const popularCategories = [...new Set(allCraftsmen.map((craftsman) => craftsman.category))].slice(0, 5);

  const updateDirectory = (nextState: DirectoryState) => {
    setDirectoryState(nextState);
    persistDirectoryState(nextState);
  };

  const resetFilters = () => {
    updateDirectory({ ...directoryState, query: "", filters: defaultFilters, page: 1 });
  };

  const updateFilters = (filters: DirectoryFilters) => {
    updateDirectory({ ...directoryState, filters, page: 1 });
  };

  const toggleComparison = (craftsmanId: string) => {
    if (comparisonIds.includes(craftsmanId)) {
      setComparisonIds((current) => current.filter((id) => id !== craftsmanId));
      return;
    }
    if (comparisonIds.length === 3) {
      toast.info("You can compare up to three craftsmen at a time.");
      return;
    }
    setComparisonIds((current) => [...current, craftsmanId]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-(image:--find-craftsmen-bg) bg-cover bg-center bg-fixed">
      <Navbar user={session?.user ?? null} isLoading={isPending} />
      <main id="main-content" className="container mx-auto flex-1 space-y-6 px-4 py-6">
        <CraftsmenHero totalCraftsmen={156} verifiedCraftsmen={89} completedJobs={2347} totalReviews={512} />
        <RecentlyViewedCraftsmen />

        <section aria-labelledby="directory-heading" className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/75 p-4 shadow-sm backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Sparkles className="size-4" />Start with a popular service</p>
              <h2 id="directory-heading" className="mt-1 text-lg font-semibold">Find the right professional faster</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularCategories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  size="sm"
                  variant={directoryState.filters.category === category ? "secondary" : "outline"}
                  onClick={() => updateFilters({ ...directoryState.filters, category, subService: "all" })}
                >
                  {category.replace(" & ", " / ")}
                </Button>
              ))}
            </div>
          </div>

          <CraftsmenSearch
            value={directoryState.query}
            onValueChange={(query) => updateDirectory({ ...directoryState, query, page: 1 })}
            placeholder="Search by trade, service, craftsman, or region"
          />
          <CraftsmenFilters filters={directoryState.filters} onFilterChange={updateFilters} subServiceOptions={subServiceOptions} />

          <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div aria-live="polite" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span><strong className="text-foreground">{filteredCraftsmen.length}</strong> craftsmen found</span>
              {activeFilterCount > 0 && <Badge variant="secondary">{activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}</Badge>}
              {activeFilterCount > 0 && <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={resetFilters}><RotateCcw className="size-3.5" />Clear</Button>}
            </div>
            <div className="flex items-center gap-1 self-start rounded-lg border bg-background p-1 sm:self-auto">
              <Button type="button" size="icon-sm" variant={directoryState.displayMode === "grid" ? "secondary" : "ghost"} aria-label="Use grid view" aria-pressed={directoryState.displayMode === "grid"} onClick={() => updateDirectory({ ...directoryState, displayMode: "grid" })}><Grid2X2 className="size-4" /></Button>
              <Button type="button" size="icon-sm" variant={directoryState.displayMode === "list" ? "secondary" : "ghost"} aria-label="Use list view" aria-pressed={directoryState.displayMode === "list"} onClick={() => updateDirectory({ ...directoryState, displayMode: "list" })}><List className="size-4" /></Button>
            </div>
          </div>

          <CraftsmenGrid
            craftsmen={visibleCraftsmen}
            onResetFilters={resetFilters}
            displayMode={directoryState.displayMode}
            comparisonIds={comparisonIds}
            onToggleComparison={toggleComparison}
            emptyState={{
              title: "No craftsmen found",
              description: "Try removing a filter or search for a broader service.",
              buttonText: "Clear filters",
            }}
          />
          {filteredCraftsmen.length > 0 && (
            <CraftsmenPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                updateDirectory({ ...directoryState, page });
                document.getElementById("directory-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              scrollToTop={false}
            />
          )}
        </section>
        <ComparisonTray
          craftsmen={comparisonCraftsmen as Craftsman[]}
          onRemove={toggleComparison}
          onClear={() => setComparisonIds([])}
        />
      </main>
      <Footer />
    </div>
  );
}
