"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Peak } from "@/data/peaks";
import { useConquered } from "@/lib/conquered";
import MapView from "./MapView";
import ProgressSummary from "./ProgressSummary";

type Filter = "all" | "done" | "todo";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Wszystkie" },
  { value: "done", label: "Zdobyte" },
  { value: "todo", label: "Do zdobycia" },
];

export default function Explorer({ peaks }: { peaks: Peak[] }) {
  const { conquered, conquer, unconquer } = useConquered();
  const [selected, setSelected] = useState<string>();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return peaks.filter((p) => {
      if (filter === "done" && !conquered[p.slug]) return false;
      if (filter === "todo" && conquered[p.slug]) return false;
      return !q || p.name.toLowerCase().includes(q) || p.range.toLowerCase().includes(q);
    });
  }, [peaks, conquered, filter, query]);

  const selectedPeak = peaks.find((p) => p.slug === selected);

  return (
    <div className="flex flex-col-reverse lg:h-dvh lg:flex-row">
      <aside className="flex flex-col border-border bg-surface lg:w-96 lg:shrink-0 lg:border-r">
        <header className="space-y-5 border-b border-border p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Korona Gór Polski
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-balance">
              28 szczytów. Ile już masz?
            </h1>
          </div>
          <ProgressSummary peaks={peaks} conquered={conquered} />
        </header>

        <div className="space-y-3 border-b border-border p-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj szczytu lub pasma…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <div className="flex gap-1 rounded-lg bg-background p-1 text-sm">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex-1 rounded-md px-2 py-1.5 transition-colors ${
                  filter === f.value
                    ? "bg-surface-2 text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ol className="flex-1 overflow-y-auto p-2">
          {visible.map((peak) => {
            const date = conquered[peak.slug];
            const rank = peaks.indexOf(peak) + 1;
            return (
              <li key={peak.slug}>
                <button
                  onClick={() => {
                    setSelected(peak.slug);
                    // On mobile the map sits above the list — bring it into view.
                    if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    peak.slug === selected ? "bg-surface-2" : "hover:bg-surface-2/60"
                  }`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums ${
                      date ? "bg-summit text-background" : "border border-border text-muted"
                    }`}
                  >
                    {date ? "✓" : rank}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{peak.name}</span>
                    <span className="block truncate text-xs text-muted">{peak.range}</span>
                  </span>
                  <span className="text-sm tabular-nums text-muted">{peak.height} m</span>
                </button>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="p-6 text-center text-sm text-muted">Brak szczytów dla tego filtra.</li>
          )}
        </ol>
      </aside>

      <section className="relative h-[60vh] shrink-0 lg:h-auto lg:flex-1">
        <MapView
          peaks={peaks}
          conquered={conquered}
          selected={selected}
          onSelect={setSelected}
        />

        {selectedPeak && (
          <div className="absolute inset-x-3 bottom-3 z-[1000] rounded-xl border border-border bg-surface/95 p-4 shadow-2xl backdrop-blur sm:left-auto sm:right-4 sm:bottom-4 sm:w-80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted">{selectedPeak.range}</p>
                <h2 className="text-lg font-semibold">{selectedPeak.name}</h2>
              </div>
              <span className="text-xl font-semibold tabular-nums text-accent">
                {selectedPeak.height}
                <span className="text-sm text-muted"> m</span>
              </span>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-muted">{selectedPeak.description}</p>
            <div className="mt-4 flex gap-2">
              {conquered[selectedPeak.slug] ? (
                <button
                  onClick={() => unconquer(selectedPeak.slug)}
                  className="flex-1 rounded-lg bg-summit/15 px-3 py-2 text-sm font-medium text-summit hover:bg-summit/25"
                  title="Kliknij, aby cofnąć"
                >
                  ✓ Zdobyty{" "}
                  {new Date(conquered[selectedPeak.slug]).toLocaleDateString("pl-PL")}
                </button>
              ) : (
                <button
                  onClick={() => conquer(selectedPeak.slug)}
                  className="flex-1 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-background hover:brightness-110"
                >
                  Oznacz jako zdobyty
                </button>
              )}
              <Link
                href={`/szczyt/${selectedPeak.slug}`}
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-2"
              >
                Szczegóły →
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
