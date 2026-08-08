"use client";

import Link from "next/link";
import { Children, type ReactNode } from "react";
import { ArrowRight, Scale, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CraftsmanCardProps } from "@/components/craftsmen/craftsman-card";

function priceRange(craftsman: CraftsmanCardProps) {
  if (craftsman.priceMin === null || craftsman.priceMax === null) return "On request";
  return `₺${craftsman.priceMin.toLocaleString()} – ₺${craftsman.priceMax.toLocaleString()}`;
}

export function ComparisonTray({
  craftsmen,
  onRemove,
  onClear,
}: {
  craftsmen: CraftsmanCardProps[];
  onRemove: (craftsmanId: string) => void;
  onClear: () => void;
}) {
  if (!craftsmen.length) return null;

  return (
    <div className="sticky bottom-4 z-20 mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-primary/20 bg-card/95 p-3 shadow-xl shadow-primary/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Scale className="size-5" />
        </div>
        <div>
          <p className="font-semibold">Compare your shortlist</p>
          <p className="text-sm text-muted-foreground">
            {craftsmen.length} of 3 craftsmen selected
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClear}>Clear</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              Compare now
              <ArrowRight className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto sm:max-w-5xl">
            <DialogHeader>
              <DialogTitle>Compare craftsmen</DialogTitle>
              <DialogDescription>
                Review the essentials side by side before deciding who to contact.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-x-auto pb-1">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="w-36 px-3 py-3 font-medium text-muted-foreground">Details</th>
                    {craftsmen.map((craftsman) => (
                      <th key={craftsman.id} className="min-w-52 px-3 py-3 align-top">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold">{craftsman.name}</p>
                            <p className="mt-0.5 font-normal text-muted-foreground">{craftsman.businessName}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Remove ${craftsman.name} from comparison`}
                            onClick={() => onRemove(craftsman.id)}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow label="Trust level">
                    {craftsmen.map((craftsman) => <Badge key={craftsman.id} variant="secondary">{craftsman.verificationLevel.toLowerCase()}</Badge>)}
                  </ComparisonRow>
                  <ComparisonRow label="Rating">
                    {craftsmen.map((craftsman) => <span key={craftsman.id} className="font-semibold">★ {craftsman.rating.toFixed(1)} <span className="font-normal text-muted-foreground">({craftsman.reviewCount})</span></span>)}
                  </ComparisonRow>
                  <ComparisonRow label="Completed jobs">
                    {craftsmen.map((craftsman) => <span key={craftsman.id}>{craftsman.jobsCompleted}</span>)}
                  </ComparisonRow>
                  <ComparisonRow label="Region">
                    {craftsmen.map((craftsman) => <span key={craftsman.id}>{craftsman.region}</span>)}
                  </ComparisonRow>
                  <ComparisonRow label="Price guidance">
                    {craftsmen.map((craftsman) => <span key={craftsman.id}>{priceRange(craftsman)}</span>)}
                  </ComparisonRow>
                  <ComparisonRow label="Specialties">
                    {craftsmen.map((craftsman) => <span key={craftsman.id}>{craftsman.subServices.slice(0, 2).join(", ")}</span>)}
                  </ComparisonRow>
                  <tr>
                    <td className="px-3 py-4" />
                    {craftsmen.map((craftsman) => (
                      <td key={craftsman.id} className="px-3 py-4">
                        <Button asChild size="sm" className="w-full">
                          <Link href={`/craftsmen/${craftsman.id}`}>View profile</Link>
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ComparisonRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr className="border-b last:border-b-0">
      <th scope="row" className="bg-muted/30 px-3 py-3 font-medium text-muted-foreground">{label}</th>
      {Children.map(children, (child, index) => <td key={index} className="px-3 py-3">{child}</td>)}
    </tr>
  );
}
