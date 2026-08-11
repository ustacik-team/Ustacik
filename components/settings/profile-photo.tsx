"use client";

import { useState, ChangeEvent } from "react";
import { upload } from "@imagekit/next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, UploadCloud, Trash2, Loader2 } from "lucide-react";
import { updateUserPhotoAction } from "@/app/(dashboard)/settings/actions";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfilePhotoProps {
  user: {
    name: string;
    image?: string | null;
  };
}

export function ProfilePhoto({ user }: ProfilePhotoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "US";

  const handleImageSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading new profile picture...");

    try {
      // 1. Authenticate single-use ImageKit token
      const authRes = await fetch("/api/upload-auth");
      if (!authRes.ok) {
        throw new Error("Failed to authenticate with upload server.");
      }
      const auth = await authRes.json();

      // 2. Upload file to ImageKit
      const res = await upload({
        file,
        fileName: `profile_${Date.now()}_${file.name}`,
        token: auth.token,
        signature: auth.signature,
        expire: auth.expire,
        publicKey: auth.publicKey,
      });

      if (!res?.url) {
        throw new Error("Upload failed. No URL returned.");
      }

      // 3. Save exact URL returned by ImageKit in User.image
      const dbResult = await updateUserPhotoAction(res.url);

      await authClient.updateUser({
        image: res.url,
      });

      if (dbResult.success) {
        toast.success("Profile photo updated!", { id: toastId });
        router.refresh();
      } else {
        toast.error(dbResult.error || "Failed to update profile photo in database.", { id: toastId });
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload image.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;

    setIsUploading(true);
    const toastId = toast.loading("Removing profile photo...");

    try {
      const dbResult = await updateUserPhotoAction(null);

      await authClient.updateUser({
        image: null,
      });

      if (dbResult.success) {
        toast.success("Profile photo removed.", { id: toastId });
        router.refresh();
      } else {
        toast.error(dbResult.error || "Failed to remove photo.", { id: toastId });
      }
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast.error("An unexpected error occurred while removing photo.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-4">
      <div className="relative group">
        <Avatar className="size-24 sm:size-28 border-2 border-primary/20 shadow-md">
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        <label
          htmlFor="profile-photo-input"
          className="absolute inset-0 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          title="Change profile photo"
        >
          <Camera className="size-6" />
        </label>

        <Input
          id="profile-photo-input"
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={isUploading}
          asChild
          className="gap-1.5 text-xs font-medium cursor-pointer"
        >
          <label htmlFor="profile-photo-input">
            {isUploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <UploadCloud className="size-3.5 text-primary" />
            )}
            <span>{user.image ? "Change Photo" : "Upload Photo"}</span>
          </label>
        </Button>

        {user.image && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isUploading}
            onClick={handleRemovePhoto}
            className="gap-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <Trash2 className="size-3.5" />
            <span>Remove</span>
          </Button>
        )}
      </div>
    </div>
  );
}
