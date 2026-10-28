import type { ConqueredMap } from "@/lib/conquered";
import type { Peak } from "@/lib/peaks";
import Odometer from "./Odometer";

export default function ProgressSummary({
  peaks,
  conquered,
}: {
  peaks: Peak[];
  conquered: ConqueredMap;
}) {
  const done = peaks.filter((p) => conquered[p.slug]);
  const metres = done.reduce((sum, p) => sum + p.height, 0);
  const highest = done.reduce<Peak | undefined>(
    (best, p) => (!best || p.height > best.height ? p : best),
    undefined,
  );

  return (
    <div className="space-y-5">
      <p className="font-serif leading-none">
        <span className="text-[6rem]">
          <Odometer value={done.length} />
        </span>
        <span className="text-4xl">/{peaks.length}</span>
      </p>

      <ol
        className="grid grid-cols-14 gap-1"
        aria-label="Postęp zdobywania Korony"
      >
        {peaks.map((peak) => (
          <li
            key={peak.slug}
            title={`${peak.name} · ${peak.height} m`}
            className={`aspect-square border border-ink ${
              conquered[peak.slug]
                ? "animate-[square-pop_0.6s_ease-out] bg-pink"
                : ""
            }`}
          />
        ))}
      </ol>

      <dl className="grid grid-cols-2 border-t border-ink/25 pt-3">
        <div>
          <dt className="label opacity-70">Suma wysokości</dt>
          <dd className="font-ui text-sm tabular-nums">
            {metres.toLocaleString("pl-PL")} m
          </dd>
        </div>
        <div>
          <dt className="label opacity-70">Najwyższy zdobyty</dt>
          <dd className="truncate font-ui text-sm">{highest?.name ?? "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
