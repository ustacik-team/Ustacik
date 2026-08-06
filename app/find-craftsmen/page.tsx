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

// ─── Types ─────────────────────────────────────────────────────────────────
interface Craftsman {
  id: string;
  name: string;
  businessName: string;
  image: string | null;
  verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  rating: number;
  reviewCount: number;
  category: string;
  region: string;
  priceMin: number;
  priceMax: number;
  jobsCompleted: number;
}

// ─── 20 Dummy Craftsmen ──────────────────────────────────────────────────
const allCraftsmen: Craftsman[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    businessName: "Yılmaz Plumbing",
    image: null,
    verificationLevel: "APPROVED" as const,
    rating: 4.9,
    reviewCount: 18,
    category: "Plumbing & Water Systems",
    region: "Nicosia",
    priceMin: 150,
    priceMax: 450,
    jobsCompleted: 47,
  },
  {
    id: "2",
    name: "Mehmet Demir",
    businessName: "Demir Electrical",
    image: null,
    verificationLevel: "VERIFIED" as const,
    rating: 4.8,
    reviewCount: 22,
    category: "Electrical",
    region: "Kyrenia",
    priceMin: 200,
    priceMax: 600,
    jobsCompleted: 38,
  },
  {
    id: "3",
    name: "Ayşe Kaya",
    businessName: "Kaya Painting & Decor",
    image: null,
    verificationLevel: "REGISTERED" as const,
    rating: 4.7,
    reviewCount: 9,
    category: "Painting & Plastering",
    region: "Famagusta",
    priceMin: 100,
    priceMax: 350,
    jobsCompleted: 24,
  },
  {
    id: "4",
    name: "Mustafa Çelik",
    businessName: "Çelik Woodworks",
    image: null,
    verificationLevel: "VERIFIED" as const,
    rating: 4.9,
    reviewCount: 15,
    category: "Carpentry & Furniture",
    region: "Larnaca",
    priceMin: 300,
    priceMax: 1200,
    jobsCompleted: 32,
  },
  {
    id: "5",
    name: "Zeynep Öztürk",
    businessName: "Öztürk Garden & Pool",
    image: null,
    verificationLevel: "REGISTERED" as const,
    rating: 4.6,
    reviewCount: 7,
    category: "Garden & Pool Maintenance",
    region: "Morphou",
    priceMin: 180,
    priceMax: 500,
    jobsCompleted: 19,
  },
  {
    id: "6",
    name: "Ali Can",
    businessName: "Can Heating & Cooling",
    image: null,
    verificationLevel: "VERIFIED" as const,
    rating: 4.7,
    reviewCount: 12,
    category: "HVAC & Refrigeration",
    region: "Nicosia",
    priceMin: 250,
    priceMax: 800,
    jobsCompleted: 28,
  },
  {
    id: "7",
    name: "Elif Yıldız",
    businessName: "Yıldız Electronics Repair",
    image: null,
    verificationLevel: "REGISTERED" as const,
    rating: 4.5,
    reviewCount: 5,
    category: "Appliance & Electronics Repair",
    region: "Kyrenia",
    priceMin: 80,
    priceMax: 250,
    jobsCompleted: 15,
  },
  {
    id: "8",
    name: "Hasan Eminağa",
    businessName: "Eminağa Furniture",
    image: null,
    verificationLevel: "APPROVED" as const,
    rating: 4.8,
    reviewCount: 21,
    category: "Carpentry & Furniture",
    region: "Famagusta",
    priceMin: 400,
    priceMax: 1500,
    jobsCompleted: 44,
  },
  {
    id: "9",
    name: "Fatma Şahin",
    businessName: "Şahin Glass & Aluminium",
    image: null,
    verificationLevel: "REGISTERED" as const,
    rating: 4.4,
    reviewCount: 4,
    category: "Aluminium, PVC & Glass",
    region: "Larnaca",
    priceMin: 150,
    priceMax: 450,
    jobsCompleted: 11,
  },
  {
    id: "10",
    name: "Kemal Aydın",
    businessName: "Aydın Painting",
    image: null,
    verificationLevel: "VERIFIED" as const,
    rating: 4.6,
    reviewCount: 13,
    category: "Painting & Plastering",
    region: "Morphou",
    priceMin: 120,
    priceMax: 380,
    jobsCompleted: 29,
  },
  {
    id: "11",
    name: "Hatice Yılmaz",
    businessName: "Yılmaz Electric",
    image: null,
    verificationLevel: "REGISTERED" as const,
    rating: 4.3,
    reviewCount: 6,
    category: "Electrical",
    region: "Nicosia",
    priceMin: 180,
    priceMax: 550,
    jobsCompleted: 16,
  },
  {
    id: "12",
    name: "Serkan Kaya",
    businessName: "Kaya Plumbing",
    image: null,
    verificationLevel: "VERIFIED" as const,
    rating: 4.7,
    reviewCount: 10,
    category: "Plumbing & Water Systems",
    region: "Kyrenia",
    priceMin: 140,
    priceMax: 420,
    jobsCompleted: 22,
  },
  {
    id: "13",
    name: "Merve Demir",
    businessName: "Demir Climate",
    image: null,
    verificationLevel: "REGISTERED" as const,
    rating: 4.5,
    reviewCount: 8,
    category: "HVAC & Refrigeration",
    region: "Famagusta",
    priceMin: 220,
    priceMax: 700,
    jobsCompleted: 18,
  },
  {
    id: "14",
    name: "Okan Çelik",
    businessName: "Çelik Outdoor Services",
    image: null,
    verificationLevel: "VERIFIED" as const,
    rating: 4.6,
    reviewCount: 11,
    category: "Garden & Pool Maintenance",
    region: "Larnaca",
    priceMin: 160,
    priceMax: 480,
    jobsCompleted: 25,
  },
  {
    id: "15",
    name: "Seda Öztürk",
    businessName: "Öztürk Glass",
    image: null,
    verificationLevel: "REGISTERED" as const,
    rating: 4.2,
    reviewCount: 3,
    category: "Aluminium, PVC & Glass",
    region: "Morphou",
    priceMin: 130,
    priceMax: 400,
    jobsCompleted: 9,
  },
  {
    id: "16",
    name: "Emre Can",
    businessName: "Can Custom Wood",
    image: null,
    verificationLevel: "APPROVED" as const,
    rating: 4.9,
    reviewCount: 17,
    category: "Carpentry & Furniture",
    region: "Nicosia",
    priceMin: 350,
    priceMax: 1800,
    jobsCompleted: 41,
  },
  {
    id: "17",
    name: "Simge Yıldız",
    businessName: "Yıldız Plastering",
    image: null,
    verificationLevel: "VERIFIED" as const,
    rating: 4.5,
    reviewCount: 9,
    category: "Painting & Plastering",
    region: "Kyrenia",
    priceMin: 110,
    priceMax: 320,
    jobsCompleted: 20,
  },
  {
    id: "18",
    name: "Burak Eminağa",
    businessName: "Eminağa Electric",
    image: null,
    verificationLevel: "REGISTERED" as const,
    rating: 4.4,
    reviewCount: 5,
    category: "Electrical",
    region: "Famagusta",
    priceMin: 190,
    priceMax: 580,
    jobsCompleted: 14,
  },
  {
    id: "19",
    name: "Cansu Şahin",
    businessName: "Şahin Appliance Repair",
    image: null,
    verificationLevel: "VERIFIED" as const,
    rating: 4.7,
    reviewCount: 14,
    category: "Appliance & Electronics Repair",
    region: "Larnaca",
    priceMin: 90,
    priceMax: 280,
    jobsCompleted: 27,
  },
  {
    id: "20",
    name: "Murat Aydın",
    businessName: "Aydın Water Systems",
    image: null,
    verificationLevel: "REGISTERED" as const,
    rating: 4.3,
    reviewCount: 6,
    category: "Plumbing & Water Systems",
    region: "Morphou",
    priceMin: 160,
    priceMax: 480,
    jobsCompleted: 13,
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────
function getFilteredCraftsmen(
  page: number,
  pageSize: number,
  searchQuery: string,
  filters: {
    category: string;
    region: string;
    verification: string;
    sort: string;
  }
) {
  let filtered = allCraftsmen.filter((c) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(searchLower) ||
      c.businessName.toLowerCase().includes(searchLower)
    );
  });

  if (filters.category !== "all") {
    filtered = filtered.filter((c) => c.category === filters.category);
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
  const [filters, setFilters] = useState({
    category: "all",
    region: "all",
    verification: "all",
    sort: "rating_desc",
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
  const isFirstRender = useRef(true); // ✅ Prevents scroll on initial load
  const searchContainerRef = useRef<HTMLDivElement>(null); // ✅ Scroll target

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

  // ─── Scroll to Search/Filters when pagination changes ─────────────────
  useEffect(() => {
    // 1. Prevent scrolling on initial page load/refresh
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; 
    }

    // 2. Scroll to the search bar container when navigating pages
    if (!isLoading && craftsmenData.items.length > 0) {
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
    setCurrentPage(page);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category: "all",
      region: "all",
      verification: "all",
      sort: "rating_desc",
    });
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  // ─── Hero Stats ──────────────────────────────────────────────────────
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

        {/* ✅ Attach ref to the Search/Filters wrapper (cleaned up JSX) */}
        <div className="space-y-4" ref={searchContainerRef}>
          <CraftsmenSearch onSearch={handleSearch} />
          <CraftsmenFilters filters={filters} onFilterChange={handleFilterChange} />

          {/* ✅ NO ref here anymore! gridContainerRef is completely removed */}
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