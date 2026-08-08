"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  UploadCloud, 
  X, 
  CheckCircle2, 
  User,
  Briefcase,
  Image as ImageIcon,
  ShieldCheck,
  FileCheck,
  Loader2,
  Users,
  IdCard
} from "lucide-react";
import { upload } from "@imagekit/next";
import { toast } from "sonner";

// ─── MOCK DATA ──────────────────────────────────────────────────────────
const regions = ["Famagusta", "Lefke", "Kyrenia", "Nicosia"];
const categories = [
  "Plumbing & Water Systems",
  "Electrical",
  "HVAC & Refrigeration",
  "Appliance & Electronics Repair",
  "Painting & Plastering",
  "Carpentry & Furniture",
  "Aluminium, PVC & Glass",
  "Garden & Pool Maintenance",
];
const subServices: Record<string, string[]> = {
  "Plumbing & Water Systems": ["Pipe Installation", "Water Heater Repair", "Drain Cleaning", "Leak Detection"],
  "Electrical": ["Wiring & Lighting", "Panel Upgrades", "Home Automation"],
  "HVAC & Refrigeration": ["AC Installation", "AC Repair", "Ventilation"],
  "Appliance & Electronics Repair": ["Washing Machine Repair", "TV Repair", "Fridge Repair"],
  "Painting & Plastering": ["Interior Painting", "Exterior Painting", "Drywall & Plaster"],
  "Carpentry & Furniture": ["Custom Furniture", "Door Installation", "Flooring"],
  "Aluminium, PVC & Glass": ["Window Installation", "Door Frames", "Glass Repair"],
  "Garden & Pool Maintenance": ["Landscaping", "Pool Cleaning", "Irrigation"],
};

// ─── ZOD SCHEMA ─────────────────────────────────────────────────────────
const formSchema = z.object({
  // Personal Info
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  
  // Business Info
  businessName: z.string().min(1, "Business name is required"),
  bio: z.string().optional(),
  region: z.string().min(1, "Region is required"),
  category: z.string().min(1, "Category is required"),
  subService: z.string().min(1, "Sub-service is required"),
  priceMin: z.coerce.number().min(0, "Minimum price must be positive"),
  priceMax: z.coerce.number().min(0, "Maximum price must be positive"),
  
  // Verification (Brief Section 4 Trust Model & Prisma Schema)
  idNumber: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  workmanshipGuarantee: z.boolean().default(false),
  
  // Previous Customer References (Required for VERIFIED level)
  ref1Name: z.string().optional(),
  ref1Phone: z.string().optional(),
  ref2Name: z.string().optional(),
  ref2Phone: z.string().optional(),
  
  // Terms & Disclaimers (Brief Section 10 Non-Negotiables)
  confirmAccuracy: z.boolean().refine((val) => val === true, {
    message: "You must confirm the information is accurate",
  }),
  agreePublish: z.boolean().refine((val) => val === true, {
    message: "You must agree to publish your profile",
  }),
  agreeDisclaimer: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge the platform matching & liability disclaimer",
  }),
}).refine((data) => data.priceMax > data.priceMin, {
  message: "Maximum price must be greater than minimum price",
  path: ["priceMax"],
});

type FormValues = z.infer<typeof formSchema>;

// ─── SECTION FIELDS MAP FOR ERROR EXPANSION ──────────────────────────────
const SECTION_FIELDS = {
  "personal-info": ["fullName", "email", "phone"],
  "business-info": ["businessName", "region", "category", "subService", "priceMin", "priceMax"],
  "verification": [
    "idNumber",
    "businessRegistrationNumber",
    "workmanshipGuarantee",
    "ref1Name",
    "ref1Phone",
    "ref2Name",
    "ref2Phone",
  ],
  "terms": ["confirmAccuracy", "agreePublish", "agreeDisclaimer"],
} as const;

