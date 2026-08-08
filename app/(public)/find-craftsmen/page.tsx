"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CraftsmenHero } from "@/components/craftsmen/craftsmen-hero";
import { CraftsmenSearch } from "@/components/craftsmen/craftsmen-search";
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

// ─── Types ──────────────────────────────────────────────────────────────
interface CraftsmanResponse {
  id: string;
  name: string;
  businessName: string | null;
  image: string | null;
  verificationLevel: string;
  averageRating: number | null;
  reviewCount: number;
  category: string;
  region: string;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  totalJobsCompleted: number;
  mainPhoto: string | null;
  subServices: string[];
}

// Shape expected by CraftsmanCard
interface CraftsmanCardData {
  id: string;
  name: string;
  businessName: string;
  image: string | null;
  verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  rating: number;
  reviewCount: number;
  category: string;
  subServices: string[];
  region: string;
  priceMin: number;
  priceMax: number;
  jobsCompleted: number;
}

interface SubServiceOption {
  category: string;
  value: string;
  label: string;
}

function persistDirectoryState(nextState: DirectoryState) {
  if (typeof window === "undefined") return;

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    subService: "all",
    region: "all",
    verification: "all",
    sort: "rating_desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [state, setState] = useState<{
    status: "idle" | "loading" | "success";
    items: CraftsmanCardData[];
    totalPages: number;
    totalItems: number;
  }>({
    status: "idle",
    items: [],
    totalPages: 1,
    totalItems: 0,
  });
  const [heroStats, setHeroStats] = useState({
    totalCraftsmen: 0,
    verifiedCraftsmen: 0,
    completedJobs: 0,
    totalReviews: 0,
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [subServiceOptions, setSubServiceOptions] = useState<SubServiceOption[]>([]);

export default function CraftsmenPage() {
  const { data: session, isPending } = useSession();
  const [directoryState, setDirectoryState] = useState(readInitialState);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);

  // ─── Fetch hero stats once ───────────────────────────────────────────
  useEffect(() => {
    async function fetchHeroStats() {
      try {
        const res = await fetch("/api/craftsmen/stats");
        const json = await res.json();
        if (res.ok && json.success) {
          setHeroStats(json.data);
        }
      } catch {
        // fallback
      } finally {
        setIsStatsLoading(false);
      }
    }
    fetchHeroStats();
  }, []);

  // ─── Fetch sub-service options once ──────────────────────────────────
  useEffect(() => {
    async function fetchSubServices() {
      try {
        const res = await fetch("/api/sub-services");
        const json = await res.json();
        if (res.ok) {
          setSubServiceOptions(json.data);
        }
      } catch {
        // fallback to empty
      }
    }
    fetchSubServices();
  }, []);

  // ─── Fetch craftsmen from API ─────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const currentRequestId = ++requestIdRef.current;

    queueMicrotask(() => {
      if (isMounted) {
        setState((prev) => ({ ...prev, status: "loading", items: [] }));
      }
    });

    const fetchData = async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(pageSize),
        search: searchQuery,
        category: filters.category,
        region: filters.region,
        verification: filters.verification,
        sort: filters.sort,
        subService: filters.subService, // ✅ ADDED THIS LINE
      });

      try {
        const res = await fetch(`/api/craftsmen?${params.toString()}`);
        const json = await res.json();

        if (!isMounted || currentRequestId !== requestIdRef.current) return;

        if (!res.ok) {
          setState({
            status: "success",
            items: [],
            totalPages: 1,
            totalItems: 0,
          });
          return;
        }

        // Map API response to CraftsmanCardData
        const mappedItems: CraftsmanCardData[] = json.data.map((item: CraftsmanResponse) => ({
          id: item.id,
          name: item.name,
          businessName: item.businessName ?? "",
          image: item.image,
          verificationLevel: item.verificationLevel as "REGISTERED" | "VERIFIED" | "APPROVED",
          rating: item.averageRating ?? 0,
          reviewCount: item.reviewCount,
          category: item.category,
          subServices: item.subServices,
          region: item.region,
          priceMin: item.priceRangeMin ?? 0,
          priceMax: item.priceRangeMax ?? 0,
          jobsCompleted: item.totalJobsCompleted,
        }));

        setState({
          status: "success",
          items: mappedItems,
          totalPages: json.pagination.totalPages,
          totalItems: json.pagination.total,
        });
      } catch {
        if (!isMounted || currentRequestId !== requestIdRef.current) return;
        setState({
          status: "success",
          items: [],
          totalPages: 1,
          totalItems: 0,
        });
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchQuery, filters]);

  // ─── Scroll to Search/Filters ONLY on pagination actions ──────────────
  useEffect(() => {
    if (state.status === "loading" || !shouldScrollAfterPageChange.current) {
      return;
    }

    shouldScrollAfterPageChange.current = false;

    if (state.items.length > 0) {
      setTimeout(() => {
        searchContainerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [currentPage, state.status, state.items.length]);

  // ─── Handlers ──────────────────────────────────────────────────────────
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

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

  return (
    <div className="flex min-h-screen flex-col bg-(image:--find-craftsmen-bg) bg-cover bg-center bg-no-repeat bg-fixed">
      <Navbar user={user} isLoading={isPending} />
      <div className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <CraftsmenHero {...heroStats} loading={isStatsLoading} />
        <div className="space-y-4" ref={searchContainerRef}>
          <CraftsmenSearch onSearch={handleSearch} />
          <CraftsmenFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            subServiceOptions={subServiceOptions}
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
