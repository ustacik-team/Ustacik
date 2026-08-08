"use client";

import { useState, useEffect } from "react";
import { useForm, Resolver } from "react-hook-form"; // ✅ Import Resolver
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
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
  FileCheck
} from "lucide-react";

// ─── MOCK DATA ──────────────────────────────────────────────────────────
const regions = ["Nicosia", "Kyrenia", "Famagusta", "Morphou", "Larnaca"];
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
  
  // Verification
  businessRegistrationNumber: z.string().optional(),
  workmanshipGuarantee: z.boolean().default(false),
  
  // Terms
  confirmAccuracy: z.boolean().refine((val) => val === true, {
    message: "You must confirm the information is accurate",
  }),
  agreePublish: z.boolean().refine((val) => val === true, {
    message: "You must agree to publish your profile",
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
  "verification": ["businessRegistrationNumber", "workmanshipGuarantee"],
  "terms": ["confirmAccuracy", "agreePublish"],
} as const;

// ─── COMPONENT ──────────────────────────────────────────────────────────
export function ApplicationForm() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  // ✅ Accordion State (Multi-open)
  const [openSections, setOpenSections] = useState<string[]>(["personal-info"]);

  // ✅ Profile Photo State
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  // ✅ Portfolio Photos State
  const [portfolioPhotos, setPortfolioPhotos] = useState<File[]>([]);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);

  const form = useForm<FormValues>({
    // ✅ Fix: Explicitly cast resolver to avoid type mismatch error
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
      businessRegistrationNumber: "",
      workmanshipGuarantee: false,
      confirmAccuracy: false,
      agreePublish: false,
    },
  });

  // ─── MEMORY CLEANUP FOR BLOB URLS ──────────────────────────────────────
  useEffect(() => {
    return () => {
      if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
      portfolioPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [profilePhotoPreview, portfolioPreviews]);

  // ─── SUBMIT & INVALID HANDLERS ────────────────────────────────────────
  const onInvalid = (errors: Record<string, unknown>) => {
    // Automatically expand any Accordion section that contains validation errors
    const invalid = Object.entries(SECTION_FIELDS)
      .filter(([, fields]) => fields.some((f) => f in errors))
      .map(([section]) => section);
    setOpenSections((prev) => Array.from(new Set([...prev, ...invalid])));
  };

  const onSubmit = (values: FormValues) => {
    console.log("Form Submitted:", { ...values, profilePhoto, portfolioPhotos });
    alert("Application submitted successfully! (Mock)");
  };

  // ─── FILE UPLOAD HANDLERS ──────────────────────────────────────────────
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    // Validate file type
    if (!["image/svg+xml", "image/png", "image/jpeg"].includes(file.type)) {
      alert("Only SVG, PNG, and JPG formats are allowed.");
      return;
    }

    // Cleanup previous preview
    if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);

    setProfilePhoto(file);
    setProfilePhotoPreview(URL.createObjectURL(file));
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validatedFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 10MB limit.`);
        return false;
      }
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        alert(`File ${file.name} must be PNG or JPG.`);
        return false;
      }
      return true;
    });

    const newUrls = validatedFiles.map((file) => URL.createObjectURL(file));
    setPortfolioPhotos((prev) => [...prev, ...validatedFiles]);
    setPortfolioPreviews((prev) => [...prev, ...newUrls]);
  };

  const removePortfolioPhoto = (index: number) => {
    const url = portfolioPreviews[index];
    if (url) URL.revokeObjectURL(url);
    setPortfolioPreviews((prev) => prev.filter((_, i) => i !== index));
    setPortfolioPhotos((prev) => prev.filter((_, i) => i !== index));
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <FormLabel>Profile Photo</FormLabel>
                        <div className="relative flex flex-col sm:flex-row items-start gap-4">
                          <div className="relative flex items-center justify-center w-full sm:w-48 h-32 rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer overflow-hidden">
                            {profilePhotoPreview ? (
                              <div className="relative w-full h-full group">
                                <Image 
                                  src={profilePhotoPreview} 
                                  alt="Profile Preview" 
                                  fill 
                                  className="object-cover" 
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
                                    setProfilePhoto(null);
                                    setProfilePhotoPreview(null);
                                  }}
                                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                <UploadCloud className="h-5 w-5" />
                                <p className="text-xs font-medium">Click to upload</p>
                              </div>
                            )}
                            <Input 
                              type="file" 
                              accept=".svg,.png,.jpg,.jpeg" 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                defaultValue={field.value}
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
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCategory}>
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
                            accept=".png,.jpg,.jpeg" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handlePortfolioUpload}
                          />
                        </div>
                      </div>

                      {portfolioPreviews.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Uploaded Photos</p>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {portfolioPreviews.map((url, index) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border/20 group">
                                <Image 
                                  src={url} 
                                  alt={`Upload ${index + 1}`} 
                                  fill 
                                  unoptimized={true} 
                                  className="object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePortfolioPhoto(index)}
                                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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

                  {/* ─── STEP 4: VERIFICATION ──────────────────────────── */}
                  <AccordionItem value="verification" className="border-b border-border/20">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <span className="text-base font-semibold">Verification &amp; Guarantee</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 space-y-4">
                      <FormField
                        control={form.control}
                        name="businessRegistrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Registration Number (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="TRNC-BIZ-2023-xxxxx" 
                                className="border-border/40 bg-background placeholder:text-muted-foreground/60" 
                                {...field} 
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
                    </AccordionContent>
                  </AccordionItem>

                  {/* ─── STEP 5: TERMS ──────────────────────────────────── */}
                  <AccordionItem value="terms">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <FileCheck className="h-4 w-4" />
                        </div>
                        <span className="text-base font-semibold">Terms &amp; Agreement</span>
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
                                I confirm that the information provided is accurate.
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                We verify all information during the review process.
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
                                I agree that my business profile may be published after verification.
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Your profile will only go live once the verification is fully approved.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <CardFooter className="px-6 pt-4 border-t border-border/20">
                  <Button type="submit" size="lg" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                    Apply as Craftsman
                    <CheckCircle2 className="h-4 w-4" />
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
