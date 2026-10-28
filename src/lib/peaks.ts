import { peakSeeds, type PeakSeed } from "@/data/peaks";
import { cache } from "react";
import { getWikiSummaries, type WikiSummary } from "./wikipedia";

export type Peak = PeakSeed & {
  /** [latitude, longitude] of the summit, from Wikipedia */
  coords: [number, number];
  description: string;
  image?: WikiSummary["image"];
  wikiUrl: string;
};

export const getPeaks = cache(async (): Promise<Peak[]> => {
  const summaries = await getWikiSummaries(peakSeeds.map((p) => p.wikiTitle));

  return peakSeeds.flatMap((seed) => {
    const wiki = summaries.get(seed.wikiTitle);
    if (!wiki?.coords) return [];
    return [
      {
        ...seed,
        coords: wiki.coords,
        description: wiki.extract,
        image: wiki.image,
        wikiUrl: wiki.url,
      },
    ];
  });
});

export async function getPeak(slug: string) {
  return (await getPeaks()).find((p) => p.slug === slug);
}
