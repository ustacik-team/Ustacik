import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Search, 
  Handshake, 
  Star,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: 1,
    icon: Search,
    title: "Find a Craftsman",
    description: "Browse verified professionals across Northern Cyprus. Filter by trade, reviews, and location to find your perfect match.",
  },
  {
    step: 2,
    icon: Handshake,
    title: "Request a Job",
    description: "Send a job request with your specific requirements. Get transparent quotes from trusted professionals with no hidden fees.",
  },
  {
    step: 3,
    icon: Star,
    title: "Leave a Review",
    description: "Once the job is complete, leave an honest review. Your feedback helps us maintain a high-quality community of verified craftsmen.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-16 bg-transparent">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Getting your project done is as easy as one, two, three. 
            Connect with trusted professionals in minutes.
          </p>
        </div>

        {/* Responsive Grid: 3 Cols Desktop, 1 Col Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Optional: Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-[4.5rem] left-1/4 right-1/4 h-[2px] bg-muted-foreground/20 -z-10" />

          {steps.map((item) => (
            <Card 
              key={item.step} 
              className="relative border-none bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-visible"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm border-2 border-background z-10">
                {item.step}
              </div>

              <CardHeader className="pt-8 pb-2 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              </CardHeader>
              
              <CardContent className="text-center pb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button to get started */}
        <div className="mt-12 flex justify-center">
          <Button size="lg" asChild className="gap-2 group">
            <Link href="/find-craftsmen">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}