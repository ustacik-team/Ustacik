"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockKeyhole, LogOut, Trash2, ShieldAlert, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteAccountDialog } from "@/components/settings/delete-account-dialog";

export function AccountSecurity() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const toastId = toast.loading("Signing out...");

    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "Failed to sign out", { id: toastId });
        setIsLoggingOut(false);
      } else {
        toast.success("Signed out successfully.", { id: toastId });
        router.push("/sign-in");
      }
    } catch (err) {
      console.error("Signout error:", err);
      toast.error("An unexpected error occurred.", { id: toastId });
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Card className="border-border/70 bg-card shadow-xs">
        <CardHeader className="p-5 sm:p-6 pb-3">
          <div className="flex items-center gap-2 text-primary">
            <LockKeyhole className="size-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Account Actions</span>
          </div>
          <CardTitle className="text-lg font-bold tracking-tight mt-1">Security & Actions</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Sign out of your account or perform permanent account removal
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <LogOut className="size-4 text-primary" />
                <span>Log Out of Ustacik</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Safely end your current session on this device.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoggingOut}
              onClick={handleSignOut}
              className="gap-2 text-xs font-medium cursor-pointer shrink-0"
            >
              {isLoggingOut ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <LogOut className="size-3.5 text-primary" />
              )}
              <span>Log Out</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                <ShieldAlert className="size-4 text-rose-500" />
                <span>Delete Account</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your profile, jobs, and platform history.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-2 text-xs font-medium cursor-pointer shrink-0"
            >
              <Trash2 className="size-3.5" />
              <span>Delete Account</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
