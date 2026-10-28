"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./PeakMap"), {
  ssr: false,
  loading: () => (
    <div className="label flex h-full w-full items-center justify-center bg-ink-2 text-muted">
      Ładowanie mapy
    </div>
  ),
});

export default MapView;
