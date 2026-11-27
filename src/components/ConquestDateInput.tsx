"use client";

import { todayIso } from "@/lib/conquered";

/**
 * Editable date of a summit, shown once a peak is conquered. Lets the user fix the
 * date when they mark a peak later than the day they climbed it. Future dates are blocked.
 */
export default function ConquestDateInput({
  value,
  onChange,
  className = "",
}: {
  /** ISO date (YYYY-MM-DD) */
  value: string;
  onChange: (date: string) => void;
  className?: string;
}) {
  return (
    <input
      type="date"
      aria-label="Data wejścia"
      value={value}
      max={todayIso()}
      required
      // An empty value comes through while the user is mid-way through typing a date
      onChange={(e) => e.target.value && onChange(e.target.value)}
      className={`cursor-pointer bg-transparent tabular-nums outline-none [color-scheme:dark] focus-visible:underline ${className}`}
    />
  );
}
