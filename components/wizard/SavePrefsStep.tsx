"use client";

import { useState } from "react";
import { useWizard } from "./WizardProvider";
import WizardHeader from "@/components/ui/WizardHeader";
import StepProgress from "@/components/ui/StepProgress";
import Cookies from "js-cookie";

interface PrefToggle {
  key: string;
  label: string;
  detail: string;
  defaultOn: boolean;
}

export default function SavePrefsStep() {
  const { travelMethod, accessibility, timing, back, goTo } = useWizard();

  const prefs: PrefToggle[] = [
    { key: "travel", label: "Travel mode", detail: travelMethod, defaultOn: true },
    { key: "accessibility", label: "Accessibility needs", detail: accessibility.length > 0 ? accessibility.join(", ") : "None", defaultOn: accessibility.length > 0 },
    { key: "timing", label: "Timing preference", detail: timing === "now" ? "Need care now" : timing === "few_hours" ? "Within a few hours" : "Sometime today", defaultOn: true },
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(prefs.map((p) => [p.key, p.defaultOn]))
  );

  const toggle = (key: string) =>
    setToggles((t) => ({ ...t, [key]: !t[key] }));

  const handleSave = () => {
    const saved: Record<string, string> = {};
    if (toggles.travel) saved.travelMethod = travelMethod;
    if (toggles.accessibility) saved.accessibility = JSON.stringify(accessibility);
    if (toggles.timing) saved.timing = timing;
    Cookies.set("cl_preferences", JSON.stringify(saved), { expires: 30, sameSite: "lax" });
    goTo(10);
  };

  return (
    <div className="flex flex-col flex-1">
      <WizardHeader />
      <StepProgress current={9} total={10} label="Step 9 of 10" />

      <div className="px-5 pt-6 flex-1 space-y-4">
        <h2 className="text-[22px] font-bold text-cl-text-primary leading-tight">
          Save your preferences for next time?
        </h2>
        <p className="text-sm text-cl-text-body">
          Toggle which preferences to remember. Stored only in your browser cookies.
        </p>

        <div className="space-y-3 pt-2">
          {prefs.map((p) => (
            <div
              key={p.key}
              className="flex items-center justify-between p-4 rounded-3xl border border-cl-border bg-white"
            >
              <div>
                <p className="font-semibold text-sm text-cl-text-dark">{p.label}</p>
                <p className="text-xs text-cl-text-muted capitalize">{p.detail}</p>
              </div>
              <button
                onClick={() => toggle(p.key)}
                className={`w-12 h-7 rounded-full flex items-center transition-colors px-1 ${
                  toggles[p.key] ? "bg-cl-primary justify-end" : "bg-gray-300 justify-start"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-cl-text-muted text-center pt-2">
          Your data stays on this device and is never shared.
        </p>
      </div>

      <div className="px-5 pb-6 space-y-3 pt-4">
        <button
          onClick={handleSave}
          className="w-full h-14 rounded-2xl bg-cl-primary text-white font-semibold"
        >
          Save &amp; Get Directions
        </button>
        <button
          onClick={() => goTo(10)}
          className="w-full h-14 rounded-2xl border border-gray-300 bg-white text-cl-text-dark font-semibold text-sm"
        >
          Skip &mdash; just get directions
        </button>
        <button onClick={back} className="text-sm text-cl-text-primary font-medium self-start">
          &larr; Back
        </button>
      </div>
    </div>
  );
}
