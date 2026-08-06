"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { CraftsmenHero } from "@/components/craftsmen/craftsmen-hero";
import { CraftsmenSearch } from "@/components/craftsmen/craftsmen-search";
import { CraftsmenFilters } from "@/components/craftsmen/craftsmen-filters";
import { CraftsmenGrid } from "@/components/craftsmen/craftsmen-grid";
import { CraftsmenPagination } from "@/components/craftsmen/craftsmen-pagination";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { useSession } from "@/lib/auth-client";
import { allCraftsmen, Craftsman } from "@/lib/mock-craftsmen";

// ─── Helper ───────────────────────────────────────────────────────────────
function getFilteredCraftsmen(
  page: number,
  pageSize: number,
  searchQuery: string,
  filters: {
    category: string;
    subService: string;
    region: string;
    verification: string;
    sort: string;
  },
) {
  let filtered = allCraftsmen.filter((c) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(searchLower) ||
      c.businessName.toLowerCase().includes(searchLower) ||
      c.subServices.some((sub) => sub.toLowerCase().includes(searchLower))
    );
  });

  if (filters.category !== "all") {
    filtered = filtered.filter((c) => c.category === filters.category);
  }
  if (filters.subService !== "all") {
    filtered = filtered.filter((c) =>
      c.subServices.includes(filters.subService),
    );
  }
  if (filters.region !== "all") {
    filtered = filtered.filter((c) => c.region === filters.region);
  }
  if (filters.verification !== "all") {
    filtered = filtered.filter(
      (c) => c.verificationLevel === filters.verification,
    );
  }

  switch (filters.sort) {
    case "rating_desc":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "reviews_desc":
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "jobs_desc":
      filtered.sort((a, b) => b.jobsCompleted - a.jobsCompleted);
      break;
    case "newest":
      filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      break;
    case "name_asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  return { items: paginatedItems, totalPages, totalItems };
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
    items: Craftsman[];
    totalPages: number;
    totalItems: number;
  }>({
    status: "idle",
    items: [],
    totalPages: 1,
    totalItems: 0,
  });

  const pageSize = 9;
  const requestIdRef = useRef(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollAfterPageChange = useRef(false);

  // ✅ Derive unique sub-service options from mock data
  const subServiceOptions = useMemo(() => {
    const options = allCraftsmen.flatMap((c) =>
      c.subServices.map((sub) => ({
        category: c.category,
        value: sub,
        label: sub,
      })),
    );
    const unique = new Set();
    return options.filter((opt) => {
      const key = `${opt.category}-${opt.value}`;
      if (unique.has(key)) return false;
      unique.add(key);
      return true;
    });
  }, []);

  // ─── Fetch with request ID ────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const currentRequestId = ++requestIdRef.current;

    // ✅ FIX: Schedule loading state in a microtask to avoid React's "synchronous setState" warning
    queueMicrotask(() => {
      if (isMounted) {
        setState((prev) => ({ ...prev, status: "loading", items: [] }));
      }
    });

    const timer = setTimeout(() => {
      if (!isMounted || currentRequestId !== requestIdRef.current) return;

      const result = getFilteredCraftsmen(
        currentPage,
        pageSize,
        searchQuery,
        filters,
      );

      setState({
        status: "success",
        items: result.items,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
      });
    }, 600);

    return () => {
      isMounted = false;
      clearTimeout(timer);
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

  const heroStats = {
    totalCraftsmen: 156,
    verifiedCraftsmen: 89,
    completedJobs: 2347,
    totalReviews: 512,
  };

  return (
    <div className="flex min-h-screen flex-col bg-(image:--find-craftsmen-bg) bg-cover bg-center bg-no-repeat bg-fixed">
      <Navbar user={user} isLoading={isPending} />
      <div className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <CraftsmenHero {...heroStats} />
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