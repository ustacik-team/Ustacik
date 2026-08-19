import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Calendar, IdCard, FileText } from "lucide-react";

export interface AboutCraftsmanProps {
  businessName: string | null;
  bio: string | null;
  region: { name: string };
  yearsOfExperience: number | null;
  businessRegistrationNumber: string | null;
}

interface AboutCraftsmanWrapperProps {
  craftsman: AboutCraftsmanProps;
}

export function AboutCraftsman({ craftsman }: AboutCraftsmanWrapperProps) {
  const {
    businessName,
    bio,
    region,
    yearsOfExperience,
    businessRegistrationNumber,
  } = craftsman;

  const fieldGroups = [
    {
      label: "Business Name",
      value: businessName,
      icon: Building2,
      fallback: "Independent Contractor",
    },
    {
      label: "Region",
      value: region.name,
      icon: MapPin,
      fallback: "Not specified",
    },
    {
      label: "Years of Experience",
      value: yearsOfExperience ? `${yearsOfExperience} years` : null,
      icon: Calendar,
      fallback: "Not specified",
    },
    {
      label: "Business Registration",
      value: businessRegistrationNumber,
      icon: IdCard,
      fallback: "Not provided",
    },
  ];

  return (
    // ✅ Removed 'h-full'. The card will now size perfectly to its content, eliminating whitespace.
    <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="border-b border-border/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <FileText className="h-5 w-5 text-primary" />
          About {businessName || "the Craftsman"}
        </CardTitle>
      </CardHeader>

      {/* ✅ Added 'flex-1 flex-col justify-between' so it condenses if the bio is empty */}
      <CardContent className="pt-6 pb-6 space-y-5 flex-1 flex-col justify-between">
        {bio && (
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Description
            </p>
            <p className="text-sm leading-relaxed text-foreground">{bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-border/20">
          {fieldGroups.map((field) => {
            const Icon = field.icon;
            const displayValue = field.value ?? field.fallback;
            return (
              <div key={field.label} className="flex items-start gap-3 group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary/70 transition-colors group-hover:bg-primary/10">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    {field.label}
                  </p>
                  <p className="text-sm font-medium text-foreground break-words">
                    {displayValue}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
