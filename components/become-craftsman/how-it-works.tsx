import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Submit Application",
    description: "Fill out our detailed application form with your personal information, business details, and portfolio samples.",
  },
  {
    title: "Manual Verification",
    description: "Our dedicated trust team manually reviews your ID, references, and past work photos to ensure authenticity.",
  },
  {
    title: "Badge Assigned",
    description: "Upon successful verification, your profile is assigned a trust badge (Registered, Verified, or Approved).",
  },
  {
    title: "Receive Job Requests",
    description: "Your profile goes live on the platform. Start receiving job requests from customers in your area.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How Verification Works
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Our straightforward four-step process ensures trust and transparency for craftsmen and customers alike.
          </p>
        </div>

        {/* ─── TIMELINE ────────────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl relative">
          
          {/* Vertical Connecting Line (subtle accent) */}
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-border/50 hidden sm:block" />

          <div className="flex flex-col gap-8 sm:gap-10">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
                
                {/* Step Number Badge */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-base border-4 border-background shadow-sm">
                  {index + 1}
                </div>

                {/* Card Content */}
                <Card className="flex-1 border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <CardHeader className="pb-2 pt-5">
                    <CardTitle className="text-lg font-semibold">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}