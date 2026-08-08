"use client";

import { useSyncExternalStore } from "react";

export type CustomerJob = {
  id: string;
  craftsmanId: string;
  title: string;
  craftsman: string;
  category: string;
  region: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
};

export type JobRequestDraft = {
  subService: string;
  title: string;
  description: string;
  address: string;
  region: string;
  contactPreference: "call" | "sms" | "whatsapp";
  preferredTiming: "flexible" | "weekdays" | "weekend" | "urgent";
  budget: "discuss" | "under-250" | "250-500" | "500-1000" | "1000-plus";
};

const REQUESTS_KEY = "ustacik:local-job-requests";
const DRAFT_PREFIX = "ustacik:job-request-draft:";
const REQUESTS_CHANGE_EVENT = "ustacik:local-job-requests-change";
const emptyRequests: CustomerJob[] = [];

let lastSerializedValue: string | null | undefined;
let lastSnapshot = emptyRequests;

function parseRequests(value: string | null): CustomerJob[] {
  if (!value) return emptyRequests;

  try {
    const parsedValue: unknown = JSON.parse(value);
    if (!Array.isArray(parsedValue)) return emptyRequests;
    return parsedValue.filter(
      (request): request is CustomerJob =>
        typeof request === "object" &&
        request !== null &&
        "id" in request &&
        typeof request.id === "string" &&
        "craftsmanId" in request &&
        typeof request.craftsmanId === "string" &&
        "title" in request &&
        typeof request.title === "string",
    );
  } catch {
    return emptyRequests;
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return emptyRequests;
  const currentValue = window.localStorage.getItem(REQUESTS_KEY);
  if (currentValue === lastSerializedValue) return lastSnapshot;

  lastSerializedValue = currentValue;
  lastSnapshot = parseRequests(currentValue);
  return lastSnapshot;
}

function subscribe(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === REQUESTS_KEY) onStoreChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(REQUESTS_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(REQUESTS_CHANGE_EVENT, onStoreChange);
  };
}

export function useLocalJobRequests() {
  return useSyncExternalStore(subscribe, getSnapshot, () => emptyRequests);
}

export function saveLocalJobRequest(
  request: Omit<CustomerJob, "id" | "status" | "createdAt" | "updatedAt">,
) {
  const createdAt = new Date().toISOString();
  const savedRequest: CustomerJob = {
    ...request,
    id: `local-${crypto.randomUUID()}`,
    status: "PENDING",
    createdAt,
    updatedAt: "Just now",
  };
  const nextRequests = [savedRequest, ...getSnapshot()];
  const serializedRequests = JSON.stringify(nextRequests);
  window.localStorage.setItem(REQUESTS_KEY, serializedRequests);
  lastSerializedValue = serializedRequests;
  lastSnapshot = nextRequests;
  window.dispatchEvent(new Event(REQUESTS_CHANGE_EVENT));
  return savedRequest;
}

export function getJobRequestDraft(craftsmanId: string): Partial<JobRequestDraft> {
  if (typeof window === "undefined") return {};
  try {
    const draft: unknown = JSON.parse(window.localStorage.getItem(`${DRAFT_PREFIX}${craftsmanId}`) ?? "{}");
    return typeof draft === "object" && draft !== null ? draft as Partial<JobRequestDraft> : {};
  } catch {
    return {};
  }
}

export function saveJobRequestDraft(craftsmanId: string, draft: JobRequestDraft) {
  window.localStorage.setItem(`${DRAFT_PREFIX}${craftsmanId}`, JSON.stringify(draft));
}

export function clearJobRequestDraft(craftsmanId: string) {
  window.localStorage.removeItem(`${DRAFT_PREFIX}${craftsmanId}`);
}
