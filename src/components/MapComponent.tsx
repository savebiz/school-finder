'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { School } from '@/types';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Locate } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '100%'
};

// Dark Mode Map Style
const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
        },
        {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
        },
        {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
        },
        {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
        },
        {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
        },
    ],
};

interface MapComponentProps {
    schools: School[];
    center: [number, number];
}

const MapComponent: React.FC<MapComponentProps> = ({ schools, center }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY || ''
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    // Sync center when it changes
    React.useEffect(() => {
        if (map) {
            map.panTo({ lat: center[0], lng: center[1] });
        }
    }, [center, map]);

    const mapCenter = useMemo(() => ({ lat: center[0], lng: center[1] }), [center]);

    if (!isLoaded) return <div className="h-full w-full bg-black/90 flex items-center justify-center text-white/50">Loading Google Maps...</div>;

    return (
        <div className="h-full w-full relative">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={13}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={mapOptions}
            >
                {schools.map((school) => (
                    <Marker
                        key={school.id}
                        position={{ lat: school.coordinates.lat, lng: school.coordinates.lng }}
                        title={school.name}
                        // You can add onClick handlers here to open info windows or navigate
                        onClick={() => window.location.href = `/school/${school.id}`}
                    />
                ))}

                <LocateControl map={map} />
            </GoogleMap>
        </div>
    );
};

// Locate Control
function LocateControl({ map }: { map: google.maps.Map | null }) {
    const { location, loading, requestLocation } = useGeolocation();

    React.useEffect(() => {
        if (location && map) {
            map.panTo({ lat: location.lat, lng: location.lng });
            map.setZoom(14);
        }
    }, [location, map]);

    return (
        <div className="absolute bottom-6 right-6 z-10">
            <button
                onClick={requestLocation}
                className="bg-white p-3 hover:bg-gray-100 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
                title="Find Near Me"
            >
                {loading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-emerald-600 rounded-full border-t-transparent"></span>
                ) : (
                    <Locate className="w-5 h-5 text-gray-700" />
                )}
            </button>
        </div>
    );
}

export default MapComponent;
