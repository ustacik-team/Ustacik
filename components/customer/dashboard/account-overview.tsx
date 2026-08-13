import Link from "next/link";
import { format } from "date-fns";
import { User, Mail, Phone, Calendar, Settings, ShieldCheck, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountOverviewProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: string;
    emailVerified?: boolean;
    createdAt?: Date | string;
  };
}

export function AccountOverview({ user }: AccountOverviewProps) {
  const joinDate = user.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A";

  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span>Account Overview</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5 text-primary">
            {user.role}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Your customer account profile and credentials
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-4">
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/20 border border-border/40">
            <span className="flex items-center gap-2 text-muted-foreground">
              <User className="size-3.5 text-primary" /> Full Name
            </span>
            <span className="font-semibold text-foreground truncate max-w-44">{user.name}</span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/20 border border-border/40">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-3.5 text-primary" /> Email Address
            </span>
            <span className="font-medium text-foreground truncate max-w-44">{user.email}</span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/20 border border-border/40">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-3.5 text-primary" /> Phone Number
            </span>
            <span className="font-medium text-foreground">{user.phone || "Not added"}</span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/20 border border-border/40">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-3.5 text-primary" /> Joined Ustacik
            </span>
            <span className="font-medium text-foreground">{joinDate}</span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/20 border border-border/40">
            <span className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" /> Email Status
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] ${
                user.emailVerified
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              }`}
            >
              {user.emailVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </div>

        <Button asChild size="sm" variant="outline" className="w-full gap-2 text-xs font-semibold">
          <Link href="/settings">
            <Settings className="size-3.5" />
            <span>Manage Settings</span>
            <ArrowRight className="size-3.5 ml-auto" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
