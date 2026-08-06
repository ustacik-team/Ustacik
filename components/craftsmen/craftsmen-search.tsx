// components/craftsmen/craftsmen-search.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Controlled / Uncontrolled state hook ──────────────────────────────
function useControlledState<T>(
  controlled: T | undefined,
  defaultValue: T
): [T, (value: T) => void] {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : uncontrolled;
  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setUncontrolled(newValue);
      }
    },
    [isControlled]
  );
  return [value, setValue];
}

interface CraftsmenSearchProps {
  /** Optional external value for controlled usage */
  value?: string;
  /** Callback fired when the search query changes (debounced) */
  onSearch?: (query: string) => void;
  /** Placeholder text (default: "Search by craftsman or business...") */
  placeholder?: string;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
}

export function CraftsmenSearch({
  value: externalValue,
  onSearch,
  placeholder = "Search by craftsman or business...",
  debounceMs = 300,
}: CraftsmenSearchProps) {
  // Use the custom hook – no extra useEffect needed
  const [value, setValue] = useControlledState(externalValue, "");
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Debounce the current value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  // Notify parent when debounced value changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    [setValue]
  );

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full pl-9 pr-4 py-2 rounded-lg border-border bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
        aria-label="Search craftsmen"
      />
    </div>
  );
}