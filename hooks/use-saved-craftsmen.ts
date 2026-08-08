"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "ustacik:saved-craftsmen";
const CHANGE_EVENT = "ustacik:saved-craftsmen-change";
const emptySavedIds: string[] = [];

let lastSerializedValue: string | null | undefined;
let lastSnapshot = emptySavedIds;

function parseIds(value: string | null): string[] {
  if (!value) return emptySavedIds;

  try {
    const parsedValue: unknown = JSON.parse(value);
    if (!Array.isArray(parsedValue)) return emptySavedIds;
    return [...new Set(parsedValue.filter((id): id is string => typeof id === "string"))];
  } catch {
    return emptySavedIds;
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return emptySavedIds;

  const currentValue = window.localStorage.getItem(STORAGE_KEY);
  if (currentValue === lastSerializedValue) return lastSnapshot;

  lastSerializedValue = currentValue;
  lastSnapshot = parseIds(currentValue);
  return lastSnapshot;
}

function subscribe(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function saveIds(ids: string[]) {
  const uniqueIds = [...new Set(ids)];
  const serializedIds = JSON.stringify(uniqueIds);
  window.localStorage.setItem(STORAGE_KEY, serializedIds);
  lastSerializedValue = serializedIds;
  lastSnapshot = uniqueIds;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useSavedCraftsmen() {
  const savedIds = useSyncExternalStore(subscribe, getSnapshot, () => emptySavedIds);

  return {
    savedIds,
    isSaved: (craftsmanId: string) => savedIds.includes(craftsmanId),
    toggleSaved: (craftsmanId: string) => {
      const nextIds = savedIds.includes(craftsmanId)
        ? savedIds.filter((id) => id !== craftsmanId)
        : [...savedIds, craftsmanId];
      saveIds(nextIds);
      return nextIds.includes(craftsmanId);
    },
  };
}
