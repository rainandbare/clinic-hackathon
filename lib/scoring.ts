import type { Clinic } from "@/types";

const EARTH_RADIUS_MILES = 3958.8;
const MAX_DISTANCE_MILES = 25;
const MAX_WAIT_MINUTES = 60;

const WEIGHT_SPECIALTY = 0.5;
const WEIGHT_PROXIMITY = 0.3;
const WEIGHT_WAIT = 0.2;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function specialtyScore(issue: string, specialties: string[]): number {
  const keywords = issue.toLowerCase().split(/\s+/);
  const joined = specialties.map((s) => s.toLowerCase()).join(" ");
  return keywords.some((kw) => kw.length > 2 && joined.includes(kw)) ? 1.0 : 0.0;
}

export function proximityScore(distanceMiles: number): number {
  if (distanceMiles >= MAX_DISTANCE_MILES) return 0;
  return 1 - distanceMiles / MAX_DISTANCE_MILES;
}

export function waitScore(waitMinutes: number): number {
  if (waitMinutes >= MAX_WAIT_MINUTES) return 0;
  return 1 - waitMinutes / MAX_WAIT_MINUTES;
}

export interface ScoreResult {
  score: number;
  distanceMiles: number;
  specialtyMatch: boolean;
}

export function scoreClinic(
  clinic: Clinic,
  userLat: number,
  userLng: number,
  issue: string,
  waitTimeMinutes: number
): ScoreResult {
  const dist = haversineDistance(userLat, userLng, clinic.lat, clinic.lng);
  const specScore = specialtyScore(issue, clinic.specialties);
  const proxScore = proximityScore(dist);
  const wScore = waitScore(waitTimeMinutes);

  const score =
    WEIGHT_SPECIALTY * specScore +
    WEIGHT_PROXIMITY * proxScore +
    WEIGHT_WAIT * wScore;

  return {
    score: Math.round(score * 100) / 100,
    distanceMiles: Math.round(dist * 100) / 100,
    specialtyMatch: specScore === 1.0,
  };
}
