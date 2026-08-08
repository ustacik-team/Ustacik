"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, ImagePlus, MessageCircle, Phone, Send, WalletCards, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  clearJobRequestDraft,
  getJobRequestDraft,
  saveJobRequestDraft,
  saveLocalJobRequest,
} from "@/lib/local-job-requests";
import { RequestSuccessDialog } from "./request-success-dialog";

const requestSchema = z.object({
  category: z.string().min(1, "Select a category."),
  subService: z.string().min(1, "Select a service."),
  title: z.string().trim().min(8, "Use at least 8 characters.").max(100, "Keep the title under 100 characters."),
  description: z.string().trim().min(20, "Tell the craftsman a little more (at least 20 characters).").max(2000, "Keep the description under 2,000 characters."),
  address: z.string().trim().min(5, "Enter your service address."),
  region: z.string().min(1, "Select a region."),
  contactPreference: z.enum(["call", "sms", "whatsapp"]),
  preferredTiming: z.enum(["flexible", "weekdays", "weekend", "urgent"]),
  budget: z.enum(["discuss", "under-250", "250-500", "500-1000", "1000-plus"]),
  terms: z.literal(true, { error: "Please accept the terms to continue." }),
});

type RequestValues = z.infer<typeof requestSchema>;

interface RequestJobFormProps {
  craftsman: {
    id: string;
    name: string;
    category: string;
    subServices: string[];
    region: string;
  };
  regions: string[];
}

