/**
 * The official list of the 28 peaks of Korona Gór Polski, ordered by height.
 * There is no API for the list itself, so this seed is the only hand-kept data —
 * descriptions, photos and coordinates come from Wikipedia (see lib/peaks.ts).
 */
export type PeakSeed = {
  slug: string;
  name: string;
  height: number;
  range: string;
  wikiTitle: string;
};

export const peakSeeds: PeakSeed[] = [
  {
    slug: "rysy",
    name: "Rysy",
    height: 2499,
    range: "Tatry",
    wikiTitle: "Rysy",
  },
  {
    slug: "babia-gora",
    name: "Babia Góra (Diablak)",
    height: 1725,
    range: "Beskid Żywiecki",
    wikiTitle: "Babia Góra",
  },
  {
    slug: "sniezka",
    name: "Śnieżka",
    height: 1603,
    range: "Karkonosze",
    wikiTitle: "Śnieżka",
  },
  {
    slug: "snieznik",
    name: "Śnieżnik",
    height: 1425,
    range: "Masyw Śnieżnika",
    wikiTitle: "Śnieżnik (góra)",
  },
  {
    slug: "tarnica",
    name: "Tarnica",
    height: 1346,
    range: "Bieszczady",
    wikiTitle: "Tarnica",
  },
  {
    slug: "turbacz",
    name: "Turbacz",
    height: 1310,
    range: "Gorce",
    wikiTitle: "Turbacz",
  },
  {
    slug: "radziejowa",
    name: "Radziejowa",
    height: 1266,
    range: "Beskid Sądecki",
    wikiTitle: "Radziejowa",
  },
  {
    slug: "skrzyczne",
    name: "Skrzyczne",
    height: 1257,
    range: "Beskid Śląski",
    wikiTitle: "Skrzyczne",
  },
  {
    slug: "mogielica",
    name: "Mogielica",
    height: 1170,
    range: "Beskid Wyspowy",
    wikiTitle: "Mogielica",
  },
  {
    slug: "wysoka-kopa",
    name: "Wysoka Kopa",
    height: 1126,
    range: "Góry Izerskie",
    wikiTitle: "Wysoka Kopa",
  },
  {
    slug: "rudawiec",
    name: "Rudawiec",
    height: 1106,
    range: "Góry Bialskie",
    wikiTitle: "Rudawiec (szczyt)",
  },
  {
    slug: "orlica",
    name: "Orlica",
    height: 1084,
    range: "Góry Orlickie",
    wikiTitle: "Orlica (szczyt)",
  },
  {
    slug: "wysoka",
    name: "Wysoka (Wysokie Skałki)",
    height: 1050,
    range: "Pieniny",
    wikiTitle: "Wysokie Skałki",
  },
  {
    slug: "wielka-sowa",
    name: "Wielka Sowa",
    height: 1015,
    range: "Góry Sowie",
    wikiTitle: "Wielka Sowa",
  },
  {
    slug: "lackowa",
    name: "Lackowa",
    height: 997,
    range: "Beskid Niski",
    wikiTitle: "Lackowa",
  },
  {
    slug: "kowadlo",
    name: "Kowadło",
    height: 989,
    range: "Góry Złote",
    wikiTitle: "Kowadło (szczyt)",
  },
  {
    slug: "jagodna",
    name: "Jagodna",
    height: 977,
    range: "Góry Bystrzyckie",
    wikiTitle: "Jagodna (Góry Bystrzyckie)",
  },
  {
    slug: "skalnik",
    name: "Skalnik",
    height: 945,
    range: "Rudawy Janowickie",
    wikiTitle: "Skalnik (Rudawy Janowickie)",
  },
  {
    slug: "waligora",
    name: "Waligóra",
    height: 936,
    range: "Góry Kamienne",
    wikiTitle: "Waligóra",
  },
  {
    slug: "czupel",
    name: "Czupel",
    height: 930,
    range: "Beskid Mały",
    wikiTitle: "Czupel (931 m)",
  },
  {
    slug: "szczeliniec-wielki",
    name: "Szczeliniec Wielki",
    height: 919,
    range: "Góry Stołowe",
    wikiTitle: "Szczeliniec Wielki",
  },
  {
    slug: "lubomir",
    name: "Lubomir",
    height: 904,
    range: "Beskid Makowski",
    wikiTitle: "Lubomir (szczyt)",
  },
  {
    slug: "biskupia-kopa",
    name: "Biskupia Kopa",
    height: 890,
    range: "Góry Opawskie",
    wikiTitle: "Biskupia Kopa",
  },
  {
    slug: "chelmiec",
    name: "Chełmiec",
    height: 851,
    range: "Góry Wałbrzyskie",
    wikiTitle: "Chełmiec (szczyt)",
  },
  {
    slug: "klodzka-gora",
    name: "Kłodzka Góra",
    height: 765,
    range: "Góry Bardzkie",
    wikiTitle: "Kłodzka Góra",
  },
  {
    slug: "skopiec",
    name: "Skopiec",
    height: 724,
    range: "Góry Kaczawskie",
    wikiTitle: "Skopiec",
  },
  {
    slug: "sleza",
    name: "Ślęża",
    height: 718,
    range: "Masyw Ślęży",
    wikiTitle: "Ślęża",
  },
  {
    slug: "lysica",
    name: "Łysica",
    height: 614,
    range: "Góry Świętokrzyskie",
    wikiTitle: "Łysica (Góry Świętokrzyskie)",
  },
];
