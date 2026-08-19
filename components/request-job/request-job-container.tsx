"use client";

import { useState } from "react";
import { CraftsmanSummary } from "./craftsman-summary";
import { RequestJobForm } from "./request-job-form";
import { RequestSummary } from "./request-summary";
import { TrustSection } from "./trust-section";

interface CategoryData {
  id: string;
  name: string;
  subServices: { id: string; name: string }[];
}

interface RequestJobContainerProps {
  craftsman: {
    id: string;
    name: string;
    businessName: string | null;
    image: string | null;
    bio: string | null;
    verificationLevel: "REGISTERED" | "VERIFIED" | "APPROVED";
    region: string;
    categories: { id: string; name: string }[];
    subServices: { id: string; name: string }[];
    priceMin: number | null;
    priceMax: number | null;
    totalJobsCompleted: number;
    workmanshipGuarantee: boolean;
  };
  categories: CategoryData[];
}

export function RequestJobContainer({ craftsman, categories }: RequestJobContainerProps) {
  const defaultCatId = craftsman.categories[0]?.id || categories[0]?.id || "";
  const defaultCatName = craftsman.categories[0]?.name || categories[0]?.name || "";

  const [formState, setFormState] = useState<{
    categoryId: string;
    subServiceId?: string;
    title: string;
    address: string;
  }>({
    categoryId: defaultCatId,
    subServiceId: "",
    title: "",
    address: "",
  });

  const currentCategory = categories.find((c) => c.id === formState.categoryId);
  const currentCategoryName = currentCategory?.name || defaultCatName;
  const currentSubService = currentCategory?.subServices.find((s) => s.id === formState.subServiceId);
  const currentSubServiceName = currentSubService?.name;

  return (
    <div className="mt-8 space-y-6">
      <CraftsmanSummary craftsman={craftsman} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <RequestJobForm
            craftsman={{
              id: craftsman.id,
              name: craftsman.name,
              businessName: craftsman.businessName,
              categories: craftsman.categories,
            }}
            categories={categories}
            onValuesChange={setFormState}
          />
          <TrustSection
            hasGuarantee={craftsman.workmanshipGuarantee || craftsman.verificationLevel === "APPROVED"}
            hasBusinessRegistration={craftsman.verificationLevel !== "REGISTERED"}
          />
        </div>
        <aside className="lg:sticky lg:top-24">
          <RequestSummary
            craftsman={{
              name: craftsman.name,
              region: craftsman.region,
              priceMin: craftsman.priceMin,
              priceMax: craftsman.priceMax,
              verificationLevel: craftsman.verificationLevel,
            }}
            selectedCategoryName={currentCategoryName}
            selectedSubServiceName={currentSubServiceName}
            jobTitle={formState.title}
            address={formState.address}
          />
        </aside>
      </div>
    </div>
  );
}
