"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createJobRequestAction } from "@/app/(public)/craftsmen/[id]/request/actions";

const requestSchema = z.object({
  categoryId: z.string().min(1, "Select a category."),
  subServiceId: z.string().optional(),
  title: z.string().trim().min(5, "Title must be at least 5 characters.").max(100, "Keep title under 100 characters."),
  description: z.string().trim().min(15, "Please provide more details (at least 15 characters).").max(2000, "Keep description under 2,000 characters."),
  address: z.string().trim().min(5, "Enter service address.").max(300, "Address is too long."),
});

type RequestValues = z.infer<typeof requestSchema>;

interface CategoryData {
  id: string;
  name: string;
  subServices: { id: string; name: string }[];
}

interface RequestJobFormProps {
  craftsman: {
    id: string;
    name: string;
    businessName: string | null;
    categories: { id: string; name: string }[];
  };
  categories: CategoryData[];
  onValuesChange?: (values: { categoryId: string; subServiceId?: string; title: string; address: string }) => void;
}

export function RequestJobForm({ craftsman, categories, onValuesChange }: RequestJobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default category is craftsman's primary category if available, otherwise first category
  const defaultCategoryId = craftsman.categories[0]?.id || categories[0]?.id || "";

  const form = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      categoryId: defaultCategoryId,
      subServiceId: "",
      title: "",
      description: "",
      address: "",
    },
  });

  const selectedCategoryId = useWatch({ control: form.control, name: "categoryId" }) || defaultCategoryId;
  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
  const availableSubServices = selectedCategory?.subServices || [];

  const handleCategoryChange = (val: string) => {
    form.setValue("categoryId", val);
    form.setValue("subServiceId", "");
    triggerValuesChange(val, "", form.getValues("title"), form.getValues("address"));
  };

  const triggerValuesChange = (catId: string, subId?: string, titleVal?: string, addrVal?: string) => {
    if (onValuesChange) {
      onValuesChange({
        categoryId: catId,
        subServiceId: subId,
        title: titleVal || "",
        address: addrVal || "",
      });
    }
  };

  const onSubmit = async (values: RequestValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await createJobRequestAction({
        craftsmanId: craftsman.id,
        categoryId: values.categoryId,
        subServiceId: values.subServiceId || undefined,
        title: values.title,
        description: values.description,
        address: values.address,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to submit request.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Job request submitted successfully!");
      router.push("/customer/my-job-requests");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/70 bg-card/95 shadow-lg shadow-primary/5">
      <CardHeader className="border-b border-border/60">
        <CardTitle>Describe the job</CardTitle>
        <CardDescription>
          Required fields are marked with an asterisk (*). Provide clear details for {craftsman.name}.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleCategoryChange(val);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subServiceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Service (Optional)</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        triggerValuesChange(
                          selectedCategoryId,
                          val,
                          form.getValues("title"),
                          form.getValues("address")
                        );
                      }}
                      value={field.value || ""}
                      disabled={availableSubServices.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={availableSubServices.length > 0 ? "Select sub-service" : "No sub-services available"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSubServices.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Fix leaking kitchen pipe"
                      maxLength={100}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        triggerValuesChange(selectedCategoryId, form.getValues("subServiceId"), e.target.value, form.getValues("address"));
                      }}
                    />
                  </FormControl>
                  <FormDescription>Be concise so the craftsman quickly grasps the job.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the problem, the scale of work needed, timing preferences, or access instructions."
                      className="min-h-32 resize-y"
                      maxLength={2000}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between gap-3 text-xs text-muted-foreground">
                    <span>Provide clear specifications.</span>
                    <span>{field.value?.length || 0}/2000</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Address *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Street name, building number, district"
                      maxLength={300}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        triggerValuesChange(selectedCategoryId, form.getValues("subServiceId"), form.getValues("title"), e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>Where the craftsman will perform the work.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 sm:w-auto font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Submit Job Request
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
