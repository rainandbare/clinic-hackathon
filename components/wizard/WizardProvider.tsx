"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Coordinates,
  TravelMethod,
  TimingPreference,
  AccessibilityNeed,
  RankedClinic,
  WizardState,
  TriageResult,
} from "@/types";

interface WizardContextValue extends WizardState {
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
  setLocation: (loc: Coordinates) => void;
  setReason: (reason: string) => void;
  setTiming: (timing: TimingPreference) => void;
  setTravelMethod: (method: TravelMethod) => void;
  toggleAccessibility: (need: AccessibilityNeed) => void;
  setResults: (clinics: RankedClinic[]) => void;
  setSelectedClinic: (clinic: RankedClinic) => void;
  emergencySkip: (coords: Coordinates) => void;
  triageSkip: (coords: Coordinates, triage: TriageResult) => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}

export default function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>({
    step: 1,
    location: null,
    reason: "",
    timing: "now",
    travelMethod: "driving",
    accessibility: [],
    results: null,
    selectedClinic: null,
    isEmergency: false,
  });

  const next = useCallback(() => setState((s) => ({ ...s, step: s.step + 1 })), []);
  const back = useCallback(() => setState((s) => ({ ...s, step: Math.max(1, s.step - 1) })), []);
  const goTo = useCallback((step: number) => setState((s) => ({ ...s, step })), []);

  const setLocation = useCallback(
    (location: Coordinates) => setState((s) => ({ ...s, location })),
    []
  );
  const setReason = useCallback(
    (reason: string) => setState((s) => ({ ...s, reason })),
    []
  );
  const setTiming = useCallback(
    (timing: TimingPreference) => setState((s) => ({ ...s, timing })),
    []
  );
  const setTravelMethod = useCallback(
    (travelMethod: TravelMethod) => setState((s) => ({ ...s, travelMethod })),
    []
  );
  const toggleAccessibility = useCallback((need: AccessibilityNeed) => {
    setState((s) => ({
      ...s,
      accessibility: s.accessibility.includes(need)
        ? s.accessibility.filter((n) => n !== need)
        : [...s.accessibility, need],
    }));
  }, []);
  const setResults = useCallback(
    (clinics: RankedClinic[]) => setState((s) => ({ ...s, results: clinics })),
    []
  );
  const setSelectedClinic = useCallback(
    (clinic: RankedClinic) => setState((s) => ({ ...s, selectedClinic: clinic })),
    []
  );

  const emergencySkip = useCallback((coords: Coordinates) => {
    setState((s) => ({
      ...s,
      location: coords,
      reason: "general",
      timing: "now",
      travelMethod: "driving",
      accessibility: [],
      results: null,
      isEmergency: true,
      step: 7,
    }));
  }, []);

  const triageSkip = useCallback((coords: Coordinates, triage: TriageResult) => {
    setState((s) => ({
      ...s,
      location: coords,
      reason: triage.reason,
      timing: triage.timing,
      travelMethod: triage.travelMethod,
      accessibility: triage.accessibility,
      results: null,
      isEmergency: false,
      step: 7,
    }));
  }, []);

  return (
    <WizardContext.Provider
      value={{
        ...state,
        next,
        back,
        goTo,
        setLocation,
        setReason,
        setTiming,
        setTravelMethod,
        toggleAccessibility,
        setResults,
        setSelectedClinic,
        emergencySkip,
        triageSkip,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}
