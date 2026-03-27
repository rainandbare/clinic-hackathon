import Cookies from "js-cookie";
import type { Coordinates } from "@/types";

const LOCATION_COOKIE = "clinic_finder_location";
const COOKIE_EXPIRY_DAYS = 7;

export function getLocationCookie(): Coordinates | null {
  const raw = Cookies.get(LOCATION_COOKIE);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.lat === "number" &&
      typeof parsed.lng === "number"
    ) {
      return { lat: parsed.lat, lng: parsed.lng };
    }
    return null;
  } catch {
    return null;
  }
}

export function setLocationCookie(lat: number, lng: number): void {
  Cookies.set(LOCATION_COOKIE, JSON.stringify({ lat, lng }), {
    expires: COOKIE_EXPIRY_DAYS,
    sameSite: "lax",
  });
}

export function clearLocationCookie(): void {
  Cookies.remove(LOCATION_COOKIE);
}
