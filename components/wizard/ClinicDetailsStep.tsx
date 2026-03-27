"use client";

import { useWizard } from "./WizardProvider";
import WizardHeader from "@/components/ui/WizardHeader";

export default function ClinicDetailsStep() {
  const { selectedClinic, back, next, goTo } = useWizard();

  if (!selectedClinic) return null;

  return (
    <div className="flex flex-col flex-1">
      <WizardHeader />

      <div className="flex items-center gap-3 px-5 pt-3 pb-2">
        <button onClick={back} className="text-cl-primary">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="font-semibold text-cl-text-primary">Clinic Details</span>
      </div>

      <div className="px-5 flex-1 space-y-4 overflow-y-auto pb-4">
        {/* Clinic card */}
        <div className="border border-cl-border rounded-3xl p-5 bg-white space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cl-primary-lighter flex items-center justify-center shrink-0">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-cl-text-primary">{selectedClinic.name}</h3>
              <p className="text-xs text-cl-text-body">{selectedClinic.address}</p>
            </div>
          </div>
          <p className="text-xs text-cl-primary font-semibold">
            🕐 Open now · ~{selectedClinic.waitTimeMinutes} min wait
          </p>
          <p className="text-xs text-cl-text-body">
            📞 {selectedClinic.phone}
          </p>
        </div>

        {/* Why this one */}
        <div className="border border-cl-border rounded-2xl p-4 bg-white space-y-2">
          <h4 className="font-semibold text-cl-text-primary text-sm">Why this one?</h4>
          <p className="text-sm text-cl-text-dark">{selectedClinic.reasoning}</p>
        </div>

        {/* Services */}
        <div className="space-y-2">
          <h4 className="font-semibold text-cl-text-primary text-sm">Services</h4>
          <div className="flex flex-wrap gap-1.5">
            {selectedClinic.specialties.map((s) => (
              <span key={s} className="text-xs border border-cl-border rounded-lg px-2.5 py-1 bg-white text-cl-text-body">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div className="bg-cl-primary-light border border-cl-primary-border rounded-2xl p-4">
          <p className="text-xs text-cl-text-primary">
            📍 {selectedClinic.distanceMiles} miles away
          </p>
        </div>
      </div>

      <div className="px-5 pb-6 space-y-3">
        <button
          onClick={next}
          className="w-full h-14 rounded-2xl bg-cl-primary text-white font-semibold"
        >
          Save Preferences for Next Time
        </button>
        <button
          onClick={() => goTo(10)}
          className="w-full h-14 rounded-2xl border border-gray-300 bg-white text-cl-text-dark font-semibold"
        >
          Get Directions
        </button>
        <button
          onClick={() => goTo(7)}
          className="text-sm text-cl-text-primary font-medium self-center w-full text-center"
        >
          Review Other Clinics
        </button>
      </div>
    </div>
  );
}
