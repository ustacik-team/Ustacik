"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerificationBadge } from "@/components/craftsmen/verification-badge";
import { Star, Phone, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
export interface ContactCardProps {
  craftsmanId: string;
  name: string;
  verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  phone?: string | null;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────
export function ContactCard({
  craftsmanId,
  name,
  verificationLevel,
  rating,
  reviewCount,
  jobsCompleted,
  phone,
  className,
}: ContactCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleRequestJob = (e: React.MouseEvent) => {
    if (!session?.user) {
      e.preventDefault();
      toast.info("Please sign in to request a job with this craftsman.", {
        duration: 3500,
      });
      router.push(`/sign-in?redirect=${encodeURIComponent(`/craftsmen/${craftsmanId}`)}`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <>
      {/* ─── DESKTOP STICKY CARD ────────────────────────────────────── */}
      <Card
        className={cn(
          "hidden md:block sticky top-24 z-10 border-border/40 bg-card/90 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl",
          className
        )}
      >
        <CardHeader className="pb-3 border-b border-border/20">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm">Contact {name}</h3>
            <VerificationBadge level={verificationLevel} />
          </div>
        </CardHeader>

        {/* 👇 Standardized padding (pt-4 pb-0) exactly matching Services */}
        <CardContent className="pt-4 pb-0">
          {/* Trust Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">
                {rating.toFixed(1)} <span className="text-muted-foreground text-xs">({reviewCount})</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs font-medium">{jobsCompleted} jobs</span>
            </div>
          </div>
        </CardContent>

        {/* 👇 Added pt-4 to give breathing room from the stats above */}
        <CardFooter className="flex flex-col gap-2 pt-4 pb-4">
          <Button asChild className="w-full gap-2" disabled={isLoading}>
            <Link href={`/craftsmen/${craftsmanId}/request`} onClick={handleRequestJob}>
              Request a Job
            </Link>
          </Button>
          {phone && (
            <Button variant="outline" className="w-full gap-2" asChild>
              <a href={`tel:${phone}`}>
                <Phone className="h-4 w-4" />
                Call Craftsman
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* ─── MOBILE FIXED BOTTOM CTA ────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 p-3 shadow-lg">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {/* Quick stats */}
          <div className="flex flex-col items-end shrink-0 mr-1">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-medium">{rating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{jobsCompleted} jobs</span>
          </div>

          <Button asChild className="flex-1 gap-1.5" disabled={isLoading}>
            <Link href={`/craftsmen/${craftsmanId}/request`} onClick={handleRequestJob}>
              Request Job
            </Link>
          </Button>
          {phone && (
            <Button variant="outline" size="icon" className="shrink-0 h-10 w-10" asChild>
              <a href={`tel:${phone}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}