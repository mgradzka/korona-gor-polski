"use client";

import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { Peak } from "@/lib/peaks";
import type { ConqueredMap } from "@/lib/conquered";

type Props = {
  peaks: Peak[];
  conquered: ConqueredMap;
  selected?: string;
  onSelect?: (slug: string) => void;
  /** Peak that was just conquered — gets a one-off ripple animation */
  celebrating?: string;
};

const POLAND_CENTER: [number, number] = [50.4, 18.6];

const rippleIcon = divIcon({
  className: "conquer-ripple",
  html: "<span></span><span></span><span></span>",
  iconSize: [0, 0],
});
const overviewZoom = () => (window.innerWidth < 640 ? 6 : 7);

/** Flies to the selected peak, or back to the whole country when nothing is selected */
function FlyToSelected({ peak }: { peak?: Peak }) {
  const map = useMap();
  useEffect(() => {
    if (peak) map.flyTo(peak.coords, Math.max(map.getZoom(), 9), { duration: 0.8 });
    else map.flyTo(POLAND_CENTER, overviewZoom(), { duration: 0.8 });
  }, [peak, map]);
  return null;
}

export default function PeakMap({ peaks, conquered, selected, onSelect, celebrating }: Props) {
  const selectedPeak = peaks.find((p) => p.slug === selected);
  const celebratedPeak = peaks.find((p) => p.slug === celebrating);

  return (
    <MapContainer
      center={POLAND_CENTER}
      zoom={overviewZoom()}
      minZoom={6}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        maxZoom={17}
      />
      <FlyToSelected peak={selectedPeak} />
      {celebratedPeak && (
        <Marker
          key={celebratedPeak.slug}
          position={celebratedPeak.coords}
          icon={rippleIcon}
          interactive={false}
        />
      )}
      {peaks.map((peak) => {
        const isConquered = Boolean(conquered[peak.slug]);
        const isSelected = peak.slug === selected;
        // Conquered peaks are solid pink, the rest mint outlines (see globals.css palette).
        const color = isConquered ? "#d39ab8" : "#9fd1a0";
        return (
          <CircleMarker
            key={peak.slug}
            center={peak.coords}
            radius={isSelected ? 11 : 7}
            // A dark outline keeps the mint markers readable on green lowlands.
            pathOptions={{
              color: isSelected ? "#edf1e4" : "#1f271c",
              weight: isSelected ? 3 : 2,
              fillColor: color,
              fillOpacity: 1,
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
