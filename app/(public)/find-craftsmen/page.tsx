"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CraftsmenHero } from "@/components/craftsmen/craftsmen-hero";
import { CraftsmenSearch } from "@/components/craftsmen/craftsmen-search";
import { CraftsmenFilters } from "@/components/craftsmen/craftsmen-filters";
import { CraftsmenGrid } from "@/components/craftsmen/craftsmen-grid";
import { CraftsmenPagination } from "@/components/craftsmen/craftsmen-pagination";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
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

// ─── Page Component ──────────────────────────────────────────────────────
export default function CraftsmenPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user || null;

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

  const pageSize = 9;
  const requestIdRef = useRef(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollAfterPageChange = useRef(false);

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

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    shouldScrollAfterPageChange.current = true;
    setCurrentPage(page);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category: "all",
      subService: "all",
      region: "all",
      verification: "all",
      sort: "rating_desc",
    });
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

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
          <CraftsmenGrid
            craftsmen={state.items}
            loading={state.status === "loading"}
            onResetFilters={resetFilters}
            emptyState={{
              title: "No craftsmen found",
              description: "Try adjusting your search or filters.",
              buttonText: "Reset Filters",
            }}
          />
          <CraftsmenPagination
            currentPage={currentPage}
            totalPages={state.totalPages}
            onPageChange={handlePageChange}
            scrollToTop={false}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}