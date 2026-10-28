const API = "https://api.open-meteo.com/v1/forecast";
const ONE_HOUR = 60 * 60;

export type DayForecast = {
  date: string;
  code: number;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  precipitationProbability: number;
  windGustsMax: number;
};

export type Forecast = {
  current: {
    temperature: number;
    apparentTemperature: number;
    windSpeed: number;
    windGusts: number;
    code: number;
  };
  days: DayForecast[];
};

const CONDITIONS: [codes: number[], label: string, short: string][] = [
  [[0], "Bezchmurnie", "Słońce"],
  [[1], "Przeważnie słonecznie", "Pogodnie"],
  [[2], "Częściowe zachmurzenie", "Chmury"],
  [[3], "Pochmurno", "Pochmurno"],
  [[45, 48], "Mgła", "Mgła"],
  [[51, 53, 55, 56, 57], "Mżawka", "Mżawka"],
  [[61, 63, 65, 66, 67], "Deszcz", "Deszcz"],
  [[71, 73, 75, 77], "Śnieg", "Śnieg"],
  [[80, 81, 82], "Przelotny deszcz", "Przelotny"],
  [[85, 86], "Przelotny śnieg", "Śnieg"],
  [[95, 96, 99], "Burza", "Burza"],
];

/** Polish full and short labels for a WMO weather code */
export function describeWeather(code: number) {
  const match = CONDITIONS.find(([codes]) => codes.includes(code));
  return { label: match?.[1] ?? "Brak danych", short: match?.[2] ?? "—" };
}

type OpenMeteoResponse = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_gusts_10m_max: number[];
  };
};

export async function getForecast(
  [lat, lon]: [number, number],
  elevation: number,
): Promise<Forecast> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    elevation: String(elevation),
    current:
      "temperature_2m,apparent_temperature,wind_speed_10m,wind_gusts_10m,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_gusts_10m_max",
    timezone: "Europe/Warsaw",
    forecast_days: "7",
  });

  const res = await fetch(`${API}?${params}`, {
    next: { revalidate: ONE_HOUR },
  });
  if (!res.ok) throw new Error(`Open-Meteo: HTTP ${res.status}`);
  const { current, daily }: OpenMeteoResponse = await res.json();

  return {
    current: {
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      windSpeed: current.wind_speed_10m,
      windGusts: current.wind_gusts_10m,
      code: current.weather_code,
    },
    days: daily.time.map((date, i) => ({
      date,
      code: daily.weather_code[i],
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      precipitation: daily.precipitation_sum[i],
      precipitationProbability: daily.precipitation_probability_max[i] ?? 0,
      windGustsMax: daily.wind_gusts_10m_max[i],
    })),
  };
}
