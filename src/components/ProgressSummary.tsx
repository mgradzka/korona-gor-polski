import type { Peak } from "@/data/peaks";
import type { ConqueredMap } from "@/lib/conquered";

export default function ProgressSummary({
  peaks,
  conquered,
}: {
  peaks: Peak[];
  conquered: ConqueredMap;
}) {
  const done = peaks.filter((p) => conquered[p.slug]);
  const percent = Math.round((done.length / peaks.length) * 100);
  const metres = done.reduce((sum, p) => sum + p.height, 0);
  const highest = done.reduce<Peak | undefined>(
    (best, p) => (!best || p.height > best.height ? p : best),
    undefined,
  );

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-semibold tabular-nums">
          {done.length}
          <span className="text-muted">/{peaks.length}</span>
        </span>
        <span className="text-sm text-muted">{percent}% Korony</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuenow={done.length}
        aria-valuemin={0}
        aria-valuemax={peaks.length}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-summit transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <dt className="text-xs text-muted">Suma wysokości</dt>
          <dd className="font-medium tabular-nums">
            {metres.toLocaleString("pl-PL")} m
          </dd>
        </div>
        <div className="rounded-lg bg-surface-2 px-3 py-2">
          <dt className="text-xs text-muted">Najwyższy zdobyty</dt>
          <dd className="truncate font-medium">{highest?.name ?? "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
