"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Peak } from "@/lib/peaks";
import { useConquered } from "@/lib/conquered";
import MapView from "./MapView";
import ProgressSummary from "./ProgressSummary";

type Filter = "all" | "done" | "todo";

export default function Explorer({ peaks }: { peaks: Peak[] }) {
  const { conquered, conquer, unconquer } = useConquered();
  const [selected, setSelected] = useState<string>();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [celebrating, setCelebrating] = useState<string>();

  const conquerWithCelebration = (slug: string) => {
    conquer(slug);
    setCelebrating(slug);
    setTimeout(() => setCelebrating((current) => (current === slug ? undefined : current)), 2000);
  };

  const doneCount = peaks.filter((p) => conquered[p.slug]).length;
  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "Wszystkie", count: peaks.length },
    { value: "done", label: "Zdobyte", count: doneCount },
    { value: "todo", label: "Do zdobycia", count: peaks.length - doneCount },
  ];

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
      <aside className="flex flex-col border-line lg:w-[26rem] lg:shrink-0 lg:border-r">
        <header className="bg-mint p-6 text-ink">
          <div className="flex items-baseline justify-between">
            <p className="label">Korona Gór Polski</p>
            <p className="label">28 szczytów</p>
          </div>
          <h1 className="mt-6 font-serif text-4xl leading-none italic">Ile już masz?</h1>
          <div className="mt-2">
            <ProgressSummary peaks={peaks} conquered={conquered} />
          </div>
        </header>

        <div className="border-b border-line px-6 pt-5">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj szczytu lub pasma"
            className="w-full border-b border-line bg-transparent pb-2 font-ui text-sm outline-none placeholder:text-muted focus:border-mint"
          />
          <div className="mt-4 flex gap-5">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`label -mb-px border-b-2 pb-3 transition-colors ${
                  filter === f.value
                    ? "border-mint text-paper"
                    : "border-transparent text-muted hover:text-paper"
                }`}
              >
                {f.label} <span className="tabular-nums opacity-60">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        <ol className="peak-scroll flex-1 overflow-y-auto">
          {visible.map((peak) => {
            const isDone = Boolean(conquered[peak.slug]);
            const isSelected = peak.slug === selected;
            const rank = String(peaks.indexOf(peak) + 1).padStart(2, "0");
            return (
              <li key={peak.slug} className="border-b border-line">
                <button
                  onClick={() => {
                    setSelected(peak.slug);
                    // On mobile the map sits above the list — bring it into view.
                    if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-2 px-6 py-3 text-left transition-colors ${
                    isSelected ? "bg-pink text-ink" : "hover:bg-ink-2"
                  }`}
                >
                  <span className={`font-ui text-xs tabular-nums ${isSelected ? "" : "text-muted"}`}>
                    {rank}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 truncate font-serif text-2xl leading-tight">
                      {peak.name}
                      {isDone && (
                        <span
                          className={`size-2 shrink-0 ${isSelected ? "bg-ink" : "bg-pink"}`}
                          aria-label="zdobyty"
                        />
                      )}
                    </span>
                    <span className={`label block truncate ${isSelected ? "" : "text-muted"}`}>
                      {peak.range}
                    </span>
                  </span>
                  <span className="font-ui text-sm tabular-nums">{peak.height}</span>
                </button>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="label p-6 text-muted">Brak szczytów dla tego filtra</li>
          )}
        </ol>
      </aside>

      <section className="relative h-[60vh] shrink-0 lg:h-auto lg:flex-1">
        <MapView
          peaks={peaks}
          conquered={conquered}
          selected={selected}
          onSelect={setSelected}
          celebrating={celebrating}
        />

        {selectedPeak && (
          <article
            key={selectedPeak.slug}
            className="absolute inset-x-3 bottom-3 z-[1000] animate-[card-in_0.4s_ease-out] border border-line bg-ink sm:left-auto sm:right-4 sm:bottom-4 sm:w-80"
          >
            <button
              onClick={() => setSelected(undefined)}
              className="absolute top-0 right-0 z-10 flex size-9 items-center justify-center bg-ink font-ui text-paper hover:bg-pink hover:text-ink"
              aria-label="Zamknij i wróć do widoku Polski"
            >
              ✕
            </button>
            {selectedPeak.image && (
              <div className="relative h-36 bg-mint">
                <Image
                  src={selectedPeak.image.src}
                  alt={selectedPeak.name}
                  fill
                  sizes="320px"
                  className="duotone object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <p className="label text-muted">{selectedPeak.range}</p>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-serif text-3xl leading-tight">{selectedPeak.name}</h2>
                <span className="font-ui text-sm tabular-nums text-mint">
                  {selectedPeak.height} m
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{selectedPeak.description}</p>
            </div>
            <div className="grid grid-cols-[1fr_auto] border-t border-line">
              {conquered[selectedPeak.slug] ? (
                <button
                  onClick={() => unconquer(selectedPeak.slug)}
                  className="label animate-[card-in_0.35s_ease-out] bg-pink px-4 py-3 text-left text-ink hover:brightness-95"
                  title="Kliknij, aby cofnąć"
                >
                  Zdobyty {new Date(conquered[selectedPeak.slug]).toLocaleDateString("pl-PL")}
                </button>
              ) : (
                <button
                  onClick={() => conquerWithCelebration(selectedPeak.slug)}
                  className="label bg-mint px-4 py-3 text-left text-ink hover:brightness-95"
                >
                  Oznacz jako zdobyty
                </button>
              )}
              <Link
                href={`/szczyt/${selectedPeak.slug}`}
                className="label border-l border-line px-4 py-3 hover:bg-ink-2"
              >
                Szczegóły →
              </Link>
            </div>
          </article>
        )}
      </section>
    </div>
  );
}
