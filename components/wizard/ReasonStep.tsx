"use client";

import { useWizard } from "./WizardProvider";
import WizardHeader from "@/components/ui/WizardHeader";
import StepProgress from "@/components/ui/StepProgress";
import OptionCard from "@/components/ui/OptionCard";
import WizardButtons from "@/components/ui/WizardButtons";

const REASONS = [
  { id: "fever", title: "Child has a fever", desc: "High temperature, chills, fatigue", icon: "🤒" },
  { id: "infection", title: "I think I have an infection", desc: "Swelling, redness, pain", icon: "🦠" },
  { id: "xray", title: "Injury that may need an X-ray", desc: "Fracture, sprain, or impact injury", icon: "🩻" },
  { id: "breathing", title: "Breathing issues or flu symptoms", desc: "Cough, congestion, shortness of breath", icon: "🫁" },
  { id: "minor", title: "Cut, sprain, or minor injury", desc: "Lacerations, bruises, minor burns", icon: "🩹" },
  { id: "general", title: "General — I need urgent care", desc: "Not sure, just need to see someone", icon: "🏥" },
];

export default function ReasonStep() {
  const { reason, setReason, next, back } = useWizard();

  return (
    <div className="flex flex-col flex-1">
      <WizardHeader />
      <StepProgress current={3} total={6} label="Step 3 of 6" />

      <div className="px-5 pt-6 flex-1 space-y-3">
        <h2 className="text-[22px] font-bold text-cl-text-primary leading-tight">
          What brings you in today?
        </h2>
        <p className="text-sm text-cl-text-body">
          Select the option that best describes your situation.
        </p>

        <div className="space-y-2 pt-2">
          {REASONS.map((r) => (
            <OptionCard
              key={r.id}
              icon={<span className="text-lg">{r.icon}</span>}
              title={r.title}
              description={r.desc}
              selected={reason === r.id}
              onChange={() => setReason(r.id)}
            />
          ))}
        </div>
      </div>

      <WizardButtons
        onBack={back}
        onContinue={next}
        continueDisabled={!reason}
      />
    </div>
  );
}
