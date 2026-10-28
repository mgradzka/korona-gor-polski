"use client";

import { useState } from "react";
import type { Peak } from "@/data/peaks";
import { useConquered } from "@/lib/conquered";
import MapView from "./MapView";

export default function ConquerPanel({ peak }: { peak: Peak }) {
  const { conquered, conquer, unconquer } = useConquered();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const conqueredOn = conquered[peak.slug];

  return (
    <div className="space-y-4">
      <div className="h-64 overflow-hidden rounded-xl border border-border">
        <MapView
          peaks={[peak]}
          conquered={conquered}
          selected={peak.slug}
          focus={{ coords: peak.coords, zoom: 11 }}
        />
      </div>

      <div className="rounded-xl border border-border bg-surface p-5">
        {conqueredOn ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Zdobyty</p>
              <p className="text-lg font-semibold text-summit">
                {new Date(conqueredOn).toLocaleDateString("pl-PL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={() => unconquer(peak.slug)}
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-foreground"
            >
              Cofnij
            </button>
          </div>
        ) : (
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              conquer(peak.slug, date);
            }}
          >
            <label className="flex-1 text-sm">
              <span className="mb-1 block text-muted">Data wejścia</span>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 [color-scheme:dark]"
              />
            </label>
            <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background hover:brightness-110">
              Oznacz jako zdobyty
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
