"use client";

import { useSyncExternalStore } from "react";

import type { Craftsman } from "@/lib/mock-craftsmen";

const STORAGE_KEY = "ustacik:recent-craftsmen";
const CHANGE_EVENT = "ustacik:recent-craftsmen-change";
const emptyRecentCraftsmen: RecentCraftsman[] = [];

export type RecentCraftsman = Craftsman & { viewedAt: string };

let lastSerializedValue: string | null | undefined;
let lastSnapshot = emptyRecentCraftsmen;

function parseRecentCraftsmen(value: string | null): RecentCraftsman[] {
  if (!value) return emptyRecentCraftsmen;

  try {
    const parsedValue: unknown = JSON.parse(value);
    if (!Array.isArray(parsedValue)) return emptyRecentCraftsmen;
    return parsedValue.filter(
      (craftsman): craftsman is RecentCraftsman =>
        typeof craftsman === "object" &&
        craftsman !== null &&
        "id" in craftsman &&
        typeof craftsman.id === "string" &&
        "name" in craftsman &&
        typeof craftsman.name === "string",
    );
  } catch {
    return emptyRecentCraftsmen;
  }
}

function getSnapshot() {
  if (typeof window === "undefined") return emptyRecentCraftsmen;

  const currentValue = window.localStorage.getItem(STORAGE_KEY);
  if (currentValue === lastSerializedValue) return lastSnapshot;

  lastSerializedValue = currentValue;
  lastSnapshot = parseRecentCraftsmen(currentValue);
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

function saveRecentCraftsmen(craftsmen: RecentCraftsman[]) {
  const serializedCraftsmen = JSON.stringify(craftsmen);
  window.localStorage.setItem(STORAGE_KEY, serializedCraftsmen);
  lastSerializedValue = serializedCraftsmen;
  lastSnapshot = craftsmen;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function rememberCraftsman(craftsman: Craftsman) {
  const existingCraftsmen = getSnapshot().filter((item) => item.id !== craftsman.id);
  const nextCraftsmen = [{ ...craftsman, viewedAt: new Date().toISOString() }, ...existingCraftsmen].slice(0, 6);
  saveRecentCraftsmen(nextCraftsmen);
}

export function useRecentCraftsmen() {
  return useSyncExternalStore(subscribe, getSnapshot, () => emptyRecentCraftsmen);
}
