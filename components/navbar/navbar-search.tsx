"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function NavbarSearch() {
  // TODO: Implement search functionality with debounced API call
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search craftsmen..."
        className="w-full bg-background pl-9 text-sm"
      />
    </div>
  );
}