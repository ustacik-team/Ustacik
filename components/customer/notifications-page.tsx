"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BellRing,
  CalendarCheck2,
  CheckCheck,
  Heart,
  MessageSquareText,
  ShieldCheck,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type NotificationKind = "request" | "visit" | "saved" | "account";
type Notification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  kind: NotificationKind;
  unread: boolean;
  href: string;
};

const initialNotifications: Notification[] = [
  { id: "request-view", title: "A craftsman viewed your request", detail: "Aydin Plumbing opened your kitchen leak repair request.", time: "12 minutes ago", kind: "request", unread: true, href: "/customer/my-job-requests" },
  { id: "visit-booked", title: "Visit confirmed for Friday", detail: "Mehmet Electrical confirmed your safety check at 10:00.", time: "Yesterday", kind: "visit", unread: true, href: "/customer/my-job-requests" },
  { id: "saved-update", title: "A saved craftsman updated their profile", detail: "North Coast HVAC added new availability and work photos.", time: "2 days ago", kind: "saved", unread: false, href: "/customer/saved" },
  { id: "profile-check", title: "Your request details are complete", detail: "Craftsmen can now see your location, preferred timing, and contact preference.", time: "4 days ago", kind: "account", unread: false, href: "/customer/profile" },
];

const notificationVisuals: Record<NotificationKind, { Icon: LucideIcon; label: string; tone: string }> = {
  request: { Icon: MessageSquareText, label: "Request", tone: "bg-primary/10 text-primary" },
  visit: { Icon: CalendarCheck2, label: "Visit", tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  saved: { Icon: Heart, label: "Shortlist", tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  account: { Icon: ShieldCheck, label: "Account", tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const unreadCount = notifications.filter((notification) => notification.unread).length;
  const visibleNotifications = useMemo(
    () => showUnreadOnly ? notifications.filter((notification) => notification.unread) : notifications,
    [notifications, showUnreadOnly],
  );

  const markRead = (id: string) => {
    setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, unread: false } : notification));
  };

  const markAllRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.1] via-background to-sky-500/[0.07] p-6 md:p-8">
        <div className="pointer-events-none absolute -right-14 -top-14 size-52 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary"><BellRing className="size-4" /><span className="section-kicker">Your inbox</span></div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Notifications</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">Keep track of request replies, booked visits, profile updates, and the things that need your attention.</p>
          </div>
          <Button variant="outline" onClick={markAllRead} disabled={!unreadCount} className="gap-2"><CheckCheck className="size-4" /> Mark all as read</Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <NotificationStat label="Unread" value={String(unreadCount)} detail="Updates that still need a look" Icon={BellRing} tone="text-primary bg-primary/10" />
        <NotificationStat label="Visits booked" value={String(notifications.filter((item) => item.kind === "visit").length)} detail="Confirmed appointments in your inbox" Icon={CalendarCheck2} tone="text-emerald-600 bg-emerald-500/10" />
        <NotificationStat label="Request updates" value={String(notifications.filter((item) => item.kind === "request").length)} detail="New activity on your job requests" Icon={MessageSquareText} tone="text-sky-600 bg-sky-500/10" />
      </section>

      <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/85">
        <div className="flex flex-col gap-4 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Recent updates</h2>
            <p className="mt-1 text-sm text-muted-foreground">The latest changes across your requests and account.</p>
          </div>
          <Button variant={showUnreadOnly ? "secondary" : "outline"} size="sm" onClick={() => setShowUnreadOnly((current) => !current)} className="gap-2 self-start sm:self-auto"><SlidersHorizontal className="size-3.5" /> {showUnreadOnly ? "Showing unread" : "Show unread only"}</Button>
        </div>
        <div className="divide-y divide-border/60">
          {visibleNotifications.length ? visibleNotifications.map((notification) => {
            const visual = notificationVisuals[notification.kind];
            const Icon = visual.Icon;
            return (
              <div key={notification.id} className={"flex gap-4 p-5 transition-colors hover:bg-muted/[0.28] " + (notification.unread ? "bg-primary/[0.025]" : "")}>
                <div className={"grid size-11 shrink-0 place-items-center rounded-2xl " + visual.tone}><Icon className="size-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{notification.title}</p>
                      {notification.unread && <span className="size-2 rounded-full bg-primary" aria-label="Unread" />}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{notification.detail}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">{visual.label}</Badge>
                    <Button asChild variant="link" size="sm" className="h-auto px-0 text-primary"><Link href={notification.href}>Open details</Link></Button>
                    {notification.unread && <Button variant="ghost" size="sm" onClick={() => markRead(notification.id)}>Mark read</Button>}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-12 text-center">
              <CheckCheck className="mx-auto size-8 text-emerald-500" />
              <h3 className="mt-3 font-semibold">You&apos;re all caught up.</h3>
              <p className="mt-1 text-sm text-muted-foreground">There are no unread updates right now.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function NotificationStat({
  label,
  value,
  detail,
  Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  Icon: LucideIcon;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/85 p-5">
      <div className={"grid size-10 place-items-center rounded-xl " + tone}><Icon className="size-5" /></div>
      <p className="mt-5 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-sm font-semibold">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}
