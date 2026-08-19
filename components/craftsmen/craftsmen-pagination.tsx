// components/craftsmen/craftsmen-pagination.tsx
"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface CraftsmenPaginationProps {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when a page is clicked */
  onPageChange: (page: number) => void;
  /** Optional className for additional styling */
  className?: string;
  /** Whether to scroll to top when page changes (default: true) */
  scrollToTop?: boolean;
}

export function CraftsmenPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  scrollToTop = true,
}: CraftsmenPaginationProps) {
  // Don't render pagination if there's only one page or less
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      // Add ellipsis if there's a gap after page 1
      if (start > 2) {
        pages.push("ellipsis");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if there's a gap before the last page
      if (end < totalPages - 1) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Pagination className={cn("mt-8", className)}>
      <PaginationContent className="flex-wrap gap-1">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            aria-disabled={currentPage === 1}
            className={cn(
              currentPage === 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
                isActive={page === currentPage}
                className={cn(
                  "min-w-9 h-9",
                  page === currentPage && "cursor-default"
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            aria-disabled={currentPage === totalPages}
            className={cn(
              currentPage === totalPages && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}