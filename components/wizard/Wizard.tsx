"use client";

import { useWizard } from "./WizardProvider";
import WelcomeStep from "./WelcomeStep";
import LocationStep from "./LocationStep";
import ReasonStep from "./ReasonStep";
import TimingStep from "./TimingStep";
import TravelStep from "./TravelStep";
import AccessibilityStep from "./AccessibilityStep";
import ResultsStep from "./ResultsStep";
import ClinicDetailsStep from "./ClinicDetailsStep";
import SavePrefsStep from "./SavePrefsStep";
import DirectionsStep from "./DirectionsStep";
import VoiceTriageStep from "./VoiceTriageStep";

const steps: Record<number, React.ComponentType> = {
  1: WelcomeStep,
  2: LocationStep,
  3: ReasonStep,
  4: TimingStep,
  5: TravelStep,
  6: AccessibilityStep,
  7: ResultsStep,
  8: ClinicDetailsStep,
  9: SavePrefsStep,
  10: DirectionsStep,
  11: VoiceTriageStep,
};

export default function Wizard() {
  const { step } = useWizard();
  const StepComponent = steps[step] ?? WelcomeStep;

  return (
    <div className="w-full max-w-[375px] mx-auto min-h-full flex flex-col bg-cl-card-bg shadow-lg">
      <StepComponent />
    </div>
  );
}
