import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Lock, Mail, User, Phone, ShieldCheck, Calendar } from "lucide-react";

interface AccountInformationProps {
  user: {
    name: string;
    email: string;
    phone?: string | null;
    role: string;
    createdAt: Date;
    emailVerified: boolean;
  };
}

export function AccountInformation({ user }: AccountInformationProps) {
  const formattedJoinedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(user.createdAt));

  const roleLabel =
    user.role === "ADMIN"
      ? "Administrator"
      : user.role === "CRAFTSMAN"
      ? "Craftsman Specialist"
      : "Customer";

  return (
    <Card className="border-border/70 bg-card shadow-xs">
      <CardHeader className="p-5 sm:p-6 pb-3">
        <div className="flex items-center gap-2 text-primary">
          <Info className="size-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Account Details</span>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight mt-1">Account Information</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Read-only system account credentials and verification status
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <User className="size-3.5 text-primary" />
              <span>Full Name</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{user.name}</p>
          </div>

          {/* Email */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Mail className="size-3.5 text-primary" />
                <span>Email Address</span>
              </div>
              <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0 bg-background text-muted-foreground border-border/60">
                <Lock className="size-2.5" />
                Fixed
              </Badge>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
          </div>

          {/* Phone */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Phone className="size-3.5 text-primary" />
              <span>Phone Number</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {user.phone || "Not provided"}
            </p>
          </div>

          {/* Role */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Account Role</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{roleLabel}</p>
          </div>

          {/* Date Joined */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Calendar className="size-3.5 text-primary" />
              <span>Joined Platform</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{formattedJoinedDate}</p>
          </div>

          {/* Email Verification */}
          <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Email Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block size-2 rounded-full ${user.emailVerified ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="text-sm font-semibold text-foreground">
                {user.emailVerified ? "Verified Account" : "Unverified"}
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground/80 flex items-center gap-1.5 pt-1">
          <Lock className="size-3 text-muted-foreground shrink-0" />
          <span>Email address changes are locked for account security compliance.</span>
        </p>
      </CardContent>
    </Card>
  );
}
