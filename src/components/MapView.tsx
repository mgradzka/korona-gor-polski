"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` on import, so the map is only rendered in the browser.
const MapView = dynamic(() => import("./PeakMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface text-sm text-muted">
      Ładowanie mapy…
    </div>
  ),
});

export default MapView;
