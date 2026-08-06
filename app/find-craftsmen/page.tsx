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
  }
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
      c.subServices.includes(filters.subService)
    );
  }

  if (filters.region !== "all") {
    filtered = filtered.filter((c) => c.region === filters.region);
  }
  if (filters.verification !== "all") {
    filtered = filtered.filter((c) => c.verificationLevel === filters.verification);
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
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  return { items: paginatedItems, totalPages, totalItems };
}

// ─── Page Component ──────────────────────────────────────────────────────
export default function CraftsmenPage() {
  const { data: session, isPending } = useSession(); 
  const user = session?.user || null;

  const [searchQuery, setSearchQuery] = useState("");
  
  // ✅ FIX: Use a lazy initializer to read URL params and avoid cascading renders
  const defaultFilters = {
    category: "all",
    subService: "all", 
    region: "all",
    verification: "all",
    sort: "rating_desc",
  };

  const [filters, setFilters] = useState(() => {
    if (typeof window === 'undefined') return defaultFilters;

    const params = new URLSearchParams(window.location.search);
    const updates: Partial<typeof defaultFilters> = {};

    const category = params.get('category');
    const region = params.get('region');
    const verification = params.get('verification');
    const subService = params.get('subService');

    if (category) updates.category = category;
    if (region) updates.region = region;
    if (verification) updates.verification = verification;
    if (subService) updates.subService = subService;

    return { ...defaultFilters, ...updates };
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [craftsmenData, setCraftsmenData] = useState<{
    items: Craftsman[];
    totalPages: number;
    totalItems: number;
  }>({
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
    const allSubs = allCraftsmen.flatMap((c) => c.subServices);
    const uniqueSubs = Array.from(new Set(allSubs));
    return uniqueSubs.map((sub) => ({ value: sub, label: sub }));
  }, []);

  // ─── Fetch with request ID ────────────────────────────────────────────
  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;

    const fetchData = () => {
      setIsLoading(true);

      setTimeout(() => {
        if (currentRequestId !== requestIdRef.current) return;

        const result = getFilteredCraftsmen(currentPage, pageSize, searchQuery, filters);
        setCraftsmenData(result);
        setIsLoading(false);
      }, 600);
    };

    fetchData();
  }, [currentPage, searchQuery, filters]);

  // ─── Scroll to Search/Filters ONLY on pagination actions ──────────────
  useEffect(() => {
    if (isLoading || !shouldScrollAfterPageChange.current) {
      return; 
    }

    shouldScrollAfterPageChange.current = false;

    if (craftsmenData.items.length > 0) {
      setTimeout(() => {
        searchContainerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [currentPage, isLoading, craftsmenData.items.length]);

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
            craftsmen={craftsmenData.items}
            loading={isLoading}
            onResetFilters={resetFilters}
            emptyState={{
              title: "No craftsmen found",
              description: "Try adjusting your search or filters.",
              buttonText: "Reset Filters",
            }}
          />

          <CraftsmenPagination
            currentPage={currentPage}
            totalPages={craftsmenData.totalPages}
            onPageChange={handlePageChange}
            scrollToTop={false}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}