"use client";

import { useState } from "react";
import type { Peak } from "@/lib/peaks";
import { useConquered } from "@/lib/conquered";

export default function ConquerPanel({ peak }: { peak: Peak }) {
  const { conquered, conquer, unconquer } = useConquered();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const conqueredOn = conquered[peak.slug];

  if (conqueredOn) {
    return (
      <div className="flex animate-[card-in_0.4s_ease-out] items-end justify-between gap-4 bg-pink p-5 text-ink">
        <div>
          <p className="label">Zdobyty</p>
          <p className="mt-1 font-serif text-3xl leading-none">
            {new Date(conqueredOn).toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <button onClick={() => unconquer(peak.slug)} className="label underline hover:no-underline">
          Cofnij
        </button>
      </div>
    );
  }

  return (
    <form
      className="border border-line"
      onSubmit={(e) => {
        e.preventDefault();
        conquer(peak.slug, date);
      }}
    >
      <label className="block p-5">
        <span className="label text-muted">Data wejścia</span>
        <input
          type="date"
          value={date}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-2 block w-full border-b border-line bg-transparent pb-1 font-ui outline-none [color-scheme:dark] focus:border-mint"
        />
      </label>
      <button className="label w-full bg-mint px-5 py-3 text-left text-ink hover:brightness-95">
        Oznacz jako zdobyty →
      </button>
    </form>
  );
}
