
"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

interface ContactMapProps {
    coords: string; // "lat,lng"
    pinUrl?: string | null;
}

export function ContactMap({ coords, pinUrl }: ContactMapProps) {
    // Dynamic import inside component or at top level with ssr: false
    const Map = useMemo(() => dynamic(
        () => import('./MapInner'), // Create a separate inner component for the actual map
        {
            loading: () => <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />,
            ssr: false
        }
    ), []);

    const [latStr, lngStr] = coords.split(",").map(s => s.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
        return <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl px-4 text-center text-sm">Błędny format współrzędnych (oczekiwano "lat, lng")</div>;
    }

    return <Map key={coords} position={[lat, lng]} pinUrl={pinUrl} />;
}
