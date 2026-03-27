"use client";

import { useWizard } from "./WizardProvider";
import WizardHeader from "@/components/ui/WizardHeader";
import StepProgress from "@/components/ui/StepProgress";
import OptionCard from "@/components/ui/OptionCard";
import WizardButtons from "@/components/ui/WizardButtons";
import type { TimingPreference } from "@/types";

const TIMINGS: { id: TimingPreference; title: string; desc: string; icon: string; recommended?: boolean }[] = [
  { id: "now", title: "Need care now", desc: "We'll prioritize clinics that are open with low wait times", icon: "⚡", recommended: true },
  { id: "few_hours", title: "Within a few hours", desc: "More options may be available if you can wait a bit", icon: "🕐" },
  { id: "later_today", title: "Sometime today", desc: "We'll find the best overall match for today", icon: "📅" },
];

export default function TimingStep() {
  const { timing, setTiming, next, back } = useWizard();

  return (
    <div className="flex flex-col flex-1">
      <WizardHeader />
      <StepProgress current={4} total={6} label="Step 4 of 6" />

      <div className="px-5 pt-6 flex-1 space-y-3">
        <h2 className="text-[22px] font-bold text-cl-text-primary leading-tight">
          How soon do you need care?
        </h2>
        <p className="text-sm text-cl-text-body">
          This helps us prioritize clinics based on availability.
        </p>

        <div className="space-y-2 pt-2">
          {TIMINGS.map((t) => (
            <div key={t.id} className="relative">
              {t.recommended && (
                <span className="absolute -top-2 left-4 z-10 text-[10px] font-semibold text-white bg-cl-primary px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
              <OptionCard
                icon={<span className="text-lg">{t.icon}</span>}
                title={t.title}
                description={t.desc}
                selected={timing === t.id}
                onChange={() => setTiming(t.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <WizardButtons onBack={back} onContinue={next} />
    </div>
  );
}
