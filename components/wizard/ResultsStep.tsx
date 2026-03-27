"use client";

import { useEffect, useState } from "react";
import { useWizard } from "./WizardProvider";
import WizardHeader from "@/components/ui/WizardHeader";
import StepProgress from "@/components/ui/StepProgress";
import type { RankedClinic, RecommendResponse } from "@/types";

const REASON_MAP: Record<string, string> = {
  fever: "child fever",
  infection: "infection",
  xray: "injury needing x-ray",
  breathing: "breathing issues",
  minor: "minor injury",
  general: "urgent care",
};

export default function ResultsStep() {
  const { location, reason, travelMethod, timing, accessibility, setResults, results, setSelectedClinic, next, goTo } = useWizard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (results) return;
    if (!location) return;

    setLoading(true);
    const issue = REASON_MAP[reason] || "urgent care";

    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: location.lat,
        lng: location.lng,
        issue,
        travelMethod,
        timing,
        accessibility,
      }),
    })
      .then((res) => res.json())
      .then((data: RecommendResponse) => {
        setResults(data.clinics);
      })
      .catch(() => setError("Failed to load recommendations."))
      .finally(() => setLoading(false));
  }, [location, reason, travelMethod, timing, accessibility, results, setResults]);

  const handleSelectClinic = (clinic: RankedClinic) => {
    setSelectedClinic(clinic);
    next();
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4">
        <svg className="w-10 h-10 animate-spin text-cl-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-cl-text-body">Finding the best clinics for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 px-5">
        <p className="text-red-600">{error}</p>
        <button onClick={() => goTo(3)} className="text-cl-primary font-semibold">
          Try again
        </button>
      </div>
    );
  }

  if (!results || results.length === 0) return null;

  const best = results[0];
  const others = results.slice(1);

  return (
    <div className="flex flex-col flex-1">
      <WizardHeader />

      <div className="flex items-center justify-between px-5 pt-3 pb-1">
        <button onClick={() => goTo(6)} className="text-cl-primary text-sm">
          <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="font-semibold text-cl-text-primary">Your Results</span>
        <div className="w-6" />
      </div>

      <StepProgress current={6} total={6} />

      <div className="px-4 pt-2 flex-1 space-y-3 overflow-y-auto pb-4">
        <div className="bg-cl-primary rounded-full px-3 py-1 inline-flex items-center gap-1.5">
          <span className="text-yellow-300 text-sm">★</span>
          <span className="text-xs text-white font-semibold">Best for your situation right now</span>
        </div>

        {/* #1 Featured */}
        <div className="border-2 border-cl-primary rounded-3xl bg-cl-primary-light p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-cl-text-primary">{best.name}</h3>
            <span className="bg-cl-primary text-white text-xs font-bold px-2.5 py-1.5 rounded-xl">#{best.rank}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-cl-text-primary">
            <span>🕐</span>
            <span className="font-semibold">~{best.waitTimeMinutes} min wait</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs border border-cl-primary-border rounded-xl px-2.5 py-1 bg-white text-cl-text-primary">
              {best.distanceMiles} mi {travelMethod}
            </span>
            <span className="bg-cl-primary/70 text-white text-xs font-semibold rounded-full px-3 py-1">
              Open now · Low wait
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {best.specialties.slice(0, 3).map((s) => (
              <span key={s} className="text-xs border border-cl-border rounded-lg px-2.5 py-1 bg-white text-cl-text-body">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Reasoning */}
        <div className="border border-cl-border rounded-2xl p-4 bg-white">
          <div className="flex gap-2">
            <span className="text-cl-primary mt-0.5">💡</span>
            <p className="text-sm text-cl-text-dark">{best.reasoning}</p>
          </div>
        </div>

        <button
          onClick={() => handleSelectClinic(best)}
          className="w-full h-[52px] rounded-2xl bg-cl-primary text-white font-semibold"
        >
          View Clinic Details
        </button>

        {others.length > 0 && (
          <>
            <p className="font-semibold text-cl-text-primary text-sm pt-2">Other options</p>
            {others.map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => handleSelectClinic(clinic)}
                className="w-full text-left border border-cl-border rounded-3xl p-4 bg-white space-y-2"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-cl-text-primary">{clinic.name}</h4>
                  <span className="bg-gray-100 text-cl-text-body text-xs font-bold px-2.5 py-1.5 rounded-xl">#{clinic.rank}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-cl-text-body">
                  <span>🕐 ~{clinic.waitTimeMinutes} min</span>
                  <span>{clinic.distanceMiles} mi</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {clinic.specialties.slice(0, 2).map((s) => (
                    <span key={s} className="text-xs border border-cl-border rounded-lg px-2 py-0.5 bg-gray-50 text-cl-text-body">
                      {s}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </>
        )}

        <div className="flex justify-center pt-2 pb-4">
          <button
            onClick={() => goTo(3)}
            className="border border-gray-300 rounded-2xl px-6 py-3 text-sm font-semibold text-cl-text-dark"
          >
            Adjust your preferences
          </button>
        </div>
      </div>
    </div>
  );
}
