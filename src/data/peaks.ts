export type Peak = {
  slug: string;
  name: string;
  /** Height in metres above sea level */
  height: number;
  range: string;
  /** [latitude, longitude] — approximate summit position */
  coords: [number, number];
  description: string;
};

// Official list of the 28 peaks of Korona Gór Polski, ordered by height.
export const peaks: Peak[] = [
  {
    slug: "rysy",
    name: "Rysy",
    height: 2499,
    range: "Tatry",
    coords: [49.1795, 20.0881],
    description:
      "Najwyższy szczyt Polski, leżący na granicy ze Słowacją. Podejście znad Morskiego Oka przez Czarny Staw to klasyka wysokogórskich Tatr, z łańcuchami w górnej części.",
  },
  {
    slug: "babia-gora",
    name: "Babia Góra (Diablak)",
    height: 1725,
    range: "Beskid Żywiecki",
    coords: [49.5731, 19.5294],
    description:
      "Królowa Beskidów, słynąca z kapryśnej pogody i wschodów słońca nad morzem chmur. Najwyższy szczyt Beskidów poza Tatrami.",
  },
  {
    slug: "sniezka",
    name: "Śnieżka",
    height: 1603,
    range: "Karkonosze",
    coords: [50.736, 15.7398],
    description:
      "Najwyższy szczyt Sudetów z charakterystycznym obserwatorium meteorologicznym w kształcie dysków. Z wierzchołka widać pół Dolnego Śląska i Czech.",
  },
  {
    slug: "snieznik",
    name: "Śnieżnik",
    height: 1425,
    range: "Masyw Śnieżnika",
    coords: [50.2073, 16.8477],
    description:
      "Rozległa, łagodna kopuła na granicy z Czechami. Popularny cel zarówno latem, jak i zimą na skiturach.",
  },
  {
    slug: "tarnica",
    name: "Tarnica",
    height: 1346,
    range: "Bieszczady",
    coords: [49.075, 22.7264],
    description:
      "Najwyższy szczyt polskich Bieszczad z krzyżem na wierzchołku i widokiem na połoniny aż po Ukrainę.",
  },
  {
    slug: "turbacz",
    name: "Turbacz",
    height: 1310,
    range: "Gorce",
    coords: [49.5429, 20.1115],
    description:
      "Najwyższy szczyt Gorców, z polanami pełnymi szałasów i schroniskiem tuż pod wierzchołkiem. Przy dobrej widoczności panorama Tatr.",
  },
  {
    slug: "radziejowa",
    name: "Radziejowa",
    height: 1266,
    range: "Beskid Sądecki",
    coords: [49.4494, 20.6043],
    description:
      "Najwyższy szczyt Beskidu Sądeckiego z wieżą widokową wystającą ponad las.",
  },
  {
    slug: "skrzyczne",
    name: "Skrzyczne",
    height: 1257,
    range: "Beskid Śląski",
    coords: [49.6844, 19.0303],
    description:
      "Najwyższy szczyt Beskidu Śląskiego nad Szczyrkiem, z masztem RTV i schroniskiem. Zimą centrum narciarskie.",
  },
  {
    slug: "mogielica",
    name: "Mogielica",
    height: 1170,
    range: "Beskid Wyspowy",
    coords: [49.6551, 20.276],
    description:
      "Najwyższa z „wysp” Beskidu Wyspowego. Wieża widokowa na polanie Stumorgowej odsłania panoramę od Tatr po Babią Górę.",
  },
  {
    slug: "wysoka-kopa",
    name: "Wysoka Kopa",
    height: 1126,
    range: "Góry Izerskie",
    coords: [50.8496, 15.4231],
    description:
      "Najwyższy szczyt polskiej części Gór Izerskich, wznoszący się nad dawną kopalnią kwarcu Stanisław.",
  },
  {
    slug: "rudawiec",
    name: "Rudawiec",
    height: 1106,
    range: "Góry Bialskie",
    coords: [50.2441, 16.9759],
    description:
      "Zalesiony, spokojny szczyt na granicy z Czechami. Jedno z najmniej uczęszczanych miejsc w Koronie.",
  },
  {
    slug: "orlica",
    name: "Orlica",
    height: 1084,
    range: "Góry Orlickie",
    coords: [50.3531, 16.3602],
    description:
      "Najwyższy szczyt polskiej części Gór Orlickich, z łagodnym podejściem z Zieleńca.",
  },
  {
    slug: "wysoka",
    name: "Wysoka (Wysokie Skałki)",
    height: 1050,
    range: "Pieniny",
    coords: [49.3802, 20.5549],
    description:
      "Najwyższy szczyt Pienin z widokiem na Tatry i wąwóz Homole u podnóża.",
  },
  {
    slug: "wielka-sowa",
    name: "Wielka Sowa",
    height: 1015,
    range: "Góry Sowie",
    coords: [50.6803, 16.4854],
    description:
      "Najwyższy szczyt Gór Sowich z kamienną wieżą widokową. W okolicy podziemne kompleksy projektu Riese.",
  },
  {
    slug: "lackowa",
    name: "Lackowa",
    height: 997,
    range: "Beskid Niski",
    coords: [49.4281, 21.0962],
    description:
      "Najwyższy szczyt Beskidu Niskiego, znany z jednego z najbardziej stromych podejść na Głównym Szlaku Beskidzkim.",
  },
  {
    slug: "kowadlo",
    name: "Kowadło",
    height: 989,
    range: "Góry Złote",
    coords: [50.2656, 17.0128],
    description:
      "Graniczny szczyt Gór Złotych nad Bielicami, pośród lasów i dawnych szlaków górniczych.",
  },
  {
    slug: "jagodna",
    name: "Jagodna",
    height: 977,
    range: "Góry Bystrzyckie",
    coords: [50.2532, 16.5642],
    description:
      "Najwyższy szczyt Gór Bystrzyckich z wieżą widokową na Kotlinę Kłodzką.",
  },
  {
    slug: "skalnik",
    name: "Skalnik",
    height: 945,
    range: "Rudawy Janowickie",
    coords: [50.8086, 15.9011],
    description:
      "Najwyższy punkt Rudaw Janowickich, otoczony granitowymi skałkami popularnymi wśród wspinaczy.",
  },
  {
    slug: "waligora",
    name: "Waligóra",
    height: 936,
    range: "Góry Kamienne",
    coords: [50.6811, 16.2781],
    description:
      "Stromy, zalesiony stożek nad przełęczą Trzech Dolin i schroniskiem Andrzejówka.",
  },
  {
    slug: "czupel",
    name: "Czupel",
    height: 930,
    range: "Beskid Mały",
    coords: [49.7681, 19.1602],
    description:
      "Najwyższy szczyt Beskidu Małego, łatwo dostępny z Międzybrodzia i okolic Jeziora Żywieckiego.",
  },
  {
    slug: "szczeliniec-wielki",
    name: "Szczeliniec Wielki",
    height: 919,
    range: "Góry Stołowe",
    coords: [50.4857, 16.3391],
    description:
      "Skalny labirynt na płaskowyżu Gór Stołowych, z ponad 600 schodami prowadzącymi z Karłowa na taras widokowy.",
  },
  {
    slug: "lubomir",
    name: "Lubomir",
    height: 904,
    range: "Beskid Makowski",
    coords: [49.767, 20.0594],
    description:
      "Szczyt z historycznym obserwatorium astronomicznym na wierzchołku, w sercu Beskidu Makowskiego.",
  },
  {
    slug: "biskupia-kopa",
    name: "Biskupia Kopa",
    height: 890,
    range: "Góry Opawskie",
    coords: [50.2561, 17.4283],
    description:
      "Graniczny szczyt nad Jarnołtówkiem z kamienną wieżą widokową po czeskiej stronie.",
  },
  {
    slug: "chelmiec",
    name: "Chełmiec",
    height: 851,
    range: "Góry Wałbrzyskie",
    coords: [50.7792, 16.2112],
    description:
      "Charakterystyczny stożek nad Wałbrzychem z wysokim krzyżem i masztem nadajnika.",
  },
  {
    slug: "klodzka-gora",
    name: "Kłodzka Góra",
    height: 765,
    range: "Góry Bardzkie",
    coords: [50.4561, 16.7579],
    description:
      "Najwyższy szczyt Gór Bardzkich, z metalową wieżą widokową wśród lasów nad Kotliną Kłodzką.",
  },
  {
    slug: "skopiec",
    name: "Skopiec",
    height: 724,
    range: "Góry Kaczawskie",
    coords: [50.9431, 15.8241],
    description:
      "Najwyższy szczyt Gór Kaczawskich, położony w krainie wygasłych wulkanów.",
  },
  {
    slug: "sleza",
    name: "Ślęża",
    height: 718,
    range: "Masyw Ślęży",
    coords: [50.8651, 16.7089],
    description:
      "Święta góra dawnych Ślężan, samotnie wyrastająca z równiny pod Wrocławiem. Na szczycie kościół i wieża RTV.",
  },
  {
    slug: "lysica",
    name: "Łysica",
    height: 614,
    range: "Góry Świętokrzyskie",
    coords: [50.8923, 20.8972],
    description:
      "Najwyższy szczyt Gór Świętokrzyskich, otoczony gołoborzami w Świętokrzyskim Parku Narodowym.",
  },
];

export function getPeak(slug: string) {
  return peaks.find((p) => p.slug === slug);
}
