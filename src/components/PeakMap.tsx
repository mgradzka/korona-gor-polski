"use client";

import "leaflet/dist/leaflet.css";
import { divIcon, latLngBounds } from "leaflet";
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

/**
 * Flies to the selected peak, or back to the overview when nothing is selected.
 * On phones the overview fits exactly the band of mountains where the peaks are
 * (the whole of Poland leaves them tiny); the top padding keeps them clear of the legend.
 */
function FlyToSelected({ peak, peaks }: { peak?: Peak; peaks: Peak[] }) {
  const map = useMap();
  useEffect(() => {
    if (peak) map.flyTo(peak.coords, Math.max(map.getZoom(), 9), { duration: 0.8 });
    else if (window.innerWidth < 640)
      map.flyToBounds(latLngBounds(peaks.map((p) => p.coords)), {
        paddingTopLeft: [20, 150],
        paddingBottomRight: [20, 20],
        duration: 0.8,
      });
    else map.flyTo(POLAND_CENTER, overviewZoom(), { duration: 0.8 });
  }, [peak, peaks, map]);
  return null;
}

export default function PeakMap({ peaks, conquered, selected, onSelect, celebrating }: Props) {
  const selectedPeak = peaks.find((p) => p.slug === selected);
  const celebratedPeak = peaks.find((p) => p.slug === celebrating);
  // Same rule as the progress squares: only the most recently conquered peak is pink
  // (same tie-break too: on equal dates the later peak in the list wins)
  const latestSlug = peaks
    .filter((p) => conquered[p.slug])
    .reduce<Peak | undefined>(
      (last, p) => (!last || conquered[p.slug] >= conquered[last.slug] ? p : last),
      undefined,
    )?.slug;

  return (
    <MapContainer
      center={POLAND_CENTER}
      zoom={overviewZoom()}
      minZoom={6}
      zoomSnap={0.25}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        maxZoom={17}
      />
      <FlyToSelected peak={selectedPeak} peaks={peaks} />
      {celebratedPeak && (
        <Marker
          key={celebratedPeak.slug}
          position={celebratedPeak.coords}
          icon={rippleIcon}
          interactive={false}
        />
      )}
      {/* "You are here" style halo around the selected peak: an ink ring outside the
          paper ring, readable on both light and dark parts of the map, and it uses no
          marker colour, so it can't be mistaken for "conquered" or "latest" */}
      {selectedPeak && (
        <CircleMarker
          key={`halo-${selectedPeak.slug}`}
          center={selectedPeak.coords}
          radius={15}
          interactive={false}
          pathOptions={{ color: "#1f271c", weight: 3, fill: false }}
        />
      )}
      {peaks.map((peak) => {
        const isConquered = Boolean(conquered[peak.slug]);
        const isSelected = peak.slug === selected;
        // Conquered peaks are solid ink, the latest one pink, the rest mint (see globals.css palette).
        const color = !isConquered ? "#9fd1a0" : peak.slug === latestSlug ? "#c9578a" : "#1f271c";
        return (
          <CircleMarker
            key={peak.slug}
            center={peak.coords}
            radius={isSelected ? 11 : 7}
            // A dark outline keeps the mint markers readable on green lowlands.
            pathOptions={{
              // Selected peak: a paper-coloured inner ring, framed by the ink halo below
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
