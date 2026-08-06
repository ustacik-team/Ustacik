import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Briefcase,
  Star,
  ArrowRight,
  MapPin,
  Droplets,
  Zap,
  Hammer,
  PaintRoller,
  Fan,
  Smartphone,
} from "lucide-react";

// ─── Floating Stat Cards (Left side) ──────────────────────────────────
const floatingStats = [
  {
    icon: ShieldCheck,
    label: "Verified Craftsmen",
    value: "150+",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    delay: "0s",
    top: "top-4",
    right: "right-4",
  },
  {
    icon: Star,
    label: "4.9 Rating",
    value: "⭐ 4.9",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    delay: "0.15s",
    top: "top-20",
    left: "left-4",
  },
  {
    icon: Briefcase,
    label: "Jobs Completed",
    value: "152",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    delay: "0.3s",
    bottom: "bottom-4",
    right: "right-8",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kyrenia, TRNC",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    delay: "0.2s",
    bottom: "bottom-12",
    left: "left-6",
  },
];

// ─── Service Icons ──────────────────────────────────────────────────────
const serviceIcons = [
  { icon: Droplets, label: "Plumbing", color: "text-blue-400" },
  { icon: Zap, label: "Electrical", color: "text-yellow-400" },
  { icon: Hammer, label: "Carpentry", color: "text-amber-400" },
  { icon: PaintRoller, label: "Painting", color: "text-pink-400" },
  { icon: Fan, label: "HVAC", color: "text-cyan-400" },
  { icon: Smartphone, label: "Repair", color: "text-indigo-400" },
];

// ─── Hero Component ──────────────────────────────────────────────────────
export function Hero() {
  return (
     <section 
      className="
        relative 
        w-full 
        min-h-[800px] 
        flex 
        items-center 
        bg-(image:--hero-bg) 
        bg-cover 
        bg-left 
        lg:bg-right 
        bg-no-repeat 
        overflow-hidden
      "
    >
      {/* Background orbs - keep these as a subtle fallback */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      
      {/* Inner Container with Wide Padding (fixes the end-to-end issue) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">
          
          {/* ─── LEFT CONTENT ──────────────────────────────────────────── */}
          <div className="flex-1 space-y-6 text-center lg:text-left lg:max-w-[50%]">
            
            {/* Badge */}
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Northern Cyprus&apos;s Trusted Platform
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find Trusted Craftsmen Across{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Northern Cyprus
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl lg:text-2xl">
              Connect with verified craftsmen backed by reviews, verification,
              and transparent pricing – all without hidden fees or commissions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Button size="lg" asChild className="gap-2 group">
                <Link href="/find-craftsmen">
                  Find Craftsmen
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/become-craftsman">Become a Craftsman</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Verified profiles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span>Honest reviews</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span>No hidden fees</span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT SIDE (INTENTIONALLY EMPTY) ────────────────────── */}
          {/* This empty div occupies the remaining 50% width, ensuring 
              the background image's circular "pics" show perfectly. */}
          <div className="hidden lg:block lg:flex-1"></div>

        </div>
      </div>
    </section>
  );
}