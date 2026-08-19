import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-y border-border/10 bg-[image:var(--cta-bg)] bg-cover bg-center bg-no-repeat">
      
      {/* ——— Main Content ——— */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-28 text-center">
        
        {/* ✅ FIX: Glassmorphism card wrapper for perfect contrast on any background */}
        <div className="mx-auto max-w-4xl rounded-2xl bg-black/50 backdrop-blur-md p-8 md:p-12 shadow-2xl border border-white/5">
          
          {/* Headline */}
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-lg">
            Ready to Find a <span className="text-primary">Trusted Craftsman</span>?
          </h2>

          {/* Supporting Text */}
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80 sm:text-xl drop-shadow">
            Join thousands of homeowners and professionals on Ustacik. 
            Get the job done right, with zero hidden fees.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="gap-2 group bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              <Link href="/find-craftsmen">
                Find Craftsmen
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              asChild 
              className="bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700"
            >
              <Link href="/become-craftsman">
                Become a Craftsman
              </Link>
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}