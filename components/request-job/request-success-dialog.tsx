"use client";

import Link from "next/link";
import { CheckCircle2, Compass, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequestSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  craftsmanName: string;
}

export function RequestSuccessDialog({ open, onOpenChange, craftsmanName }: RequestSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="grid size-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="size-9" />
          </div>
          <DialogTitle className="pt-2 text-2xl font-bold">Request saved!</DialogTitle>
          <DialogDescription className="max-w-sm">
            Your request for {craftsmanName} is now in your job tracker, together with its status and contact details.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 sm:flex-col">
          <Button asChild className="w-full gap-2">
            <Link href="/customer/my-job-requests"><LayoutDashboard className="size-4" />View my requests</Link>
          </Button>
          <Button variant="outline" asChild className="w-full gap-2">
            <Link href="/find-craftsmen"><Compass className="size-4" />Browse more craftsmen</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
