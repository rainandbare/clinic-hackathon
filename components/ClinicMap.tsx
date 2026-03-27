"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Coordinates, ScoredClinic, TravelMethod } from "@/types";
import { useEffect, useState } from "react";
import { fetchRoute, type RouteResult } from "@/lib/routing";

const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const clinicIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitToRoute({
  userLocation,
  clinic,
  routeCoords,
}: {
  userLocation: Coordinates;
  clinic: ScoredClinic;
  routeCoords: [number, number][] | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      const bounds = L.latLngBounds(
        [userLocation.lat, userLocation.lng],
        [clinic.lat, clinic.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, userLocation, clinic, routeCoords]);
  return null;
}

interface ClinicMapProps {
  userLocation: Coordinates;
  clinic: ScoredClinic;
  travelMethod: TravelMethod;
  onRouteLoaded?: (route: RouteResult) => void;
}

export default function ClinicMap({
  userLocation,
  clinic,
  travelMethod,
  onRouteLoaded,
}: ClinicMapProps) {
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRouteCoords(null);

    fetchRoute(
      userLocation.lat,
      userLocation.lng,
      clinic.lat,
      clinic.lng,
      travelMethod
    ).then((result) => {
      if (cancelled) return;
      if (result) {
        setRouteCoords(result.coordinates);
        onRouteLoaded?.(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userLocation, clinic, travelMethod, onRouteLoaded]);

  const center: [number, number] = [
    (userLocation.lat + clinic.lat) / 2,
    (userLocation.lng + clinic.lng) / 2,
  ];

  return (
    <div className="rounded-lg overflow-hidden border border-base-300" style={{ height: 280 }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {routeCoords && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: "#3b82f6", weight: 5, opacity: 0.7 }}
          />
        )}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
        <Marker position={[clinic.lat, clinic.lng]} icon={clinicIcon}>
          <Popup>{clinic.name}</Popup>
        </Marker>
        <FitToRoute
          userLocation={userLocation}
          clinic={clinic}
          routeCoords={routeCoords}
        />
      </MapContainer>
    </div>
  );
}
