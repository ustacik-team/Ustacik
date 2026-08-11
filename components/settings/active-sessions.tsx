import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Globe, Shield, Clock } from "lucide-react";

interface SessionItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
}

interface ActiveSessionsProps {
  sessions: SessionItem[];
  currentSessionId?: string;
}

function parseDevice(userAgent?: string | null): { name: string; isMobile: boolean } {
  if (!userAgent) return { name: "Unknown Device", isMobile: false };

  const ua = userAgent.toLowerCase();
  let name = "Web Browser";

  if (ua.includes("chrome")) name = "Chrome Browser";
  else if (ua.includes("firefox")) name = "Firefox Browser";
  else if (ua.includes("safari")) name = "Safari Browser";
  else if (ua.includes("edge")) name = "Edge Browser";

  if (ua.includes("windows")) name += " on Windows";
  else if (ua.includes("mac os")) name += " on macOS";
  else if (ua.includes("android")) name += " on Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) name += " on iOS";
  else if (ua.includes("linux")) name += " on Linux";

  const isMobile = ua.includes("mobile") || ua.includes("android") || ua.includes("iphone");

  return { name, isMobile };
}

export function ActiveSessions({ sessions }: ActiveSessionsProps) {
  return (
    <Card className="border-border/70 bg-card shadow-xs">
      <CardHeader className="p-5 sm:p-6 pb-3">
        <div className="flex items-center gap-2 text-primary">
          <Shield className="size-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Active Logins</span>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight mt-1">Active Sessions</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Overview of signed-in browser sessions and devices attached to your account
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 pt-0 space-y-3">
        {sessions.length === 0 ? (
          <p className="text-xs text-muted-foreground">No active sessions found.</p>
        ) : (
          <div className="space-y-2.5">
            {sessions.map((sess, idx) => {
              const { name, isMobile } = parseDevice(sess.userAgent);
              const DeviceIcon = isMobile ? Smartphone : Monitor;
              const formattedCreated = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(sess.createdAt));

              const isFirst = idx === 0;

              return (
                <div
                  key={sess.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <DeviceIcon className="size-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-foreground truncate">{name}</p>
                        {isFirst && (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 px-1.5 py-0">
                            Current Session
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-muted-foreground shrink-0" />
                          Signed in {formattedCreated}
                        </span>
                        {sess.ipAddress && (
                          <span className="flex items-center gap-1 hidden sm:flex">
                            <Globe className="size-3 text-muted-foreground shrink-0" />
                            IP: {sess.ipAddress}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
