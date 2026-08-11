"use client";

import { useState, ChangeEvent } from "react";
import { upload } from "@imagekit/next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, UploadCloud, X, Loader2, Images } from "lucide-react";
import { toast } from "sonner";
import { addWorkPhotosAction } from "@/app/(dashboard)/craftsman/portfolio/actions";

interface AddPortfolioPhotoDialogProps {
  trigger?: React.ReactNode;
}

export function AddPortfolioPhotoDialog({ trigger }: AddPortfolioPhotoDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const filesArray = Array.from(e.target.files);

    const newFiles = [...selectedFiles, ...filesArray];
    setSelectedFiles(newFiles);

    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setIsUploading(false);
  };

  const handleUploadAndSave = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image to upload.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${selectedFiles.length} photo(s) to portfolio...`);

    try {
      const getUploadAuth = async () => {
        const authRes = await fetch("/api/upload-auth");
        if (!authRes.ok) {
          throw new Error("Failed to authenticate with upload server.");
        }
        return authRes.json();
      };

      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const auth = await getUploadAuth();
        const res = await upload({
          file,
          fileName: file.name,
          token: auth.token,
          signature: auth.signature,
          expire: auth.expire,
          publicKey: auth.publicKey,
        });

        if (res?.url) {
          uploadedUrls.push(res.url);
        } else {
          throw new Error(`Failed to upload ${file.name}.`);
        }
      }

      // Save URLs to WorkPhoto in PostgreSQL via Server Action
      const result = await addWorkPhotosAction(uploadedUrls);

      if (result.success) {
        toast.success(`Successfully added ${result.count} work photo(s) to portfolio!`, {
          id: toastId,
        });
        resetForm();
        setOpen(false);
      } else {
        throw new Error(result.error || "Failed to save photos to portfolio.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed.", {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!isUploading) {
          setOpen(v);
          if (!v) resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-1.5 font-semibold shadow-xs">
            <Plus className="size-4" />
            <span>Add Work Photo</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md sm:max-w-lg space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Images className="size-5 text-primary" />
            <span>Add Work Photos to Portfolio</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Upload photos of completed projects to showcase your workmanship to customers on Ustacik.
          </DialogDescription>
        </DialogHeader>

        {/* Dropzone matching Application Form Upload pattern */}
        <div className="space-y-4 pt-1">
          <div className="relative flex items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
              <UploadCloud className="size-7 text-primary shrink-0" />
              <p className="text-sm font-semibold text-foreground">Click or drag images to upload</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB per file</p>
            </div>
            <Input
              type="file"
              multiple
              accept="image/*"
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              onChange={handleFileChange}
            />
          </div>

          {/* Selected File Thumbnails Grid */}
          {previews.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Selected Photos ({previews.length})</span>
                <span className="text-muted-foreground font-normal text-[11px]">Ready to upload</span>
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                {previews.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-4/3 w-full rounded-lg overflow-hidden border border-border/70 bg-muted group shadow-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1.5 right-1.5 size-5 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-all shadow-md z-10"
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dialog Actions */}
        <div className="border-t pt-4 flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={isUploading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={selectedFiles.length === 0 || isUploading}
            onClick={handleUploadAndSave}
            className="gap-2 font-medium"
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="size-4" />
                <span>Upload to Portfolio</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
