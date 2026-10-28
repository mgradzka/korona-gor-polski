export type WikiSummary = {
  title: string;
  extract: string;
  coords?: [number, number];
  image?: { src: string; width: number; height: number };
  url: string;
};

type WikiPage = {
  title: string;
  missing?: boolean;
  extract?: string;
  coordinates?: { lat: number; lon: number }[];
  thumbnail?: { source: string; width: number; height: number };
};

const API = "https://pl.wikipedia.org/w/api.php";
// Wikimedia asks API clients to identify themselves.
const USER_AGENT = "korona-gor-polski/0.1 (portfolio project)";
// MediaWiki returns at most 20 intro extracts per request.
const BATCH_SIZE = 20;
const ONE_DAY = 60 * 60 * 24;

export function wikiUrl(title: string) {
  return `https://pl.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
}

async function fetchBatch(titles: string[]): Promise<WikiPage[]> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    prop: "extracts|pageimages|coordinates",
    exintro: "1",
    explaintext: "1",
    exlimit: "max",
    piprop: "thumbnail",
    pithumbsize: "1200",
    colimit: "max",
    titles: titles.join("|"),
  });

  const res = await fetch(`${API}?${params}`, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: ONE_DAY },
  });
  if (!res.ok) throw new Error(`Wikipedia API: HTTP ${res.status}`);

  const data: { query: { pages: WikiPage[] } } = await res.json();
  return data.query.pages;
}

export async function getWikiSummaries(titles: string[]) {
  const batches: string[][] = [];
  for (let i = 0; i < titles.length; i += BATCH_SIZE) {
    batches.push(titles.slice(i, i + BATCH_SIZE));
  }

  const pages = (await Promise.all(batches.map(fetchBatch))).flat();
  const summaries = new Map<string, WikiSummary>();

  for (const page of pages) {
    if (page.missing) continue;
    const c = page.coordinates?.[0];
    summaries.set(page.title, {
      title: page.title,
      extract: page.extract?.trim() ?? "",
      coords: c ? [c.lat, c.lon] : undefined,
      image: page.thumbnail && {
        src: page.thumbnail.source,
        width: page.thumbnail.width,
        height: page.thumbnail.height,
      },
      url: wikiUrl(page.title),
    });
  }

  return summaries;
}
