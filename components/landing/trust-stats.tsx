import { Card, CardContent } from "@/components/ui/card";
import { 
  UserCheck, 
  Briefcase, 
  MessageSquare, 
  Globe 
} from "lucide-react";

const stats = [
  {
    icon: UserCheck,
    label: "Verified Craftsmen",
    value: "150+",
    description: "All profiles are manually verified for your peace of mind.",
  },
  {
    icon: Briefcase,
    label: "Completed Jobs",
    value: "152",
    description: "Successfully finished projects across various trades.",
  },
  {
    icon: MessageSquare,
    label: "Reviews",
    value: "1.2k",
    description: "Authentic community feedback and genuine ratings.",
  },
  {
    icon: Globe,
    label: "Regions Covered",
    value: "5",
    description: "Active in Kyrenia, Nicosia, Famagusta, and more.",
  },
];

export function TrustStats() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="border-none bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <CardContent className="p-6 text-center space-y-3">
                {/* Icon */}
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <stat.icon className="h-7 w-7" />
                </div>
                
                {/* Large Number */}
                <div className="text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </div>
                
                {/* Small Description */}
                <div className="text-xs text-muted-foreground/80 leading-relaxed max-w-[200px] mx-auto">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}