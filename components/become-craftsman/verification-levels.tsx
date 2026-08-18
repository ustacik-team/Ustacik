import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  ShieldCheck, 
  Award, 
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
interface VerificationLevel {
  id: "registered" | "verified" | "approved";
  title: string;
  badgeLabel: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
  requirements: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────
const levels: VerificationLevel[] = [
  {
    id: "registered",
    title: "Registered",
    badgeLabel: "Registered",
    badgeColor: "bg-slate-500/15 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-800",
    icon: UserPlus,
    description: "Start building your trust foundation. Provide basic information to get listed on the platform.",
    requirements: [
      "Phone Verified",
      "Category Selected",
      "Region Selected",
    ],
  },
  {
    id: "verified",
    title: "Verified",
    badgeLabel: "Verified",
    badgeColor: "bg-blue-500/15 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800",
    icon: ShieldCheck,
    description: "Prove your identity and professional standards. Undergo our manual verification process.",
    requirements: [
      "Phone Verified",
      "Category Selected",
      "Region Selected",
      "Government ID Checked",
      "Two Customer References",
      "Past Work Photos",
    ],
  },
  {
    id: "approved",
    title: "Approved Craftsman",
    badgeLabel: "Approved Craftsman",
    badgeColor: "bg-emerald-500/15 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
    icon: Award,
    description: "The highest level of trust and quality assurance. The ultimate badge for your business.",
    requirements: [
      "Phone Verified",
      "Category Selected",
      "Region Selected",
      "Government ID Checked",
      "Two Customer References",
      "Past Work Photos",
      "Business Registration",
      "Written Workmanship Guarantee",
    ],
  },
];

// ─── Component ──────────────────────────────────────────────────────────
export function VerificationLevels() {
  return (
    <section id="verification-levels" className="py-12 md:py-16 bg-transparent">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Verification Levels
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Our trust is built on a rigorous verification system. 
            Advance through the levels to unlock more opportunities and customer trust.
          </p>
        </div>

        {/* Responsive Grid: 1 Col Mobile, 2 Col Tablet, 3 Col Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {levels.map((level) => {
            const Icon = level.icon;
            return (
              <Card 
                key={level.id} 
                className="flex flex-col border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* ─── HEADER (Re-arranged to flex-col) ────────────────── */}
                <CardHeader className="border-b border-border/20 pb-4 flex flex-col items-start gap-1.5">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    {/* ✅ Removed truncate. The title now has full width */}
                    <CardTitle className="text-xl leading-tight">{level.title}</CardTitle>
                  </div>
                  {/* ✅ Badge moves to its own line below the title */}
                  <Badge 
                    variant="outline" 
                    className={cn("px-3 py-1 text-xs font-semibold mt-0.5", level.badgeColor)}
                  >
                    {level.badgeLabel}
                  </Badge>
                </CardHeader>

                {/* ─── BODY ─────────────────────────────────────────────── */}
                <CardContent className="pt-6 pb-6 flex-1 flex flex-col">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {level.description}
                  </p>

                  {/* Checklist */}
                  <div className="space-y-3 flex-1">
                    {level.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-foreground leading-relaxed">
                          {req}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}