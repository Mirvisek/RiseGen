
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Manually define the default icon to avoid webpack issues with asset imports
const DefaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapInnerProps {
    position: [number, number];
    pinUrl?: string | null;
}

export default function MapInner({ position, pinUrl }: MapInnerProps) {
    const markerIcon = pinUrl ? new L.Icon({
        iconUrl: pinUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
        className: "object-contain bg-transparent"
    }) : DefaultIcon;

    return (
        <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="h-full w-full rounded-xl z-0" style={{ minHeight: "100%", height: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Explicitly pass markerIcon which effectively can never be undefined now */}
            <Marker position={position} icon={markerIcon}>
                <Popup>
                    Tu jesteśmy!
                </Popup>
            </Marker>
        </MapContainer>
    );
}
