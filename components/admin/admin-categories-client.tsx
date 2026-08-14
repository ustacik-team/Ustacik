"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tags, Plus, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SubServiceItem {
  id: string;
  name: string;
  craftsmenCount: number;
  jobsCount: number;
}

interface CategoryItem {
  id: string;
  name: string;
  craftsmenCount: number;
  jobsCount: number;
  subServices: SubServiceItem[];
}

interface AdminCategoriesClientProps {
  categories: CategoryItem[];
}

export function AdminCategoriesClient({ categories }: AdminCategoriesClientProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [newSubServiceName, setNewSubServiceName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOpenAddSubService = (category: CategoryItem) => {
    setSelectedCategory(category);
    setNewSubServiceName("");
    setIsAddDialogOpen(true);
  };

  const handleCreateSubService = async () => {
    if (!selectedCategory || !newSubServiceName.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/categories/sub-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategory.id,
          name: newSubServiceName.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || "Failed to create sub-service.");
      }

      toast.success(`Added sub-service "${newSubServiceName}" to ${selectedCategory.name}`);
      setIsAddDialogOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-border/60">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tags className="h-5 w-5 text-primary" />
            Fixed Trade Taxonomy &amp; Sub-Services
          </CardTitle>
          <CardDescription className="text-xs">
            Manage the 8 fixed core service categories and add standardized sub-services across teams.
          </CardDescription>
        </div>

        <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs gap-1 w-fit">
          <Lock className="h-3 w-3" /> 8 Fixed Top-Level Categories
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((cat) => (
            <Card key={cat.id} className="border border-border/50 bg-muted/20">
              <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {cat.name}
                  </CardTitle>
                  <CardDescription className="text-[11px] mt-0.5">
                    {cat.craftsmenCount} craftsmen · {cat.jobsCount} jobs logged
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => handleOpenAddSubService(cat)}
                >
                  <Plus className="h-3.5 w-3.5" /> Sub-Service
                </Button>
              </CardHeader>

              <CardContent className="p-3 text-xs">
                {cat.subServices.length === 0 ? (
                  <p className="text-muted-foreground text-[11px] italic p-2">
                    No sub-services defined for this category yet.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subServices.map((sub) => (
                      <Badge key={sub.id} variant="secondary" className="text-[11px] text-muted-foreground font-normal py-1 px-2.5 bg-background border">
                        {sub.name}
                        <span className="ml-1 text-[9px] text-muted-foreground">({sub.craftsmenCount})</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Sub-Service Dialog */}
        {selectedCategory && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Add Sub-Service to {selectedCategory.name}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Sub-services standardize trade skills across all intern teams and search filters.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-2 text-xs">
                <label className="font-semibold text-foreground">Sub-Service Name (English / Turkish)</label>
                <Input
                  placeholder="e.g. Pipe Leak Repair, Solar Water Heater..."
                  value={newSubServiceName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSubServiceName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSubService} disabled={isSubmitting || !newSubServiceName.trim()} className="gap-1 text-xs">
                  {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  Add Sub-Service
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
