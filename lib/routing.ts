import type { TravelMethod } from "@/types";

const OSRM_PROFILES: Record<TravelMethod, string> = {
  driving: "car",
  transit: "car",
  walking: "foot",
  cycling: "bike",
};

export interface RouteResult {
  coordinates: [number, number][];
  durationMinutes: number;
  distanceKm: number;
}

export async function fetchRoute(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  travelMethod: TravelMethod
): Promise<RouteResult | null> {
  const profile = OSRM_PROFILES[travelMethod];
  const url = `https://router.project-osrm.org/route/v1/${profile}/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.code !== "Ok" || !data.routes?.length) return null;

    const route = data.routes[0];
    const coords: [number, number][] = route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
    );

    return {
      coordinates: coords,
      durationMinutes: Math.round(route.duration / 60),
      distanceKm: Math.round((route.distance / 1000) * 10) / 10,
    };
  } catch {
    return null;
  }
}
