// app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/30 px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon / Illustration */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-card border border-border/60 rounded-full p-6 shadow-xl">
              <SearchX className="h-16 w-16 text-primary/80" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Error Text */}
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground/90">
            Page not found
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-border/70 hover:border-primary/40"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            size="lg"
            className="gap-2 shadow-lg shadow-primary/20"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Optional subtle footer */}
        <p className="text-xs text-muted-foreground/60 pt-6">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}