import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Gift, 
  Images, 
  ShieldCheck, 
  Star, 
  LayoutDashboard 
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Receive more customers",
    description: "Get matched with homeowners actively looking for your specific trade skills in Northern Cyprus.",
  },
  {
    icon: Gift,
    title: "Completely free during launch",
    description: "Sign up today and enjoy full access to our platform with zero subscription fees during our launch period.",
  },
  {
    icon: Images,
    title: "Showcase your portfolio",
    description: "Upload photos of your best work to attract new customers and demonstrate your craftsmanship.",
  },
  {
    icon: ShieldCheck,
    title: "Build trust with verification",
    description: "Our manual verification process sets you apart from competitors and builds immediate trust with customers.",
  },
  {
    icon: Star,
    title: "Collect verified reviews",
    description: "Genuine feedback from real customers helps you build a strong reputation and attract more business.",
  },
  {
    icon: LayoutDashboard,
    title: "Manage jobs from one dashboard",
    description: "Track job requests, manage your schedule, and communicate with customers all in one easy-to-use dashboard.",
  },
];

export function Benefits() {
  return (
    <section className="py-12 md:py-16 bg-muted/10">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Join Ustacik
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            We&apos;re building the most trusted network of craftsmen in Northern Cyprus. 
            Here&apos;s what you get when you join.
          </p>
        </div>

        {/* Responsive Grid: 1 Col Mobile, 2 Col Tablet, 3 Col Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index} 
                className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                <CardHeader className="pb-2 pt-6">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-6 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}