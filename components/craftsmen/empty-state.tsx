// components/craftsmen/empty-state.tsx
"use client";

import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmptyStateProps {
  onResetFilters?: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

export function EmptyState({
  onResetFilters,
  title = "No craftsmen found",
  description = "Try adjusting your search or filters.",
  buttonText = "Reset Filters",
}: EmptyStateProps) {
  return (
    <Card className="border-dashed border-2 bg-muted/20 shadow-none">
      <CardHeader className="items-center text-center">
        <div className="rounded-full bg-muted/50 p-4 mb-2">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-base max-w-md mx-auto">
          {description}
        </CardDescription>
      </CardHeader>
      {onResetFilters && (
        <CardFooter className="flex justify-center pb-6">
          <Button variant="outline" onClick={onResetFilters} className="px-6">
            {buttonText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
