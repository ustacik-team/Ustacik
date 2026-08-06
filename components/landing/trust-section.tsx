import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardCheck, 
  ShieldCheck, 
  Award 
} from "lucide-react";

// ✅ Added "as const" to infer literal types instead of generic strings
const verificationLevels = [
  {
    title: "Registered",
    badgeLabel: "Registered",
    badgeVariant: "secondary", 
    icon: ClipboardCheck,
    description: "The craftsman has created a profile and submitted their initial identification documents for review.",
  },
  {
    title: "Verified",
    badgeLabel: "Verified",
    badgeColor: "bg-blue-500/15 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800",
    icon: ShieldCheck,
    description: "Identity, trade certifications, and professional references have been validated by our trust team.",
  },
  {
    title: "Approved",
    badgeLabel: "Approved",
    badgeColor: "bg-emerald-500/15 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
    icon: Award,
    description: "The highest trust level. Approved craftsmen have proven track records, high ratings, and consistent job excellence.",
  },
] as const; 

export function TrustSection() {
  return (
    <section className="py-12 md:py-16 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trust & Verification
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            We review every craftsman to ensure you can hire with confidence. 
            Here is how our verification system works.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verificationLevels.map((level, index) => (
            <Card 
              key={index} 
              className="relative transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-t-4"
              style={{ 
                // Custom border color for the top border
                borderTopColor: index === 0 ? 'rgb(226, 232, 240)' : index === 1 ? 'rgb(59, 130, 246)' : 'rgb(16, 185, 129)' 
              }}
            >
              <CardHeader className="pt-6 pb-2 space-y-4">
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary">
                  <level.icon className="h-6 w-6" />
                </div>

                {/* Title & Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-xl">{level.title}</CardTitle>
                  
                  {/* ✅ FIXED: Type-safe union narrowing without 'any' */}
                  {'badgeVariant' in level ? (
                    <Badge variant={level.badgeVariant}>
                      {level.badgeLabel}
                    </Badge>
                  ) : (
                    <Badge className={level.badgeColor}>
                      {level.badgeLabel}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pb-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {level.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}