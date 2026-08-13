"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { deleteAccountAction } from "@/app/(dashboard)/settings/actions";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Deleting account permanently...");

    try {
      const res = await deleteAccountAction();

      if (!res.success) {
        throw new Error(res.error || "Failed to delete account.");
      }

      await authClient.signOut();
      toast.success("Your account has been deleted.", { id: toastId });
      router.push("/sign-in");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete account.", { id: toastId });
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border-destructive/20 bg-card">
        <AlertDialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <div className="grid size-9 place-items-center rounded-xl bg-destructive/10">
              <AlertTriangle className="size-5" />
            </div>
            <AlertDialogTitle className="text-lg font-bold">Delete your account?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            This action is permanent and cannot be undone. All your personal profile information, saved data, reviews, and activity history will be permanently deleted from Ustacik servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel disabled={isDeleting} className="text-xs">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={handleDelete}
            className="gap-1.5 text-xs font-semibold"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Deleting Account...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Permanently Delete Account</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
