"use client";

import { useWizard } from "./WizardProvider";
import WizardHeader from "@/components/ui/WizardHeader";
import StepProgress from "@/components/ui/StepProgress";
import OptionCard from "@/components/ui/OptionCard";
import WizardButtons from "@/components/ui/WizardButtons";
import type { TravelMethod } from "@/types";

const TRAVEL_OPTIONS: { id: TravelMethod; title: string; desc: string; icon: string }[] = [
  { id: "driving", title: "Car", desc: "Drive or get dropped off", icon: "🚗" },
  { id: "transit", title: "Transit", desc: "Bus, subway, or streetcar", icon: "🚇" },
  { id: "walking", title: "Walking", desc: "On foot", icon: "🚶" },
  { id: "cycling", title: "Ride from someone", desc: "Getting a ride or cycling", icon: "🚕" },
];

export default function TravelStep() {
  const { travelMethod, setTravelMethod, next, back } = useWizard();

  return (
    <div className="flex flex-col flex-1">
      <WizardHeader />
      <StepProgress current={5} total={6} label="Step 5 of 6" />

      <div className="px-5 pt-6 flex-1 space-y-3">
        <h2 className="text-[22px] font-bold text-cl-text-primary leading-tight">
          How will you get there?
        </h2>
        <p className="text-sm text-cl-text-body">
          Your travel mode affects which clinics we recommend and how we
          calculate travel time.
        </p>

        <div className="space-y-2 pt-2">
          {TRAVEL_OPTIONS.map((t) => (
            <OptionCard
              key={t.id}
              icon={<span className="text-lg">{t.icon}</span>}
              title={t.title}
              description={t.desc}
              selected={travelMethod === t.id}
              onChange={() => setTravelMethod(t.id)}
            />
          ))}
        </div>
      </div>

      <WizardButtons
        onBack={back}
        onContinue={next}
        onSkip={next}
        skipLabel="Skip"
      />
    </div>
  );
}
