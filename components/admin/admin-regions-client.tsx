"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { MapPinned, Plus, Search, Hammer, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RegionItem {
  id: string;
  name: string;
  craftsmenCount: number;
}

interface AdminRegionsClientProps {
  regions: RegionItem[];
}

export function AdminRegionsClient({ regions }: AdminRegionsClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [newRegionName, setNewRegionName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRegion = async () => {
    if (!newRegionName.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRegionName.trim() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || "Failed to create region.");
      }

      toast.success(`Region "${newRegionName}" added successfully.`);
      setIsAddDialogOpen(false);
      setNewRegionName("");
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
            <MapPinned className="h-5 w-5 text-primary" />
            Geographic Coverage &amp; Regions
          </CardTitle>
          <CardDescription className="text-xs">
            Manage Northern Cyprus district regions (Nicosia, Kyrenia, Famagusta, Lefke, Güzelyurt, Iskele).
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-52">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Button
            size="sm"
            className="h-9 text-xs gap-1 shrink-0"
            onClick={() => {
              setNewRegionName("");
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" /> Add Region
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {filteredRegions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs border border-dashed rounded-lg">
            No regions found matching search filter.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Region Name</TableHead>
                <TableHead>Active Craftsmen</TableHead>
                <TableHead>Coverage Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {filteredRegions.map((region) => (
                <TableRow key={region.id}>
                  <TableCell className="font-semibold text-foreground flex items-center gap-2">
                    <MapPinned className="h-4 w-4 text-primary" />
                    {region.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium">
                      <Hammer className="h-3.5 w-3.5 text-muted-foreground" />
                      {region.craftsmenCount} Craftsmen Registered
                    </div>
                  </TableCell>
                  <TableCell>
                    {region.craftsmenCount > 0 ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                        Active Coverage
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Pending Craftsmen
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Add Region Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add New Region
              </DialogTitle>
              <DialogDescription className="text-xs">
                Enter the name of a district or municipal region in Northern Cyprus.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2 text-xs">
              <label className="font-semibold text-foreground">Region Name</label>
              <Input
                placeholder="e.g. Lefkoşa (Nicosia), Girne (Kyrenia)..."
                value={newRegionName}
                onChange={(e) => setNewRegionName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleCreateRegion} disabled={isSubmitting || !newRegionName.trim()} className="gap-1 text-xs">
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                Add Region
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
