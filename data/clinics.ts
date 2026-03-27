import type { Clinic } from "@/types";

export const WAIT_TIME_MIN = 5;
export const WAIT_TIME_MAX = 55;

export function randomizeWaitTime(): number {
  return Math.floor(Math.random() * (WAIT_TIME_MAX - WAIT_TIME_MIN + 1)) + WAIT_TIME_MIN;
}

export const clinics: Clinic[] = [
  {
    id: "clinic-1",
    name: "King West Walk-In Clinic",
    address: "550 King St W, Toronto, ON M5V 1M3",
    phone: "(416) 555-0100",
    specialties: ["general urgent care", "fractures", "sprains", "orthopedics"],
    lat: 43.6444,
    lng: -79.3947,
  },
  {
    id: "clinic-2",
    name: "Sick Kids After-Hours Clinic",
    address: "555 University Ave, Toronto, ON M5G 1X8",
    phone: "(416) 555-0200",
    specialties: ["pediatrics", "ear infections", "childhood asthma", "vaccinations"],
    lat: 43.6569,
    lng: -79.3887,
  },
  {
    id: "clinic-3",
    name: "Bay Dermatology & Urgent Care",
    address: "790 Bay St, Toronto, ON M5G 1N8",
    phone: "(416) 555-0300",
    specialties: ["dermatology", "rashes", "skin infections", "allergic reactions"],
    lat: 43.6610,
    lng: -79.3860,
  },
  {
    id: "clinic-4",
    name: "Queen East Express Care",
    address: "1066 Queen St E, Toronto, ON M4M 1K7",
    phone: "(416) 555-0400",
    specialties: ["general urgent care", "cold and flu", "minor injuries", "stitches"],
    lat: 43.6598,
    lng: -79.3422,
  },
  {
    id: "clinic-5",
    name: "Bloor West Family Health Centre",
    address: "2397 Bloor St W, Toronto, ON M6S 1P6",
    phone: "(416) 555-0500",
    specialties: ["family medicine", "respiratory infections", "diabetes screening", "hypertension"],
    lat: 43.6500,
    lng: -79.4750,
  },
  {
    id: "clinic-6",
    name: "Yorkville Respiratory & Allergy Clinic",
    address: "100 Yorkville Ave, Toronto, ON M5R 1B9",
    phone: "(416) 555-0600",
    specialties: ["respiratory", "asthma", "allergies", "bronchitis", "sinus infections"],
    lat: 43.6709,
    lng: -79.3935,
  },
  {
    id: "clinic-7",
    name: "Liberty Village Orthopedic Urgent Care",
    address: "171 E Liberty St, Toronto, ON M6K 3P6",
    phone: "(416) 555-0700",
    specialties: ["orthopedics", "fractures", "sports injuries", "joint pain", "back pain"],
    lat: 43.6380,
    lng: -79.4175,
  },
  {
    id: "clinic-8",
    name: "Dundas Square Walk-In",
    address: "220 Yonge St, Toronto, ON M5B 2H1",
    phone: "(416) 555-0800",
    specialties: ["general urgent care", "lacerations", "burns", "infections"],
    lat: 43.6561,
    lng: -79.3802,
  },
  {
    id: "clinic-9",
    name: "Harbourfront Women's Health Clinic",
    address: "410 Queens Quay W, Toronto, ON M5V 2Z3",
    phone: "(416) 555-0900",
    specialties: ["women's health", "UTI", "prenatal screening", "gynecology"],
    lat: 43.6383,
    lng: -79.3880,
  },
  {
    id: "clinic-10",
    name: "St. Lawrence GI & General Clinic",
    address: "125 The Esplanade, Toronto, ON M5E 0A2",
    phone: "(416) 555-1000",
    specialties: ["gastroenterology", "stomach pain", "nausea", "general urgent care"],
    lat: 43.6470,
    lng: -79.3715,
  },
];
