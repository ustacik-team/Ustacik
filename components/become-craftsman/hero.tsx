import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-transparent py-16 lg:py-24">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* ─── LEFT: TEXT & CTAs ────────────────────────────────────── */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20">
                🚀 Launching in Northern Cyprus
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                Join Northern Cyprus&apos; Most Trusted <span className="text-primary">Craftsman Platform</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Grow your business by connecting with customers actively looking for trusted professionals in your area.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" asChild className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                <Link href="#application-form">
                  Apply Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="#verification-levels">
                  Learn About Verification
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-muted-foreground border-t border-border/20 pt-6 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Manual verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Free to join</span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: GLASSMORPHISM FLOATING CARDS ──────────────────── */}
          <div className="relative h-[400px] lg:h-[500px] w-full max-w-md mx-auto lg:max-w-full lg:mx-0">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl opacity-50" />
            
            {/* Card 1: New Job Request (Top Right) */}
            <Card className="absolute top-4 right-0 lg:right-4 w-64 lg:w-72 border-border/40 bg-card/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-lg">New Job Request</p>
                  <p className="text-sm text-muted-foreground">Instant notification</p>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Verified Badge (Middle Left) */}
            <Card className="absolute top-1/2 left-0 lg:left-4 -translate-y-1/2 w-64 lg:w-72 border-border/40 bg-card/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-lg">Verified Badge</p>
                  <p className="text-sm text-muted-foreground">Trusted by customers</p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: 5-Star Reviews (Bottom Right) */}
            <Card className="absolute bottom-4 right-0 lg:right-4 w-64 lg:w-72 border-border/40 bg-card/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Star className="h-6 w-6 fill-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-lg">5-Star Reviews</p>
                  <p className="text-sm text-muted-foreground">Build your reputation</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}