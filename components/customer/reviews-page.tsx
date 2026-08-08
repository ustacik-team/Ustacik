import Link from "next/link";
import { CalendarDays, CheckCircle2, MessageSquareQuote, PenLine, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reviews = [
  {
    job: "Air conditioner service",
    craftsman: "North Coast HVAC",
    date: "4 days ago",
    rating: 5,
    text: "Arrived on time, explained the issue clearly, and left the area clean. The price matched the estimate.",
    tags: ["Punctual", "Clear pricing", "Professional"],
  },
  {
    job: "Hallway lighting installation",
    craftsman: "Mehmet Electrical",
    date: "Jul 24",
    rating: 4,
    text: "The installation was neat and communication was easy from the first visit through to completion.",
    tags: ["Good communication", "Tidy work"],
  },
];

export function ReviewsPage() {
  const averageRating = (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/15 bg-gradient-to-br from-amber-500/[0.1] via-background to-primary/[0.06] p-6 md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400"><MessageSquareQuote className="size-4" /><span className="section-kicker">Customer feedback</span></div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">My reviews</h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">Your feedback helps reliable local professionals grow and gives future customers a clearer picture before they hire.</p>
          </div>
          <Button asChild className="gap-2"><Link href="/customer/my-job-requests"><PenLine className="size-4" /> Review completed work</Link></Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <ReviewStat label="Reviews shared" value={String(reviews.length)} detail="Feedback you have published" Icon={MessageSquareQuote} tone="text-primary bg-primary/10" />
        <ReviewStat label="Average rating" value={averageRating + " / 5"} detail="Across your completed jobs" Icon={Star} tone="text-amber-600 bg-amber-500/10" />
        <ReviewStat label="Awaiting feedback" value="1" detail="Completed job ready for your review" Icon={PenLine} tone="text-emerald-600 bg-emerald-500/10" />
      </section>

      <Card className="border-emerald-500/20 bg-emerald-500/[0.04]">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="size-5" /></div>
            <div>
              <p className="font-semibold">Your AC service is ready for feedback</p>
              <p className="mt-1 text-sm text-muted-foreground">A short review for North Coast HVAC will help other customers make a confident choice.</p>
            </div>
          </div>
          <Button variant="outline" asChild><Link href="/customer/my-job-requests">Open job</Link></Button>
        </CardContent>
      </Card>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">Feedback history</h2>
          <p className="mt-1 text-sm text-muted-foreground">The reviews you have shared after completed work.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.job} className="border-border/70 bg-card/85">
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{review.job}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{review.craftsman}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }, (_, index) => <Star key={index} className={"size-4 " + (index < review.rating ? "fill-current" : "text-muted-foreground/25")} />)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <p className="text-sm leading-relaxed text-muted-foreground">&quot;{review.text}&quot;</p>
                <div className="flex flex-wrap gap-2">{review.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>
                <div className="flex items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground"><CalendarDays className="size-3.5" /> Shared {review.date}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReviewStat({
  label,
  value,
  detail,
  Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  Icon: typeof Star;
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
