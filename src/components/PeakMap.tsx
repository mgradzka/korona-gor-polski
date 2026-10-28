"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { Peak } from "@/data/peaks";
import type { ConqueredMap } from "@/lib/conquered";

type Props = {
  peaks: Peak[];
  conquered: ConqueredMap;
  selected?: string;
  onSelect?: (slug: string) => void;
  /** Fixed center/zoom for single-peak maps; otherwise the map fits Poland */
  focus?: { coords: [number, number]; zoom: number };
  interactive?: boolean;
};

const POLAND_CENTER: [number, number] = [50.4, 18.6];

function FlyToSelected({ peak }: { peak?: Peak }) {
  const map = useMap();
  useEffect(() => {
    if (peak) map.flyTo(peak.coords, Math.max(map.getZoom(), 9), { duration: 0.8 });
  }, [peak, map]);
  return null;
}

export default function PeakMap({
  peaks,
  conquered,
  selected,
  onSelect,
  focus,
  interactive = true,
}: Props) {
  const selectedPeak = peaks.find((p) => p.slug === selected);

  return (
    <MapContainer
      center={focus?.coords ?? POLAND_CENTER}
      zoom={focus?.zoom ?? (window.innerWidth < 640 ? 6 : 7)}
      minZoom={6}
      scrollWheelZoom={interactive}
      dragging={interactive}
      zoomControl={interactive}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        maxZoom={17}
      />
      {!focus && <FlyToSelected peak={selectedPeak} />}
      {peaks.map((peak) => {
        const isConquered = Boolean(conquered[peak.slug]);
        const isSelected = peak.slug === selected;
        const color = isConquered ? "#34d399" : "#f2a541";
        return (
          <CircleMarker
            key={peak.slug}
            center={peak.coords}
            radius={isSelected ? 11 : 7}
            pathOptions={{
              color: isSelected ? "#ffffff" : color,
              weight: isSelected ? 3 : 2,
              fillColor: color,
              fillOpacity: isConquered ? 0.9 : 0.35,
            }}
            eventHandlers={{ click: () => onSelect?.(peak.slug) }}
          >
            <Tooltip direction="top" offset={[0, -8]} className="peak-tooltip">
              <strong>{peak.name}</strong> · {peak.height} m
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
