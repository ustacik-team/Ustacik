"use client";

import { ImageIcon, Calendar, X } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
export interface WorkPhoto {
  id: string;
  imageUrl: string;
  uploadDate: string | Date;
  alt?: string;
}

interface WorkGalleryProps {
  works: WorkPhoto[];
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────
export function WorkGallery({ works, className }: WorkGalleryProps) {
  // ─── Empty State ──────────────────────────────────────────────────────
  if (!works || works.length === 0) {
    return (
      <Card className={cn("h-full border-border/40 bg-card/60 backdrop-blur-sm shadow-sm", className)}>
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-lg font-bold">Work Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="pt-8 pb-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/30 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm font-medium">No photos uploaded yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              This craftsman hasn&apos;t shared their work portfolio.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── Gallery Grid ─────────────────────────────────────────────────────
  return (
    <Card className={cn("h-full border-border/40 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300", className)}>
      <CardHeader className="border-b border-border/20 pb-4">
        <CardTitle className="text-lg font-bold">Work Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {works.map((work) => (
            <Dialog key={work.id}>
              <DialogTrigger asChild>
                <div className="group relative aspect-square overflow-hidden rounded-lg border border-border/20 bg-muted/10 cursor-pointer">
                  {/* Lazy-loaded Image with Hover Zoom */}
                  <Image
                    src={work.imageUrl}
                    alt={work.alt || "Work portfolio image"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Upload Date Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/90">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(work.uploadDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              {/* ─── Full-Screen Lightbox (Dialog) ───────────────────── */}
              <DialogPortal>
                <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
                <DialogContent className="max-w-5xl border-none bg-transparent shadow-none p-0 overflow-hidden">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/40">
                    <Image
                      src={work.imageUrl}
                      alt={work.alt || "Full size work image"}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </DialogClose>
                </DialogContent>
              </DialogPortal>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}