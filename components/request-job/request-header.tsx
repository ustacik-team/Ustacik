import Link from "next/link";
import { ArrowLeft, ChevronRight, ClipboardPlus, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

interface RequestHeaderProps {
  craftsmanId: string;
  craftsmanName: string;
  category: string;
}

export function RequestHeader({ craftsmanId, craftsmanName, category }: RequestHeaderProps) {
  return (
    <header className="space-y-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary">
          <Home className="size-3.5" /> Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/find-craftsmen" className="transition-colors hover:text-primary">Craftsmen</Link>
        <ChevronRight className="size-3.5" />
        <Link href={`/craftsmen/${craftsmanId}`} className="max-w-40 truncate transition-colors hover:text-primary">{craftsmanName}</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">Request a job</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Button variant="outline" size="icon" asChild className="shrink-0 self-start rounded-full" aria-label={`Back to ${craftsmanName}'s profile`}>
          <Link href={`/craftsmen/${craftsmanId}`}><ArrowLeft /></Link>
        </Button>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <ClipboardPlus className="size-5" />
            <span className="text-sm font-semibold">A direct request to a trusted professional</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Request a job</h1>
          <p className="max-w-2xl text-muted-foreground">Share the essentials with {craftsmanName}. Clear details and photos help them prepare an accurate response.</p>
          <p className="text-xs font-medium text-muted-foreground">Service category: <span className="text-foreground">{category}</span></p>
        </div>
      </div>
    </header>
  );
}
