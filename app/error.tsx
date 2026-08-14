"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/30 px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/10 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-card border border-destructive/30 rounded-full p-6 shadow-xl">
              <AlertTriangle className="h-16 w-16 text-destructive" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Something went wrong!
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm">
            An unforeseen application error occurred. We have logged the issue and are working to resolve it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 border-border/70 hover:border-primary/40"
            onClick={() => reset()}
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
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
      </div>
    </div>
  );
}
