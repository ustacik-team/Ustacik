"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileCtaProps {
  craftsmanId: string;
  phone?: string | null;
  className?: string;
}

export function MobileCta({ craftsmanId, phone, className }: MobileCtaProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 p-3 shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        {/* Request Job - Primary Action */}
        <Button asChild className="flex-1 gap-2">
          <Link href={`/craftsmen/${craftsmanId}/request`}>Request Job</Link>
        </Button>

        {/* Call Craftsman - Secondary Action (Conditional) */}
        {phone && (
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10" asChild>
            <a href={`tel:${phone}`}>
              <Phone className="h-4 w-4" />
              <span className="sr-only">Call Craftsman</span>
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}