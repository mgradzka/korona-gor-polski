"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Peak } from "@/lib/peaks";
import ConquestDateInput from "./ConquestDateInput";
import { describeWeather, getForecast, type Forecast } from "@/lib/weather";

type Props = {
  peak: Peak;
  rank: number;
  total: number;
  /** ISO date the peak was conquered on, if it was */
  conqueredOn?: string;
  onConquer: () => void;
  onUnconquer: () => void;
  onChangeDate: (date: string) => void;
  onClose: () => void;
};

// Forecasts already fetched in this session, so reopening a peak is instant.
const forecastCache = new Map<string, Forecast>();

/** Summit weather fetched in the browser (Open-Meteo allows cross-origin requests). */
function useSummitForecast(peak: Peak) {
  const [forecast, setForecast] = useState(() => forecastCache.get(peak.slug));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (forecastCache.has(peak.slug)) return;
    let cancelled = false;
    getForecast(peak.coords, peak.height)
      .then((f) => {
        forecastCache.set(peak.slug, f);
        if (!cancelled) setForecast(f);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [peak]);

  return { forecast, failed };
}

const round = (n: number) => Math.round(n);

/**
 * Full-screen peak view for phones. The moment that matters on a phone is standing
 * on the summit, so the conquer action is a large button and the summit weather sits
 * right under the name. Desktop keeps the small card on the map instead.
 */
export default function MobilePeakSheet({
  peak,
  rank,
  total,
  conqueredOn,
  onConquer,
  onUnconquer,
  onChangeDate,
  onClose,
}: Props) {
  const { forecast, failed } = useSummitForecast(peak);
  const current = forecast?.current;

  return (
    <article
      aria-label={peak.name}
      className="absolute inset-x-0 top-0 bottom-[var(--nav-h)] z-[1200] flex animate-[card-in_0.3s_ease-out] flex-col overflow-y-auto bg-[var(--map-paper)] text-ink lg:hidden"
    >
      <header className="flex items-center justify-between px-5">
        <button onClick={onClose} className="label flex min-h-12 items-center">
          ← Wróć
        </button>
        <span className="label tabular-nums">
          Nr {String(rank).padStart(2, "0")} / {total}
        </span>
      </header>

      <div className="relative h-52 shrink-0 bg-mint">
        {peak.image && (
          <Image
            src={peak.image.src}
            alt={peak.name}
            fill
            sizes="100vw"
            className="duotone object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pt-5 pb-5">
        <div>
          <p className="label">{peak.range}</p>
          <h2 className="font-serif text-6xl leading-none">{peak.name}</h2>
          <p className="font-serif text-2xl italic">{peak.height} m n.p.m.</p>
        </div>

        <dl className="grid grid-cols-3 border-t-2 border-b border-ink">
          <div className="py-2.5">
            <dt className="label">Na szczycie</dt>
            <dd className="font-serif text-2xl tabular-nums">
              {current ? `${round(current.temperature)}°C` : "—"}
            </dd>
          </div>
          <div className="border-l border-ink/30 py-2.5 pl-3">
            <dt className="label">Wiatr</dt>
            <dd className="font-serif text-2xl tabular-nums">
              {current ? round(current.windSpeed) : "—"}
              {current && <span className="text-base"> km/h</span>}
            </dd>
          </div>
          <div className="border-l border-ink/30 py-2.5 pl-3">
            <dt className="label">Pogoda</dt>
            <dd className="font-serif text-2xl">
              {current ? describeWeather(current.code).short : "—"}
            </dd>
          </div>
        </dl>
        <p className="font-ui text-sm text-ink/75">
          {failed
            ? "Nie udało się pobrać pogody. Sprawdź połączenie."
            : `Prognoza dla wysokości szczytu (${peak.height} m), nie dla doliny.`}
        </p>

        <div className="mt-auto flex flex-col gap-2.5">
          {conqueredOn ? (
            <div className="flex min-h-16 animate-[card-in_0.35s_ease-out] items-center justify-between gap-3 bg-pink px-4 py-2 text-paper">
              <div>
                <p className="label text-lg leading-tight">Zdobyty ✓</p>
                <label className="flex items-center gap-2 font-ui text-xs">
                  <span className="opacity-80">Data wejścia:</span>
                  <ConquestDateInput
                    value={conqueredOn}
                    onChange={onChangeDate}
                    className="font-ui text-sm font-medium underline decoration-paper/50 underline-offset-4"
                  />
                </label>
              </div>
              <button onClick={onUnconquer} className="label min-h-11 px-2 underline underline-offset-4">
                Cofnij
              </button>
            </div>
          ) : (
            // Mint = "do zdobycia", same as the map legend and the desktop card; pink is
            // reserved for the conquered state, which this button switches to after the tap.
            <button
              onClick={onConquer}
              className="flex min-h-16 flex-col items-center justify-center border-2 border-ink bg-mint text-ink active:brightness-95"
            >
              <span className="label text-lg">Jestem na szczycie</span>
              <span className="font-ui text-xs opacity-75">oznacz jako zdobyty</span>
            </button>
          )}
          <Link
            href={`/szczyt/${peak.slug}`}
            className="label flex min-h-11 items-center justify-center border border-ink"
          >
            Szczegóły i data wejścia →
          </Link>
        </div>
      </div>
    </article>
  );
}
