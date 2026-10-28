"use client";

import { useSyncExternalStore } from "react";

/** slug → ISO date (YYYY-MM-DD) of the day the peak was conquered */
export type ConqueredMap = Record<string, string>;

const STORAGE_KEY = "kgp:conquered";
const EMPTY: ConqueredMap = {};

const listeners = new Set<() => void>();
let cache: ConqueredMap | null = null;

function read(): ConqueredMap {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    cache = {};
  }
  return cache!;
}

function write(next: ConqueredMap) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode etc.) — keep the in-memory state.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useConquered() {
  const conquered = useSyncExternalStore(subscribe, read, () => EMPTY);

  return {
    conquered,
    conquer: (slug: string, date = new Date().toISOString().slice(0, 10)) =>
      write({ ...read(), [slug]: date }),
    unconquer: (slug: string) => {
      const next = { ...read() };
      delete next[slug];
      write(next);
    },
  };
}
