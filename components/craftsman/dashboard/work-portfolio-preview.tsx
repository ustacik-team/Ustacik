import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Images, ArrowRight, ImageIcon } from "lucide-react";

export interface DashboardWorkPhoto {
  id: string;
  imageUrl: string;
  createdAt: Date | string;
}

interface WorkPortfolioPreviewProps {
  photos: DashboardWorkPhoto[];
}

export function WorkPortfolioPreview({ photos }: WorkPortfolioPreviewProps) {
  return (
    <Card className="border-border/70 bg-card flex flex-col justify-between">
      <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Images className="size-4 text-primary" />
            <span>Work Portfolio Preview</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {photos.length} {photos.length === 1 ? "work photo" : "work photos"} uploaded
          </CardDescription>
        </div>
        <Button size="sm" variant="ghost" className="gap-1 text-xs h-8 text-primary hover:text-primary" asChild>
          <Link href="/craftsman/portfolio">
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
        {photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {photos.slice(0, 3).map((photo, idx) => (
              <div
                key={photo.id}
                className="relative aspect-4/3 overflow-hidden rounded-xl border border-border/60 bg-muted group"
              >
                <Image
                  src={photo.imageUrl}
                  alt={`Work photo ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground space-y-1">
            <ImageIcon className="size-6 mx-auto text-muted-foreground/60" />
            <p className="font-medium text-foreground">No portfolio photos yet.</p>
            <p>Upload photos of your completed projects to showcase your workmanship.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
