"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useWizard } from "./WizardProvider";
import WizardHeader from "@/components/ui/WizardHeader";
import type { RouteResult } from "@/lib/routing";

const ClinicMap = dynamic(() => import("@/components/ClinicMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-cl-border flex items-center justify-center" style={{ height: 250 }}>
      <svg className="w-8 h-8 animate-spin text-cl-primary" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  ),
});

export default function DirectionsStep() {
  const { selectedClinic, location, travelMethod, goTo } = useWizard();
  const [routeInfo, setRouteInfo] = useState<RouteResult | null>(null);

  const handleRouteLoaded = useCallback((route: RouteResult) => {
    setRouteInfo(route);
  }, []);

  if (!selectedClinic || !location) return null;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${selectedClinic.lat},${selectedClinic.lng}&travelmode=${travelMethod === "cycling" ? "driving" : travelMethod}`;

  return (
    <div className="flex flex-col flex-1">
      <WizardHeader />

      <div className="px-5 flex-1 space-y-4 overflow-y-auto pb-4">
        {/* Success badge */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="w-14 h-14 rounded-full bg-cl-primary-lighter border-2 border-cl-primary flex items-center justify-center">
            <svg className="w-6 h-6 text-cl-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-cl-text-primary text-center mt-3">
            You&apos;re on your way to the best-fit urgent care for your needs today.
          </p>
        </div>

        {/* Clinic info card */}
        <div className="border border-cl-border rounded-3xl p-4 bg-white space-y-2">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cl-primary-lighter flex items-center justify-center shrink-0">
              <span className="text-xl">🏥</span>
            </div>
            <div>
              <h3 className="font-bold text-cl-text-primary">{selectedClinic.name}</h3>
              <p className="text-xs text-cl-text-body">{selectedClinic.address}</p>
              <p className="text-xs text-cl-primary font-semibold mt-1">
                🕐 Open now · ~{selectedClinic.waitTimeMinutes} min wait
              </p>
            </div>
          </div>

          {routeInfo && (
            <>
              <div className="border-t border-gray-100 my-2" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cl-primary-lighter flex items-center justify-center">
                  <span className="text-lg">
                    {travelMethod === "driving" ? "🚗" : travelMethod === "transit" ? "🚇" : travelMethod === "walking" ? "🚶" : "🚕"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-cl-text-dark">Route Summary</p>
                  <p className="text-xs text-cl-text-body">
                    {routeInfo.durationMinutes} min · {routeInfo.distanceKm} km by {travelMethod}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Map */}
        <ClinicMap
          userLocation={location}
          clinic={selectedClinic}
          travelMethod={travelMethod}
          onRouteLoaded={handleRouteLoaded}
        />

        {/* Accessibility note */}
        <div className="bg-cl-primary-light border border-cl-primary-border rounded-2xl p-4">
          <p className="text-xs text-cl-text-primary">
            ♿ This clinic has been matched to your accessibility preferences.
          </p>
        </div>
      </div>

      <div className="px-5 pb-6 space-y-3">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-14 rounded-2xl bg-cl-primary text-white font-semibold flex items-center justify-center"
        >
          Open Directions in Maps
        </a>
        <div className="flex gap-3">
          <button
            onClick={() => goTo(8)}
            className="flex-1 h-12 rounded-2xl border border-gray-300 bg-white text-cl-text-dark font-semibold text-sm"
          >
            Clinic Info
          </button>
          <button
            onClick={() => goTo(7)}
            className="flex-1 h-12 rounded-2xl border border-gray-300 bg-white text-cl-text-dark font-semibold text-sm"
          >
            Other Clinics
          </button>
        </div>
        <button
          onClick={() => goTo(9)}
          className="text-xs text-cl-text-muted text-center w-full pt-1"
        >
          Save these preferences for next time
        </button>
      </div>
    </div>
  );
}
