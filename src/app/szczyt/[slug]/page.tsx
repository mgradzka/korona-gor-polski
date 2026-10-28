import ConquerPanel from "@/components/ConquerPanel";
import PeakDescription from "@/components/PeakDescription";
import WeatherPanel from "@/components/WeatherPanel";
import { peakSeeds } from "@/data/peaks";
import { getPeak, getPeaks } from "@/lib/peaks";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return peakSeeds.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const peak = await getPeak((await params).slug);
  return peak
    ? {
        title: `${peak.name} (${peak.height} m) · Korona Gór Polski`,
        description: peak.description.slice(0, 160),
        openGraph: peak.image ? { images: [peak.image.src] } : undefined,
      }
    : {};
}

export default async function PeakPage({ params }: Props) {
  const { slug } = await params;
  const peaks = await getPeaks();
  const peak = peaks.find((p) => p.slug === slug);
  if (!peak) notFound();

  const index = peaks.indexOf(peak);
  const prev = peaks[index - 1];
  const next = peaks[index + 1];

  const rank = (n: number) => String(n).padStart(2, "0");

  return (
    <main>
      <header className="grid md:min-h-136 md:grid-cols-2">
        <div className="flex flex-col justify-between gap-16 bg-mint p-6 text-ink sm:p-10">
          <div className="flex items-baseline justify-between">
            <Link href="/" className="label hover:underline">
              ← Wszystkie szczyty
            </Link>
            <p className="label">
              Nr {rank(index + 1)} / {peaks.length}
            </p>
          </div>
          <div>
            <p className="label">{peak.range}</p>
            <h1 className="mt-2 font-serif text-6xl leading-[0.9] text-balance sm:text-8xl">
              {peak.name}
            </h1>
            <p className="mt-6 flex items-baseline gap-2 border-t border-ink/25 pt-4">
              <span className="font-serif text-5xl leading-none tabular-nums">
                {peak.height}
              </span>
              <span className="label">m n.p.m.</span>
            </p>
          </div>
        </div>
        <div className="relative min-h-72 bg-muted">
          {peak.image && (
            <Image
              src={peak.image.src}
              alt={peak.name}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="duotone object-cover"
            />
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <PeakDescription text={peak.description} sourceUrl={peak.wikiUrl} />
          <aside className="space-y-4">
            <ConquerPanel peak={peak} />
            <dl className="grid grid-cols-2 border border-line">
              <div className="p-4">
                <dt className="label text-muted">Pasmo</dt>
                <dd className="mt-1 font-serif text-xl">{peak.range}</dd>
              </div>
              <div className="border-l border-line p-4">
                <dt className="label text-muted">Współrzędne</dt>
                <dd className="mt-1 font-ui text-xs leading-5 tabular-nums">
                  {peak.coords[0].toFixed(4)}° N
                  <br />
                  {peak.coords[1].toFixed(4)}° E
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <Suspense
          fallback={
            <div className="h-80 animate-pulse border border-line bg-ink-2" />
          }
        >
          <WeatherPanel peak={peak} />
        </Suspense>

        <nav className="grid grid-cols-2 border border-line">
          {prev ? (
            <Link
              href={`/szczyt/${prev.slug}`}
              className="group p-5 hover:bg-ink-2"
            >
              <span className="label text-muted">← Nr {rank(index)}</span>
              <span className="mt-1 block font-serif text-2xl group-hover:text-mint">
                {prev.name}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/szczyt/${next.slug}`}
              className="group border-l border-line p-5 text-right hover:bg-ink-2"
            >
              <span className="label text-muted">Nr {rank(index + 2)} →</span>
              <span className="mt-1 block font-serif text-2xl group-hover:text-mint">
                {next.name}
              </span>
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
