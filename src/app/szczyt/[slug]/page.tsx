import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ConquerPanel from "@/components/ConquerPanel";
import { getPeak, peaks } from "@/data/peaks";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return peaks.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const peak = getPeak((await params).slug);
  return peak
    ? { title: `${peak.name} (${peak.height} m) · Korona Gór Polski`, description: peak.description }
    : {};
}

export default async function PeakPage({ params }: Props) {
  const peak = getPeak((await params).slug);
  if (!peak) notFound();

  const index = peaks.indexOf(peak);
  const prev = peaks[index - 1];
  const next = peaks[index + 1];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← Wszystkie szczyty
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {peak.range} · #{index + 1} w Koronie
          </p>
          <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{peak.name}</h1>
        </div>
        <p className="text-5xl font-semibold tabular-nums">
          {peak.height}
          <span className="text-xl text-muted"> m n.p.m.</span>
        </p>
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <section className="space-y-6">
          <p className="leading-relaxed text-muted">{peak.description}</p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-surface px-4 py-3">
              <dt className="text-xs text-muted">Pasmo</dt>
              <dd className="font-medium">{peak.range}</dd>
            </div>
            <div className="rounded-lg bg-surface px-4 py-3">
              <dt className="text-xs text-muted">Współrzędne</dt>
              <dd className="font-mono text-xs leading-5">
                {peak.coords[0].toFixed(4)}° N, {peak.coords[1].toFixed(4)}° E
              </dd>
            </div>
          </dl>
        </section>
        <ConquerPanel peak={peak} />
      </div>

      <nav className="mt-12 flex justify-between gap-4 border-t border-border pt-6 text-sm">
        {prev ? (
          <Link href={`/szczyt/${prev.slug}`} className="text-muted hover:text-foreground">
            ← {prev.name} <span className="tabular-nums">({prev.height} m)</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/szczyt/${next.slug}`} className="text-right text-muted hover:text-foreground">
            {next.name} <span className="tabular-nums">({next.height} m)</span> →
          </Link>
        )}
      </nav>
    </main>
  );
}
