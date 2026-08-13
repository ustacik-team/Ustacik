"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Eye, Trash2, Loader2, Images } from "lucide-react";
import { deleteWorkPhotoAction } from "@/app/(dashboard)/craftsman/portfolio/actions";
import { toast } from "sonner";

export interface WorkPhotoItem {
  id: string;
  imageUrl: string;
  createdAt: Date | string;
}

interface PortfolioPhotoCardProps {
  photo: WorkPhotoItem;
  index: number;
}

export function PortfolioPhotoCard({ photo, index }: PortfolioPhotoCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(photo.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this work photo from your portfolio?")) {
      return;
    }

    setIsDeleting(true);
    const toastId = toast.loading("Deleting work photo...");

    try {
      const result = await deleteWorkPhotoAction(photo.id);
      if (result.success) {
        toast.success("Work photo deleted successfully.", { id: toastId });
        setPreviewOpen(false);
      } else {
        toast.error(result.error || "Failed to delete photo.", { id: toastId });
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("An unexpected error occurred while deleting photo.", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative aspect-square overflow-hidden rounded-lg border border-border/20 bg-muted/10 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300">
      <Image
        src={photo.imageUrl}
        alt={`Work portfolio image ${index + 1}`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />

      {/* Hover Overlay matching public profile card overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2.5 flex flex-col justify-between z-10">
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
            className="size-7 rounded-lg shadow-md active:scale-95 transition-all"
            title="Delete photo"
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-1.5 text-white">
          <div className="flex items-center gap-1 text-[10px] text-white/90 truncate">
            <Calendar className="size-3 shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>

          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary" className="gap-1 text-[11px] h-6 px-2 font-medium shrink-0">
                <Eye className="size-3 text-primary" />
                <span>Enlarge</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden rounded-2xl border-none bg-black/90">
              <DialogHeader className="p-3.5 border-b border-white/10 bg-black/40 text-white">
                <DialogTitle className="text-sm font-bold flex items-center gap-2 text-white">
                  <Images className="size-4 text-primary" />
                  <span>Work Photo #{index + 1} ({formattedDate})</span>
                </DialogTitle>
              </DialogHeader>

              <div className="relative aspect-video w-full max-h-[70vh] bg-black flex items-center justify-center">
                <Image
                  src={photo.imageUrl}
                  alt={`Work photo ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="p-3.5 bg-zinc-900 border-t border-white/10 flex items-center justify-between text-white">
                <span className="text-xs text-zinc-400">
                  Uploaded on {formattedDate}
                </span>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="gap-1.5 text-xs h-8"
                >
                  {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                  <span>Delete Photo</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
