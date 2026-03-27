"use client";

interface WizardButtonsProps {
  onBack?: () => void;
  onContinue?: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  skipLabel?: string;
  continueDisabled?: boolean;
  loading?: boolean;
}

export default function WizardButtons({
  onBack,
  onContinue,
  onSkip,
  continueLabel = "Continue",
  skipLabel,
  continueDisabled = false,
  loading = false,
}: WizardButtonsProps) {
  return (
    <div className="flex flex-col gap-3 px-5 pb-6 pt-4">
      {onContinue && (
        <button
          onClick={onContinue}
          disabled={continueDisabled || loading}
          className="w-full h-[52px] rounded-2xl bg-cl-primary text-white font-semibold text-base disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {continueLabel}
        </button>
      )}
      {onSkip && skipLabel && (
        <button
          onClick={onSkip}
          className="w-full h-[52px] rounded-2xl border border-gray-300 bg-white text-cl-text-dark font-semibold text-base"
        >
          {skipLabel}
        </button>
      )}
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-cl-text-primary font-medium self-start"
        >
          &larr; Back
        </button>
      )}
    </div>
  );
}
