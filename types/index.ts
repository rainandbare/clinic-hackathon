export interface Coordinates {
  lat: number;
  lng: number;
}

export type GeolocationStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unavailable";

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  specialties: string[];
  lat: number;
  lng: number;
}

export interface ScoredClinic extends Clinic {
  waitTimeMinutes: number;
  distanceMiles: number;
}

export interface RankedClinic extends ScoredClinic {
  rank: number;
  reasoning: string;
}

export type TravelMethod = "driving" | "transit" | "walking" | "cycling";

export type TimingPreference = "now" | "few_hours" | "later_today";

export type AccessibilityNeed =
  | "wheelchair"
  | "elevator"
  | "minimal_walking"
  | "parking"
  | "child_friendly"
  | "mobility_accessible";

export interface TriageMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TriageResult {
  reason: string;
  timing: TimingPreference;
  travelMethod: TravelMethod;
  accessibility: AccessibilityNeed[];
  summary: string;
}

export interface TriageRequest {
  messages: TriageMessage[];
}

export interface TriageResponse {
  reply: string;
  done: boolean;
  triage?: TriageResult;
}

export interface RecommendRequest {
  lat: number;
  lng: number;
  issue: string;
  travelMethod?: TravelMethod;
  timing?: TimingPreference;
  accessibility?: AccessibilityNeed[];
}

export interface RecommendResponse {
  clinics: RankedClinic[];
}

export interface WizardState {
  step: number;
  location: Coordinates | null;
  reason: string;
  timing: TimingPreference;
  travelMethod: TravelMethod;
  accessibility: AccessibilityNeed[];
  results: RankedClinic[] | null;
  selectedClinic: RankedClinic | null;
  isEmergency: boolean;
}