// ─── COMPONENT ──────────────────────────────────────────────────────────
export function ApplicationForm() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  // ✅ Accordion State (All sections open by default)
  const [openSections, setOpenSections] = useState<string[]>([
    "personal-info",
    "business-info",
    "portfolio",
    "verification",
    "terms",
  ]);

  // ✅ Profile Photo State
  // ✅ Profile Photo State
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  // ✅ Portfolio Photos State
  // ✅ Portfolio Photos State
  const [portfolioPhotos, setPortfolioPhotos] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      businessName: "",
      bio: "",
      region: "",
      category: "",
      subService: "",
      priceMin: 0,
      priceMax: 0,
      idNumber: "",
      businessRegistrationNumber: "",
      workmanshipGuarantee: false,
      ref1Name: "",
      ref1Phone: "",
      ref2Name: "",
      ref2Phone: "",
      confirmAccuracy: false,
      agreePublish: false,
      agreeDisclaimer: false,
    },
  });

  // ✅ Track refs for unmount-only blob revocation
  const profilePreviewRef = useRef<string | null>(null);
  const portfolioPreviewsRef = useRef<string[]>([]);

  useEffect(() => {
    profilePreviewRef.current = profilePhotoPreview;
    portfolioPreviewsRef.current = portfolioPreviews;
  }, [profilePhotoPreview, portfolioPreviews]);

  // ─── MEMORY CLEANUP (UNMOUNT ONLY) ────────────────────────────────────
  useEffect(() => {
    return () => {
      if (profilePreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreviewRef.current);
      }
      portfolioPreviewsRef.current.forEach((url) => {
        if (url?.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // ─── SUBMIT & INVALID HANDLERS ────────────────────────────────────────
  const onInvalid = (errors: Record<string, unknown>) => {
    const invalid = Object.entries(SECTION_FIELDS)
      .filter(([, fields]) => fields.some((f) => f in errors))
      .map(([section]) => section);
    setOpenSections((prev) => Array.from(new Set([...prev, ...invalid])));
    toast.error("Please fill out all required fields marked in red.");
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Uploading images and submitting application...");

    let finalProfileUrl: string | null = null;
    const finalPortfolioUrls: string[] = [];

    try {
      // Helper to fetch a single-use authentication token per file
      const getUploadAuth = async () => {
        const authRes = await fetch("/api/upload-auth");
        if (!authRes.ok) {
          throw new Error("Failed to authenticate with upload server.");
        }
        return authRes.json();
      };

      // 1. Upload Profile Photo
      if (profilePhoto) {
        const auth = await getUploadAuth();
        const res = await upload({
          file: profilePhoto,
          fileName: profilePhoto.name,
          token: auth.token,
          signature: auth.signature,
          expire: auth.expire,
          publicKey: auth.publicKey,
        });
        if (res?.url) {
          finalProfileUrl = res.url;
        } else {
          throw new Error("Failed to upload profile photo.");
        }
      }

      // 2. Upload Portfolio Photos
      for (const photo of portfolioPhotos) {
        const auth = await getUploadAuth();
        const res = await upload({
          file: photo,
          fileName: photo.name,
          token: auth.token,
          signature: auth.signature,
          expire: auth.expire,
          publicKey: auth.publicKey,
        });
        if (res?.url) {
          finalPortfolioUrls.push(res.url);
        } else {
          throw new Error(`Failed to upload ${photo.name}.`);
        }
      }

      // 3. Post Application to DB API
      const payload = {
        ...values,
        profilePhotoUrl: finalProfileUrl,
        portfolioUrls: finalPortfolioUrls,
      };

      const apiRes = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const apiData = await apiRes.json();

      if (!apiRes.ok || !apiData.success) {
        throw new Error(apiData.message || apiData.error || "Failed to save application to database.");
      }

      toast.success("Application submitted successfully!", {
        id: toastId,
        description: "Your craftsman application has been received and is under review.",
      });
      form.reset();
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
      setPortfolioPhotos([]);
      setPortfolioPreviews([]);

      // Redirect user to application status page
      router.push("/application-status");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error("Application Submission Error:", err);
      toast.error(`Submission failed: ${errorMessage}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };


  // ─── FILE UPLOAD HANDLERS ──────────────────────────────────────────────
  const isImageFile = (file: File) => {
    return file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(file.name);
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo size exceeds 5MB limit.");
      e.target.value = "";
      return;
    }

    if (!isImageFile(file)) {
      toast.error("Only image formats (SVG, PNG, JPG, WebP) are allowed.");
      e.target.value = "";
      return;
    }

    if (profilePhotoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(profilePhotoPreview);
    }

    setProfilePhoto(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
    setOpenSections((prev) => Array.from(new Set([...prev, "personal-info"])));
    toast.success("Profile photo selected.");
    e.target.value = "";
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const validatedFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 10MB limit.`);
        return false;
      }
      if (!isImageFile(file)) {
        toast.error(`File ${file.name} must be an image.`);
        return false;
      }
      return true;
    });

    if (validatedFiles.length > 0) {
      const newUrls = validatedFiles.map((file) => URL.createObjectURL(file));
      setPortfolioPhotos((prev) => [...prev, ...validatedFiles]);
      setPortfolioPreviews((prev) => [...prev, ...newUrls]);
      setOpenSections((prev) => Array.from(new Set([...prev, "portfolio"])));
      toast.success(`${validatedFiles.length} work photo(s) selected.`);
    }

    e.target.value = "";
  };

  const removePortfolioPhoto = (index: number) => {
    const url = portfolioPreviews[index];
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    setPortfolioPreviews((prev) => prev.filter((_, i) => i !== index));
    setPortfolioPhotos((prev) => prev.filter((_, i) => i !== index));
    toast.info("Work photo removed.");
  };

  return (
    <section className="py-12 md:py-16 bg-muted/10" id="application-form">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Become a Craftsman
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Fill out the application below to start your journey with Ustacik.
          </p>
        </div>

        <Card className="border-border/40 bg-card/60 backdrop-blur-sm shadow-sm">
          <CardHeader className="border-b border-border/20 pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileCheck className="h-5 w-5 text-primary" />
              Craftsman Application
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="w-full">
                  
                  {/* ─── STEP 1: PERSONAL INFO ──────────────────────── */}
                  <AccordionItem value="personal-info" className="border-b border-border/20">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="text-base font-semibold">Personal Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="John Doe" 
                                  className="border-border/40 bg-background placeholder:text-muted-foreground/60" 
                                  {...field} 
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="john@example.com" 
                                  className="border-border/40 bg-background placeholder:text-muted-foreground/60" 
                                  {...field} 
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+90 533 888 77 66" 
                                className="border-border/40 bg-background placeholder:text-muted-foreground/60" 
                                {...field} 
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <FormLabel>Profile Photo</FormLabel>
                        <div className="relative flex flex-col sm:flex-row items-start gap-4">
                          <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-2 border-dashed border-muted-foreground/20 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer overflow-hidden shrink-0">
                            {profilePhotoPreview ? (
                              <div className="relative w-full h-full group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={profilePhotoPreview} 
                                  alt="Profile Preview" 
                                  className="w-full h-full object-cover rounded-full" 
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (profilePhotoPreview?.startsWith("blob:")) URL.revokeObjectURL(profilePhotoPreview);
                                    setProfilePhoto(null);
                                    setProfilePhotoPreview(null);
                                    toast.info("Profile photo removed.");
                                  }}
                                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity z-10"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-muted-foreground text-center p-2">
                                <UploadCloud className="h-5 w-5" />
                                <p className="text-[11px] font-medium leading-tight">Upload photo</p>
                              </div>
                            )}
                            <Input 
                              type="file" 
                              accept="image/*" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                              onChange={handleProfilePhotoUpload}
                            />
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="font-medium">Upload a profile photo</p>
                            <p className="text-muted-foreground text-xs">SVG, PNG, JPG (max. 5MB)</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ─── STEP 2: BUSINESS INFO ──────────────────────── */}
                  <AccordionItem value="business-info" className="border-b border-border/20">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <span className="text-base font-semibold">Business Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 space-y-4">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Doe's Plumbing Services" 
                                className="border-border/40 bg-background placeholder:text-muted-foreground/60" 
                                {...field} 
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell customers about your experience and services..."
                                className="resize-none h-24 bg-background border-border/40 placeholder:text-muted-foreground/60"
                                {...field} 
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger className="border-border/40 bg-background">
                                  <SelectValue placeholder="Select your region" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {regions.map((reg) => (
                                  <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select 
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  setSelectedCategory(val);
                                  form.setValue("subService", "");
                                }} 
                                value={field.value || ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-border/40 bg-background">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="subService"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sub-Service</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ""} disabled={!selectedCategory}>
                                <FormControl>
                                  <SelectTrigger className="border-border/40 bg-background">
                                    <SelectValue placeholder="Select sub-service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {(subServices[selectedCategory as keyof typeof subServices] || []).map((sub) => (
                                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {!selectedCategory && <p className="text-xs text-muted-foreground mt-1">Select a category first</p>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="priceMin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Price (₺)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={0} 
                                  placeholder="e.g. 200" 
                                  className="border-border/40 bg-background placeholder:text-muted-foreground/60" 
                                  {...field} 
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="priceMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Price (₺)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={0} 
                                  placeholder="e.g. 1000" 
                                  className="border-border/40 bg-background placeholder:text-muted-foreground/60" 
                                  {...field} 
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ─── STEP 3: PORTFOLIO ────────────────────────────── */}
                  <AccordionItem value="portfolio" className="border-b border-border/20">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                        <span className="text-base font-semibold">Portfolio</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 space-y-4">
                      <div className="space-y-2">
                        <FormLabel>Upload Work Photos</FormLabel>
                        <div className="relative flex items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center gap-1 text-muted-foreground">
                            <UploadCloud className="h-6 w-6" />
                            <p className="text-sm font-medium">Click to upload images</p>
                            <p className="text-xs">PNG, JPG up to 10MB</p>
                          </div>
                          <Input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handlePortfolioUpload}
                          />
                        </div>
                      </div>

                      {portfolioPreviews.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <p className="text-sm font-medium text-foreground">
                            Uploaded Photos ({portfolioPreviews.length})
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {portfolioPreviews.map((url, index) => (
                              <div key={index} className="relative aspect-square w-full rounded-lg overflow-hidden border border-border/20 bg-muted group shadow-xs">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={url} 
                                  alt={`Upload ${index + 1}`} 
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePortfolioPhoto(index)}
                                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 hover:bg-destructive text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-all shadow-md z-10"
                                  aria-label={`Remove photo ${index + 1}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* ─── STEP 4: VERIFICATION & REFERENCES ─────────────────── */}
                  <AccordionItem value="verification" className="border-b border-border/20">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <span className="text-base font-semibold">Verification &amp; Customer References</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 space-y-6">
                      
                      {/* ID Verification */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <IdCard className="h-4 w-4 text-primary" />
                          <span>Identity Verification (For Verified Level)</span>
                        </div>
                        <FormField
                          control={form.control}
                          name="idNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TRNC ID / Passport Number (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g. 10293847 or A1234567" 
                                  className="border-border/40 bg-background placeholder:text-muted-foreground/60" 
                                  {...field} 
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <p className="text-xs text-muted-foreground">Used exclusively by Ustacik trust admins to perform manual ID verification.</p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Customer References (2 Customers for VERIFIED Status) */}
                      <div className="space-y-4 pt-2 border-t border-border/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Users className="h-4 w-4 text-primary" />
                            <span>Previous Customer References</span>
                          </div>
                          <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Required for &quot;Verified&quot; Badge
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Provide details for 2 previous clients. Ustacik trust officers will contact them to verify your previous work.
                        </p>

                        {/* Reference 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg border border-border/30 bg-muted/10">
                          <FormField
                            control={form.control}
                            name="ref1Name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Client 1 Full Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Sarah Jenkins" 
                                    className="border-border/40 bg-background placeholder:text-muted-foreground/60 h-9 text-xs" 
                                    {...field} 
                                    value={field.value ?? ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ref1Phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Client 1 Phone Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="+90 533 111 22 33" 
                                    className="border-border/40 bg-background placeholder:text-muted-foreground/60 h-9 text-xs" 
                                    {...field} 
                                    value={field.value ?? ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Reference 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-lg border border-border/30 bg-muted/10">
                          <FormField
                            control={form.control}
                            name="ref2Name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Client 2 Full Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Ahmet Yilmaz" 
                                    className="border-border/40 bg-background placeholder:text-muted-foreground/60 h-9 text-xs" 
                                    {...field} 
                                    value={field.value ?? ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ref2Phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Client 2 Phone Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="+90 548 444 55 66" 
                                    className="border-border/40 bg-background placeholder:text-muted-foreground/60 h-9 text-xs" 
                                    {...field} 
                                    value={field.value ?? ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Business Registration & Guarantees */}
                      <div className="space-y-4 pt-2 border-t border-border/20">
                        <FormField
                          control={form.control}
                          name="businessRegistrationNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Registration Number (Optional - For Approved Level)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="TRNC-BIZ-2023-xxxxx" 
                                  className="border-border/40 bg-background placeholder:text-muted-foreground/60" 
                                  {...field} 
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="workmanshipGuarantee"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border/20 p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="bg-background border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium cursor-pointer">
                                  I provide a written workmanship guarantee.
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  A written guarantee dramatically increases customer trust and is a requirement for the &quot;Approved Craftsman&quot; level.
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* ─── STEP 5: TERMS & DISCLAIMERS ────────────────────── */}
                  <AccordionItem value="terms">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <FileCheck className="h-4 w-4" />
                        </div>
                        <span className="text-base font-semibold">Terms, Privacy &amp; Platform Liability</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-2 space-y-4">
                      <FormField
                        control={form.control}
                        name="confirmAccuracy"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border/20 p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="bg-background border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium cursor-pointer">
                                I confirm that all provided information is accurate and truthful.
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                All submitted references, ID numbers, and registration details will be verified by Ustacik trust officers.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="agreePublish"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border/20 p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="bg-background border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium cursor-pointer">
                                I agree that my business name, phone number, and work photos will be published after verification.
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Your public profile will display your contact details and portfolio once approved.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="agreeDisclaimer"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border/20 p-4 bg-muted/10">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="bg-background border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium cursor-pointer">
                                Platform Matching &amp; Workmanship Disclaimer
                              </FormLabel>
                              <p className="text-xs text-muted-foreground">
                                I understand that Ustacik connects customers with craftsmen and does not directly guarantee third-party workmanship.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <CardFooter className="px-6 pt-4 border-t border-border/20">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    size="lg" 
                    className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading &amp; Submitting...
                      </>
                    ) : (
                      <>
                        Apply as Craftsman
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}
