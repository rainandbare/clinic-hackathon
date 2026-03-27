"use client";

import Image from "next/image";
import { useWizard } from "./WizardProvider";

export default function WelcomeStep() {
  const { next, goTo } = useWizard();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-center gap-2 px-5 pt-8 pb-2">
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="50" cy="50" r="50" fill="#7657a2" />
          <rect x="43" y="21" width="14" height="58" rx="7" fill="white" />
          <rect x="21" y="43" width="58" height="14" rx="7" fill="white" />
        </svg>
        <span className="text-lg font-bold text-cl-text-primary">CareLocate</span>
      </div>

      <div className="flex justify-center px-14 pt-4 pb-6">
        <div className="w-full aspect-[13/11] rounded-3xl bg-cl-primary-lighter relative overflow-hidden">
          <Image
            src="/cover.png"
            alt="Nurse pointing to a clinic location pin"
            fill
            className="object-contain"
            priority
          />
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
        <button
          onClick={() => goTo(11)}
          className="w-full h-14 rounded-2xl bg-cl-text-dark text-white font-semibold text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zM11 19.93V22h2v-2.07A8.001 8.001 0 0020 12h-2a6 6 0 01-12 0H4a8.001 8.001 0 007 7.93z" />
          </svg>
          Talk to CareLocate
        </button>
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
