"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type WorkspaceRole = "customer" | "craftsman" | "admin";

type WorkspaceItem = {
  id: string;
  title: string;
  detail: string;
  status: "Needs attention" | "In progress" | "Up to date";
};

type WorkspaceConfig = {
  title: string;
  description: string;
  eyebrow: string;
  entity: string;
  action: string;
  Icon: LucideIcon;
  items: WorkspaceItem[];
};

const items = (
  entity: string,
  first: string,
  second: string,
  third: string,
): WorkspaceItem[] => [
  { id: `${entity}-1`, title: first, detail: "Updated today", status: "Needs attention" },
  { id: `${entity}-2`, title: second, detail: "Updated yesterday", status: "In progress" },
  { id: `${entity}-3`, title: third, detail: "Everything is current", status: "Up to date" },
];

const configurations: Record<WorkspaceRole, Record<string, WorkspaceConfig>> = {
  customer: {
    reviews: {
      title: "My reviews",
      description: "Keep track of feedback you have shared after completed work.",
      eyebrow: "Customer workspace",
      entity: "review",
      action: "Browse completed jobs",
      Icon: ClipboardList,
      items: items("review", "Review waiting for your feedback", "Kitchen tap repair review", "Lighting installation review"),
    },
    saved: {
      title: "Saved craftsmen",
      description: "Keep professionals you trust within easy reach when you are ready to contact them.",
      eyebrow: "Customer workspace",
      entity: "saved craftsman",
      action: "Find craftsmen",
      Icon: FolderKanban,
      items: items("saved", "Approved plumbers near Nicosia", "Electrical specialists you saved", "Carpenters worth comparing"),
    },
    notifications: {
      title: "Notifications",
      description: "See request replies, status changes, and platform updates in one clear inbox.",
      eyebrow: "Customer workspace",
      entity: "notification",
      action: "Mark all as read",
      Icon: Bell,
      items: items("notification", "Your job request was delivered", "A craftsman updated their availability", "Your profile is complete"),
    },
    profile: {
      title: "Profile",
      description: "Manage the details craftsmen see when you send a job request.",
      eyebrow: "Customer workspace",
      entity: "profile detail",
      action: "Edit profile",
      Icon: Settings2,
      items: items("profile", "Contact details", "Preferred service region", "Notification preferences"),
    },
  },
  craftsman: {
    jobs: {
      title: "Job requests",
      description: "Review new customer requests and keep active work organized.",
      eyebrow: "Craftsman workspace",
      entity: "job request",
      action: "Review availability",
      Icon: FolderKanban,
      items: items("job", "Leaking kitchen tap", "Hallway lighting installation", "Custom wardrobe measurement"),
    },
    services: {
      title: "My services",
      description: "Keep categories, specialties, and pricing guidance accurate for customers.",
      eyebrow: "Craftsman workspace",
      entity: "service",
      action: "Add a service",
      Icon: Settings2,
      items: items("service", "Primary service category", "Specialty services", "Price guidance"),
    },
    portfolio: {
      title: "Portfolio",
      description: "Present recent work examples that help new customers make a confident choice.",
      eyebrow: "Craftsman workspace",
      entity: "portfolio item",
      action: "Add work photo",
      Icon: FolderKanban,
      items: items("portfolio", "Kitchen renovation photos", "Recent repair project", "Before and after gallery"),
    },
    verification: {
      title: "Verification",
      description: "Track trust checks and submit any information still needed for your profile.",
      eyebrow: "Craftsman workspace",
      entity: "verification item",
      action: "Review requirements",
      Icon: ShieldCheck,
      items: items("verification", "Phone verification", "Work photo review", "Business registration check"),
    },
    reviews: {
      title: "Customer reviews",
      description: "Read verified feedback and reply thoughtfully to build long-term trust.",
      eyebrow: "Craftsman workspace",
      entity: "review",
      action: "View public profile",
      Icon: ClipboardList,
      items: items("review", "New customer feedback", "Review reply drafted", "Monthly reputation summary"),
    },
    notifications: {
      title: "Notifications",
      description: "Stay on top of new requests, job changes, and account updates.",
      eyebrow: "Craftsman workspace",
      entity: "notification",
      action: "Mark all as read",
      Icon: Bell,
      items: items("notification", "New request received", "Verification status updated", "Profile view milestone"),
    },
    profile: {
      title: "Business profile",
      description: "Keep your business details, availability, and contact information current.",
      eyebrow: "Craftsman workspace",
      entity: "profile detail",
      action: "Edit business profile",
      Icon: Settings2,
      items: items("business-profile", "Business description", "Service regions", "Contact preferences"),
    },
  },
  admin: {
    "users/customers": {
      title: "Customers",
      description: "Review customer accounts and recent activity across the marketplace.",
      eyebrow: "Administration",
      entity: "customer",
      action: "Review customers",
      Icon: UsersRound,
      items: items("customer", "New customer registrations", "Customer account review", "Recently active customers"),
    },
    "users/craftsmen": {
      title: "Craftsmen",
      description: "Manage craftsman profiles, visibility, and marketplace trust status.",
      eyebrow: "Administration",
      entity: "craftsman",
      action: "Review craftsmen",
      Icon: UsersRound,
      items: items("craftsman", "New craftsman application", "Profile awaiting review", "Recently approved craftsman"),
    },
    verifications: {
      title: "Verification queue",
      description: "Work through pending checks to keep the marketplace trustworthy.",
      eyebrow: "Administration",
      entity: "verification",
      action: "Review next verification",
      Icon: ShieldCheck,
      items: items("verification", "Identity documents pending", "Work photos to verify", "References awaiting review"),
    },
    jobs: {
      title: "Jobs",
      description: "Monitor requests and job lifecycle activity across the marketplace.",
      eyebrow: "Administration",
      entity: "job",
      action: "Review jobs",
      Icon: FolderKanban,
      items: items("job", "Open customer requests", "Jobs awaiting completion", "Recently completed jobs"),
    },
    reviews: {
      title: "Reviews",
      description: "Moderate reported feedback and protect the integrity of the review system.",
      eyebrow: "Administration",
      entity: "review",
      action: "Review reports",
      Icon: ClipboardList,
      items: items("review", "Reported customer feedback", "Reply awaiting moderation", "Review quality summary"),
    },
    categories: {
      title: "Categories",
      description: "Organize the services customers use to find the right professional.",
      eyebrow: "Administration",
      entity: "category",
      action: "Add category",
      Icon: Settings2,
      items: items("category", "Plumbing & water systems", "Electrical", "Painting & plastering"),
    },
    regions: {
      title: "Regions",
      description: "Manage the service areas where customers can find available craftsmen.",
      eyebrow: "Administration",
      entity: "region",
      action: "Add region",
      Icon: Settings2,
      items: items("region", "Nicosia coverage", "Kyrenia coverage", "Famagusta coverage"),
    },
    notifications: {
      title: "Notifications",
      description: "Create and monitor platform-wide messages and administrative alerts.",
      eyebrow: "Administration",
      entity: "notification",
      action: "Create notification",
      Icon: Bell,
      items: items("notification", "Scheduled service announcement", "Verification reminder", "Weekly marketplace summary"),
    },
    analytics: {
      title: "Analytics",
      description: "Review a focused snapshot of growth, trust, and marketplace activity.",
      eyebrow: "Administration",
      entity: "metric",
      action: "Open analytics",
      Icon: FolderKanban,
      items: items("metric", "New customer trend", "Completed job trend", "Verification completion rate"),
    },
    logs: {
      title: "Admin logs",
      description: "Review the audit trail for administrative actions and accountability.",
      eyebrow: "Administration",
      entity: "log entry",
      action: "Review logs",
      Icon: ClipboardList,
      items: items("log", "Profile verification updated", "Category edited", "Customer account reviewed"),
    },
    profile: {
      title: "Admin profile",
      description: "Manage your administrator profile and notification preferences.",
      eyebrow: "Administration",
      entity: "profile detail",
      action: "Edit profile",
      Icon: Settings2,
      items: items("admin-profile", "Account details", "Security settings", "Notification preferences"),
    },
  },
};

