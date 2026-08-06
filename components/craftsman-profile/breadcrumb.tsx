import Link from "next/link";
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  /** Name of the category (e.g., "Plumbing & Water Systems") */
  categoryName: string;
  /** Name of the craftsman (e.g., "Ahmet Yılmaz") */
  craftsmanName: string;
  /** Optional additional class names */
  className?: string;
}

export function Breadcrumb({ categoryName, craftsmanName, className }: BreadcrumbProps) {
  return (
    <ShadcnBreadcrumb className={cn("py-4", className)}>
      <BreadcrumbList>
        {/* Home */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* Find Craftsmen */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/find-craftsmen">Find Craftsmen</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* Category (linked to filtered search) */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/find-craftsmen?category=${encodeURIComponent(categoryName)}`}>
              {categoryName}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {/* Craftsman Name (current page) */}
        <BreadcrumbItem>
          <BreadcrumbPage>{craftsmanName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}