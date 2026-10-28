import type { Peak } from "@/lib/peaks";
import { describeWeather, getForecast } from "@/lib/weather";

const round = (n: number) => Math.round(n);

export default async function WeatherPanel({ peak }: { peak: Peak }) {
  let forecast;
  try {
    forecast = await getForecast(peak.coords, peak.height);
  } catch {
    return (
      <section className="label border border-line p-6 text-muted">
        Nie udało się pobrać prognozy pogody. Spróbuj ponownie za chwilę.
      </section>
    );
  }

  const { current, days } = forecast;

  return (
    <section className="border border-line">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line p-6">
        <div>
          <h2 className="label text-muted">Na szczycie teraz</h2>
          <p className="mt-2 flex items-baseline gap-4">
            <span className="font-serif text-7xl leading-none tabular-nums">
              {round(current.temperature)}°
            </span>
            <span className="font-ui text-sm text-muted">
              {describeWeather(current.code).label}
              <br />
              odczuwalna {round(current.apparentTemperature)}°
            </span>
          </p>
        </div>
        <dl className="font-ui text-sm sm:text-right">
          <dt className="label text-muted">Wiatr</dt>
          <dd className="tabular-nums">
            {round(current.windSpeed)} km/h, porywy {round(current.windGusts)}
          </dd>
        </dl>
      </header>

      <div className="p-6">
        <h3 className="label text-muted">Prognoza · 7 dni</h3>
        <ol className="mt-4 grid grid-cols-2 border-t border-l border-line sm:grid-cols-4 lg:grid-cols-7">
          {days.map((day) => {
            const w = describeWeather(day.code);
            return (
              <li
                key={day.date}
                className="flex flex-col gap-2 border-r border-b border-line p-3"
                title={`${w.label}, opady ${day.precipitation} mm (${day.precipitationProbability}%), porywy do ${round(day.windGustsMax)} km/h`}
              >
                <span className="label text-muted">
                  {new Date(day.date).toLocaleDateString("pl-PL", {
                    weekday: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="font-serif text-3xl leading-none tabular-nums">
                  {round(day.tempMax)}°
                  <span className="text-lg text-muted"> {round(day.tempMin)}°</span>
                </span>
                <span className="font-ui text-xs">{w.short}</span>
                <span className="font-ui text-[11px] leading-4 text-muted tabular-nums">
                  opady {day.precipitationProbability}%
                  <br />
                  wiatr {round(day.windGustsMax)} km/h
                </span>
              </li>
            );
          })}
        </ol>
        <p className="label mt-4 text-muted">
          Prognoza dla {peak.height} m n.p.m. · dane{" "}
          <a href="https://open-meteo.com" className="underline hover:text-paper">
            Open-Meteo
          </a>
        </p>
      </div>
    </section>
  );
}