const statusStyles = {
  "Needs attention": "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "In progress": "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "Up to date": "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
} as const;

export function WorkspacePage({ role, section }: { role: WorkspaceRole; section: string }) {
  const config = configurations[role]?.[section];
  const [query, setQuery] = useState("");
  const [resolved, setResolved] = useState<string[]>([]);

  const visibleItems = useMemo(() => {
    if (!config) return [];
    const normalizedQuery = query.trim().toLowerCase();
    return config.items.filter((item) =>
      `${item.title} ${item.detail}`.toLowerCase().includes(normalizedQuery),
    );
  }, [config, query]);

  if (!config) return null;

  const { Icon } = config;
  const attentionCount = config.items.filter(
    (item) => item.status === "Needs attention" && !resolved.includes(item.id),
  ).length;
  const completedCount = resolved.length + config.items.filter((item) => item.status === "Up to date").length;

  const completeItem = (item: WorkspaceItem) => {
    setResolved((current) => [...new Set([...current, item.id])]);
    toast.success(`${item.title} marked as complete.`);
  };

  const primaryAction = () => {
    toast.info(`${config.action} is the next step for this workspace.`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Icon className="size-5" />
            <span className="text-sm font-semibold">{config.eyebrow}</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{config.title}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{config.description}</p>
        </div>
        <Button onClick={primaryAction} className="gap-2">
          <Plus className="size-4" />
          {config.action}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Needs attention" value={attentionCount} Icon={ShieldCheck} tone="text-amber-600" />
        <MetricCard label="Completed" value={completedCount} Icon={CheckCircle2} tone="text-emerald-600" />
        <MetricCard label="In this workspace" value={config.items.length} Icon={Icon} tone="text-primary" />
      </div>

      <Card className="border-border/70 bg-card/80 shadow-sm">
        <CardHeader className="border-b border-border/60">
          <CardTitle>Activity</CardTitle>
          <CardDescription>Review what needs your attention and keep the workspace current.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder={`Search ${config.entity}s`}
            />
          </div>
          <div className="space-y-2">
            {visibleItems.length ? (
              visibleItems.map((item) => {
                const isResolved = resolved.includes(item.id);
                const status = isResolved ? "Up to date" : item.status;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/50 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <Badge variant="outline" className={statusStyles[status]}>{status}</Badge>
                    {status !== "Up to date" && (
                      <Button variant="outline" size="sm" onClick={() => completeItem(item)}>
                        Mark complete
                      </Button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
                No {config.entity}s match your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: number;
  Icon: LucideIcon;
  tone: string;
}) {
  return (
    <Card className="border-border/70 bg-card/80">
      <CardContent className="flex items-center gap-4 py-5">
        <div className={`grid size-10 place-items-center rounded-xl bg-muted ${tone}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
