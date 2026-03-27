"use client";

import { useWizard } from "./WizardProvider";
import WizardHeader from "@/components/ui/WizardHeader";
import StepProgress from "@/components/ui/StepProgress";
import OptionCard from "@/components/ui/OptionCard";
import WizardButtons from "@/components/ui/WizardButtons";
import type { AccessibilityNeed } from "@/types";

const NEEDS: { id: AccessibilityNeed; title: string; desc: string; icon: string }[] = [
  { id: "wheelchair", title: "Wheelchair access", desc: "Entrance & interior accessible", icon: "♿" },
  { id: "elevator", title: "Elevator available", desc: "No stairs required", icon: "🛗" },
  { id: "minimal_walking", title: "Minimal walking", desc: "Short distance from entry to care", icon: "🚶" },
  { id: "parking", title: "Parking near entrance", desc: "Convenient drop-off or lot nearby", icon: "🅿️" },
  { id: "child_friendly", title: "Child-friendly care", desc: "Pediatric-ready environment", icon: "👶" },
  { id: "mobility_accessible", title: "Mobility-accessible clinic", desc: "Full ADA-compliant facility", icon: "🏥" },
];

export default function AccessibilityStep() {
  const { accessibility, toggleAccessibility, next, back } = useWizard();

  return (
    <div className="flex flex-col flex-1">
      <WizardHeader />
      <StepProgress current={6} total={6} label="Step 6 of 6" />

      <div className="px-5 pt-6 flex-1 space-y-3">
        <h2 className="text-[22px] font-bold text-cl-text-primary leading-tight">
          Anything we should consider to make this visit easier?
        </h2>
        <p className="text-sm text-cl-text-body">
          These preferences help tailor recommendations and reduce effort during
          your visit.
        </p>

        <div className="space-y-2 pt-2">
          {NEEDS.map((n) => (
            <OptionCard
              key={n.id}
              icon={<span className="text-lg">{n.icon}</span>}
              title={n.title}
              description={n.desc}
              selected={accessibility.includes(n.id)}
              onChange={() => toggleAccessibility(n.id)}
              type="checkbox"
            />
          ))}
        </div>
      </div>

      <WizardButtons
        onBack={back}
        onContinue={next}
        continueLabel="Continue"
        onSkip={next}
        skipLabel="No additional needs — skip"
      />
    </div>
  );
}