const contactOptions = [
  { value: "call", label: "Call", Icon: Phone },
  { value: "sms", label: "SMS", Icon: MessageCircle },
  { value: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
] as const;

const timingOptions = [
  { value: "flexible", label: "I am flexible" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekend", label: "Weekend" },
  { value: "urgent", label: "Urgent — as soon as possible" },
] as const;

const budgetOptions = [
  { value: "discuss", label: "Discuss after inspection" },
  { value: "under-250", label: "Under ₺250" },
  { value: "250-500", label: "₺250–₺500" },
  { value: "500-1000", label: "₺500–₺1,000" },
  { value: "1000-plus", label: "Over ₺1,000" },
] as const;

export function RequestJobForm({ craftsman, regions }: RequestJobFormProps) {
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedDraft = getJobRequestDraft(craftsman.id);
  const form = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      category: craftsman.category,
      subService: savedDraft.subService ?? "",
      title: savedDraft.title ?? "",
      description: savedDraft.description ?? "",
      address: savedDraft.address ?? "",
      region: savedDraft.region ?? craftsman.region,
      contactPreference: savedDraft.contactPreference ?? "call",
      preferredTiming: savedDraft.preferredTiming ?? "flexible",
      budget: savedDraft.budget ?? "discuss",
      terms: undefined,
    },
  });

  const addFiles = (fileList: FileList | File[]) => {
    const incomingFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (incomingFiles.length !== Array.from(fileList).length) toast.error("Only image files can be added.");
    const allowedFiles = incomingFiles.slice(0, 5 - photos.length);
    if (incomingFiles.length > allowedFiles.length) toast.error("You can add up to 5 photos.");
    setPhotos((current) => [...current, ...allowedFiles.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
  };

  const removePhoto = (index: number) => {
    setPhotos((current) => {
      URL.revokeObjectURL(current[index].preview);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const saveDraft = () => {
    const values = form.getValues();
    saveJobRequestDraft(craftsman.id, {
      subService: values.subService,
      title: values.title,
      description: values.description,
      address: values.address,
      region: values.region,
      contactPreference: values.contactPreference,
      preferredTiming: values.preferredTiming,
      budget: values.budget,
    });
  };

  const onSubmit = (values: RequestValues) => {
    saveLocalJobRequest({
      craftsmanId: craftsman.id,
      craftsman: craftsman.name,
      title: values.title,
      category: values.category,
      region: values.region,
    });
    clearJobRequestDraft(craftsman.id);
    photos.forEach(({ preview }) => URL.revokeObjectURL(preview));
    setPhotos([]);
    form.reset({
      category: craftsman.category,
      subService: "",
      title: "",
      description: "",
      address: "",
      region: craftsman.region,
      contactPreference: "call",
      preferredTiming: "flexible",
      budget: "discuss",
      terms: undefined,
    });
    toast.success("Your request was added to your job tracker.");
    setSuccessOpen(true);
  };

  return (
    <>
      <Card className="border-border/70 bg-card/95 shadow-lg shadow-primary/5">
        <CardHeader className="border-b border-border/60">
          <CardTitle>Tell us about the job</CardTitle>
          <CardDescription>Fields marked with an asterisk are required. Your progress is saved on this device as you work.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onBlur={saveDraft} className="space-y-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value={craftsman.category}>{craftsman.category}</SelectItem></SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="subService" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-service *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Choose the service you need" /></SelectTrigger></FormControl>
                      <SelectContent>{craftsman.subServices.map((service) => <SelectItem key={service} value={service}>{service}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Job title *</FormLabel>
                  <FormControl><Input placeholder="e.g. Repair a leaking kitchen tap" maxLength={100} {...field} /></FormControl>
                  <FormDescription>Be specific so the craftsman can quickly understand the need.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Job description *</FormLabel>
                  <FormControl><Textarea placeholder="Describe the issue, the size of the job, preferred timing, and anything the craftsman should know." className="min-h-32 resize-y" maxLength={2000} {...field} /></FormControl>
                  <div className="flex justify-between gap-3"><FormDescription>The more detail you share, the more useful the response.</FormDescription><span className="shrink-0 text-xs text-muted-foreground">{field.value.length}/2000</span></div>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Service address *</FormLabel><FormControl><Input placeholder="Street, building, area" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="region" render={({ field }) => (
                  <FormItem><FormLabel>Region *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl><SelectContent>{regions.map((region) => <SelectItem key={region} value={region}>{region}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField control={form.control} name="preferredTiming" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><CalendarClock className="size-4 text-primary" />Preferred timing *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{timingOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>
                    <FormDescription>This helps the craftsman plan a suitable response.</FormDescription><FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="budget" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><WalletCards className="size-4 text-primary" />Budget guidance *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{budgetOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select>
                    <FormDescription>Optional guidance only — agree the final price directly.</FormDescription><FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-3">
                <div><FormLabel>Photos <span className="font-normal text-muted-foreground">(optional)</span></FormLabel><p className="mt-1 text-sm text-muted-foreground">Add up to 5 photos of the issue. JPG, PNG, or WEBP work best.</p></div>
                <div onDrop={(event) => { event.preventDefault(); setIsDragging(false); addFiles(event.dataTransfer.files); }} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} className={`rounded-xl border border-dashed p-6 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/25"}`}>
                  <ImagePlus className="mx-auto size-7 text-primary" />
                  <p className="mt-2 text-sm font-medium">Drag photos here, or <button type="button" onClick={() => fileInputRef.current?.click()} className="text-primary underline underline-offset-2">browse files</button></p>
                  <p className="mt-1 text-xs text-muted-foreground">Maximum 5 images</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.target.value = ""; }} />
                </div>
                {photos.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{photos.map(({ file, preview }, index) => <div key={preview} className="group relative aspect-square overflow-hidden rounded-lg border"><Image unoptimized src={preview} alt={file.name} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover" /><button type="button" onClick={() => removePhoto(index)} className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-muted-foreground shadow-sm transition-colors hover:text-destructive" aria-label={`Remove ${file.name}`}><X className="size-3.5" /></button></div>)}</div>}
              </div>

              <FormField control={form.control} name="contactPreference" render={({ field }) => (
                <FormItem><FormLabel>How should {craftsman.name} contact you? *</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 gap-2 sm:grid-cols-3">{contactOptions.map(({ value, label, Icon }) => <label key={value} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background px-3 py-3 has-data-checked:border-primary has-data-checked:bg-primary/5"><RadioGroupItem value={value} /><Icon className="size-4 text-primary" /><span className="text-sm font-medium">{label}</span></label>)}</RadioGroup></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="terms" render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border border-border/70 bg-muted/25 p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="cursor-pointer font-normal">I confirm these details are accurate and agree to share them with {craftsman.name}. *</FormLabel><FormMessage /></div></FormItem>
              )} />

              <Button type="submit" size="lg" className="w-full gap-2 sm:w-auto"><Send className="size-4" />Add to job tracker</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <RequestSuccessDialog open={successOpen} onOpenChange={setSuccessOpen} craftsmanName={craftsman.name} />
    </>
  );
}
