"use client";

import { useState, useCallback } from "react";
import { useWizard } from "./WizardProvider";
import WizardHeader from "@/components/ui/WizardHeader";
import StepProgress from "@/components/ui/StepProgress";
import WizardButtons from "@/components/ui/WizardButtons";
import { getCurrentPosition, isGeolocationSupported } from "@/lib/geolocation";
import { setLocationCookie, getLocationCookie } from "@/lib/cookies";
import { useEffect } from "react";

export default function LocationStep() {
  const { next, back, setLocation, location } = useWizard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = getLocationCookie();
    if (saved && !location) {
      setLocation(saved);
    }
  }, [location, setLocation]);

  const handleShare = useCallback(async () => {
    if (!isGeolocationSupported()) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const coords = await getCurrentPosition();
      setLocationCookie(coords.lat, coords.lng);
      setLocation(coords);
      next();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not get location.");
    } finally {
      setLoading(false);
    }
  }, [setLocation, next]);

  const handleContinueWithSaved = useCallback(() => {
    if (location) next();
  }, [location, next]);

  return (
    <div className="flex flex-col flex-1">
      <WizardHeader />
      <StepProgress current={2} total={6} label="Step 2 of 6" />

      <div className="px-5 pt-6 flex-1 space-y-4">
        <h2 className="text-[22px] font-bold text-cl-text-primary leading-tight">
          Where are you right now?
        </h2>
        <p className="text-sm text-cl-text-body">
          We need your location to recommend nearby clinics. Your location is
          only stored in your browser.
        </p>

        {location && (
          <div className="p-4 rounded-2xl bg-cl-primary-light border border-cl-primary-border">
            <p className="text-sm font-medium text-cl-text-primary">
              Location saved: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-cl-warning-bg">
            <p className="text-sm text-cl-text-dark">{error}</p>
          </div>
        )}

        {!location && (
          <button
            onClick={handleShare}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-cl-primary text-white font-semibold text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Locating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
                Share my current location
              </>
            )}
          </button>
        )}
      </div>

      <WizardButtons
        onBack={back}
        onContinue={location ? handleContinueWithSaved : undefined}
        continueLabel="Continue"
        continueDisabled={!location}
      />
    </div>
  );
}
