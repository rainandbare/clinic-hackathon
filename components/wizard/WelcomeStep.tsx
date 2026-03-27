"use client";

import { useWizard } from "./WizardProvider";

export default function WelcomeStep() {
  const { next } = useWizard();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-center px-5 pt-8 pb-2">
        <span className="text-lg font-bold text-cl-text-primary">CareLocate</span>
      </div>

      <div className="flex justify-center px-14 pt-4 pb-6">
        <div className="w-full aspect-[13/11] rounded-3xl bg-cl-primary-lighter flex items-center justify-center">
          <svg className="w-24 h-24 text-cl-primary opacity-40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
          </svg>
        </div>
      </div>

      <div className="px-6 text-center space-y-3 flex-1">
        <h1 className="text-[26px] font-bold text-cl-text-dark leading-tight">
          Find the right urgent care &mdash; fast
        </h1>
        <p className="text-sm text-cl-text-body">
          Takes under a minute. We match you to the most suitable clinic &mdash;
          not just the nearest one.
        </p>
      </div>

      <div className="px-6 pb-6 space-y-3 pt-8">
        <button
          onClick={next}
          className="w-full h-14 rounded-2xl bg-cl-primary text-white font-semibold text-base"
        >
          Find the right urgent care
        </button>
        <a
          href="tel:911"
          className="w-full h-14 rounded-2xl bg-cl-text-dark text-white font-semibold text-sm flex items-center justify-center"
        >
          I have an emergency
        </a>
      </div>

      <div className="flex justify-center gap-2 pb-6">
        <div className="w-6 h-2 rounded-full bg-cl-primary" />
        <div className="w-2 h-2 rounded-full bg-cl-border" />
        <div className="w-2 h-2 rounded-full bg-cl-border" />
        <div className="w-2 h-2 rounded-full bg-cl-border" />
        <div className="w-2 h-2 rounded-full bg-cl-border" />
      </div>
    </div>
  );
}
