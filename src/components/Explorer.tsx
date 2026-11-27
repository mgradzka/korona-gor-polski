"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Peak } from "@/lib/peaks";
import { useConquered } from "@/lib/conquered";
import ConquestDateInput from "./ConquestDateInput";
import MapView from "./MapView";
import MobilePeakSheet from "./MobilePeakSheet";
import ProgressSummary from "./ProgressSummary";

type Filter = "all" | "done" | "todo";

const HINT_KEY = "kgp:map-hint-seen";

/** Views of the bottom navigation on phones. On desktop everything is visible at once. */
type Tab = "map" | "list" | "progress";

const TABS: { value: Tab; label: string; icon: React.ReactNode }[] = [
  {
    value: "map",
    label: "Mapa",
    icon: (
      <>
        <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
        <path d="M9 4v14M15 6v14" />
      </>
    ),
  },
  { value: "list", label: "Szczyty", icon: <path d="M2 20l7-12 4 6 3-4 6 10z" /> },
  {
    value: "progress",
    label: "Postęp",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
  },
];

export default function Explorer({ peaks }: { peaks: Peak[] }) {
  const { conquered, conquer, unconquer } = useConquered();
  const [selected, setSelected] = useState<string>();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [celebrating, setCelebrating] = useState<string>();
  const [tab, setTab] = useState<Tab>("map");
  // First-visit hint on the phone map. Read from storage after mount (not during render)
  // so the server-rendered HTML and the first client render match.
  const [showHint, setShowHint] = useState(false);
  useEffect(() => {
    try {
      setShowHint(!localStorage.getItem(HINT_KEY));
    } catch {
      // Storage unavailable: just skip the hint.
    }
  }, []);
  const dismissHint = () => {
    setShowHint(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      // Storage unavailable: the hint just comes back next visit.
    }
  };
  // Opening a peak for the first time means the hint has done its job.
  const openPeak = (slug: string) => {
    setSelected(slug);
    if (showHint) dismissHint();
  };

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

  // Phone layout: the map always stays mounted underneath (Leaflet breaks when it is
  // hidden with display:none), and the list / progress views are panels laid over it.
  // From lg up these classes fall back to the side-by-side desktop layout.
  return (
    <div className="relative h-dvh overflow-hidden lg:flex lg:flex-row">
      <aside
        className={`${tab === "map" ? "hidden" : "flex"} absolute inset-x-0 top-0 bottom-[var(--nav-h)] z-[1100] flex-col overflow-y-auto bg-ink lg:static lg:z-auto lg:flex lg:w-[26rem] lg:shrink-0 lg:overflow-visible lg:border-r lg:border-line`}
      >
        <header
          className={`${tab === "progress" ? "block flex-1" : "hidden"} bg-mint p-6 text-ink lg:block lg:flex-none`}
        >
          <div className="flex items-baseline justify-between">
            <p className="label">Korona Gór Polski</p>
            <p className="label">Nr 01 · 28 szczytów</p>
          </div>
          {/* Double rule under the masthead, like the header of an old magazine */}
          <div className="mt-3 h-[5px] border-t-2 border-b border-ink" aria-hidden="true" />
          <h1 className="mt-6 font-serif text-4xl leading-none italic">Ile już masz?</h1>
          <div className="mt-2">
            <ProgressSummary peaks={peaks} conquered={conquered} />
          </div>
        </header>

        <div className={`${tab === "list" ? "flex" : "hidden"} min-h-0 flex-1 flex-col lg:flex`}>
          <div className="border-b border-line px-6 pt-5">
            <label className="block font-ui text-sm text-muted">
              Szukaj szczytu lub pasma
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="np. Tatry"
                className="mt-2 block w-full border-b border-line bg-transparent pb-2 font-ui text-sm text-paper outline-none placeholder:text-muted/60 focus:border-mint"
              />
            </label>
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
                    onClick={() => openPeak(peak.slug)}
                    className={`grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-2 px-6 py-3 text-left transition-colors ${
                      isSelected ? "bg-pink text-paper" : "hover:bg-ink-2"
                    }`}
                  >
                    <span className={`font-condensed text-sm tabular-nums ${isSelected ? "" : "text-muted"}`}>
                      {rank}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 truncate font-serif text-2xl leading-tight">
                        {peak.name}
                        {isDone && (
                          <span
                            className={`size-2 shrink-0 ${isSelected ? "bg-paper" : "bg-pink"}`}
                            aria-label="zdobyty"
                          />
                        )}
                      </span>
                      <span className={`label block truncate ${isSelected ? "" : "text-muted"}`}>
                        {peak.range}
                      </span>
                    </span>
                    <span className="font-condensed text-lg font-semibold tabular-nums">{peak.height}</span>
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && (
              <li className="label p-6 text-muted">Brak szczytów dla tego filtra</li>
            )}
          </ol>
        </div>
      </aside>

      <section className="absolute inset-x-0 top-0 bottom-[var(--nav-h)] lg:relative lg:inset-auto lg:flex-1">
        <MapView
          peaks={peaks}
          conquered={conquered}
          selected={selected}
          onSelect={openPeak}
          celebrating={celebrating}
        />

        {/* Phone-only masthead over the map, so the first screen says what the app is
            and how far you are. The counter jumps to the Postęp tab. */}
        <header className="absolute inset-x-0 top-0 z-[1000] h-14 bg-mint px-4 pt-2.5 text-ink lg:hidden">
          <div className="flex items-center justify-between">
            <p className="label">Korona Gór Polski</p>
            <button
              onClick={() => setTab("progress")}
              className="label -my-2 flex min-h-11 items-center gap-1.5 tabular-nums"
              aria-label={`Zdobyte ${doneCount} z ${peaks.length}, pokaż postęp`}
            >
              <span className="font-serif text-xl tracking-normal normal-case">
                {String(doneCount).padStart(2, "0")}
              </span>
              / {peaks.length} →
            </button>
          </div>
          <div className="mt-1.5 h-[5px] border-t-2 border-b border-ink" aria-hidden="true" />
        </header>

        {showHint && (
          <div className="absolute inset-x-3 bottom-7 z-[1000] flex animate-[card-in_0.4s_ease-out] items-start gap-3 border border-ink bg-ink p-4 text-paper lg:hidden">
            <p className="flex-1 font-ui text-sm leading-snug">
              Dotknij szczyt na mapie, żeby zobaczyć pogodę na szczycie i oznaczyć zdobycie.
            </p>
            <button
              onClick={dismissHint}
              aria-label="Zamknij podpowiedź"
              className="-m-2 flex size-11 shrink-0 items-center justify-center font-ui"
            >
              ✕
            </button>
          </div>
        )}

        {/* Map legend, styled like the key on an old printed map. Compact on phones,
            where it sits under the masthead. */}
        <dl
          aria-label="Legenda mapy"
          className="pointer-events-none absolute top-[4.25rem] right-3 lg:top-3 z-[1000] space-y-1 border border-ink bg-[var(--map-paper)] px-2.5 py-2 text-ink lg:space-y-1.5 lg:px-3 lg:py-2.5"
        >
          <dt className="label hidden lg:block">Legenda</dt>
          <dd className="label flex items-center gap-2 font-medium">
            <span className="size-3 shrink-0 rounded-full border-2 border-ink bg-mint" aria-hidden="true" />
            Do zdobycia
          </dd>
          <dd className="label flex items-center gap-2 font-medium">
            <span className="size-3 shrink-0 rounded-full border-2 border-ink bg-ink" aria-hidden="true" />
            Zdobyty
          </dd>
          <dd className="label flex items-center gap-2 font-medium">
            <span className="size-3 shrink-0 rounded-full border-2 border-ink bg-pink" aria-hidden="true" />
            Ostatnio zdobyty
          </dd>
        </dl>

        {selectedPeak && (
          <article
            key={selectedPeak.slug}
            className="absolute right-4 bottom-4 z-[1000] hidden w-80 animate-[card-in_0.4s_ease-out] border border-line bg-ink lg:block"
          >
            <button
              onClick={() => setSelected(undefined)}
              className="absolute top-0 right-0 z-10 flex size-9 items-center justify-center bg-ink font-ui text-paper hover:bg-pink hover:text-paper"
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
                <div className="flex animate-[card-in_0.35s_ease-out] items-center justify-between gap-2 bg-pink px-4 py-2 text-paper">
                  <ConquestDateInput
                    value={conquered[selectedPeak.slug]}
                    onChange={(date) => conquer(selectedPeak.slug, date)}
                    className="font-condensed text-sm font-semibold tracking-wider"
                  />
                  <button
                    onClick={() => unconquer(selectedPeak.slug)}
                    className="label underline underline-offset-4 hover:no-underline"
                  >
                    Cofnij
                  </button>
                </div>
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

      {selectedPeak && (
        <MobilePeakSheet
          key={selectedPeak.slug}
          peak={selectedPeak}
          rank={peaks.indexOf(selectedPeak) + 1}
          total={peaks.length}
          conqueredOn={conquered[selectedPeak.slug]}
          onConquer={() => conquerWithCelebration(selectedPeak.slug)}
          onUnconquer={() => unconquer(selectedPeak.slug)}
          onChangeDate={(date) => conquer(selectedPeak.slug, date)}
          onClose={() => setSelected(undefined)}
        />
      )}

      <nav
        aria-label="Widoki"
        className="absolute inset-x-0 bottom-0 z-[1300] grid h-[var(--nav-h)] grid-cols-3 border-t border-line bg-ink pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {TABS.map((t) => {
          const active = tab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => {
                setTab(t.value);
                setSelected(undefined);
              }}
              aria-current={active ? "page" : undefined}
              className={`label flex flex-col items-center justify-center gap-1 ${
                active ? "text-mint" : "text-paper"
              }`}
            >
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              >
                {t.icon}
              </svg>
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
