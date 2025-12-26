
'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';

// Define custom icon logic
const defaultIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});


// Component to handle map center updates
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

const MapComponent = ({ schools, center }: { schools: any[], center: [number, number] }) => {

    return (
        <div className="h-full w-full z-0 relative">
            <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                <ChangeView center={center} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {schools.map((school) => (
                    <Marker
                        key={school.id}
                        position={[school.coordinates.lat, school.coordinates.lng]}
                        icon={defaultIcon}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-sm mb-1">{school.name}</h3>
                                <p className="text-xs text-gray-500">{school.address.lga}</p>
                                <p className="text-xs font-semibold text-emerald-600 mt-1">{school.price_range}</p>
                                <a href={`/school/${school.id}`} className="block mt-2 text-xs text-blue-600 hover:underline">
                                    View Details
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                <LocateControl />
            </MapContainer>
        </div>
    );
};

// Inner component to access map context and handle geolocation
import { useGeolocation } from '@/hooks/useGeolocation';
import { Locate } from 'lucide-react';

function LocateControl() {
    const map = useMap();
    const { location, loading, requestLocation } = useGeolocation();

    useEffect(() => {
        if (location) {
            map.flyTo([location.lat, location.lng], 14);
        }
    }, [location, map]);

    return (
        <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control leaflet-bar">
                <button
                    onClick={requestLocation}
                    className="bg-white p-2 hover:bg-gray-100 flex items-center justify-center w-10 h-10 shadow-md border-2 border-gray-300 rounded-sm"
                    title="Find Near Me"
                >
                    {loading ? <span className="animate-spin h-4 w-4 border-2 border-emerald-600 rounded-full border-t-transparent"></span> : <Locate className="w-5 h-5 text-gray-700" />}
                </button>
            </div>
        </div>
    );
}

export default MapComponent;
