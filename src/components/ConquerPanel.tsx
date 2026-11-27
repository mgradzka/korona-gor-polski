"use client";

import { useState } from "react";
import type { Peak } from "@/lib/peaks";
import { todayIso, useConquered } from "@/lib/conquered";
import ConquestDateInput from "./ConquestDateInput";

export default function ConquerPanel({ peak }: { peak: Peak }) {
  const { conquered, conquer, unconquer } = useConquered();
  const [date, setDate] = useState(todayIso);
  const conqueredOn = conquered[peak.slug];

  if (conqueredOn) {
    return (
      <div className="flex animate-[card-in_0.4s_ease-out] items-end justify-between gap-4 bg-pink p-5 text-paper">
        <div>
          <p className="label">Zdobyty · data wejścia</p>
          <ConquestDateInput
            value={conqueredOn}
            onChange={(d) => conquer(peak.slug, d)}
            className="mt-1 font-serif text-3xl leading-none"
          />
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
          max={todayIso()}
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
