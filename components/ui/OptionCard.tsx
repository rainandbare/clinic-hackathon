"use client";

import { type ReactNode } from "react";

interface OptionCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  selected: boolean;
  onChange: () => void;
  type?: "radio" | "checkbox";
}

export default function OptionCard({
  icon,
  title,
  description,
  selected,
  onChange,
  type = "radio",
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-full flex items-center gap-3 p-4 rounded-3xl border transition-colors text-left ${
        selected
          ? "border-cl-primary bg-cl-primary-light"
          : "border-cl-border bg-cl-card-bg"
      }`}
    >
      <div className="w-10 h-10 rounded-2xl bg-cl-primary-light flex items-center justify-center shrink-0 text-cl-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[15px] text-cl-text-dark">{title}</p>
        {description && (
          <p className="text-xs text-cl-text-muted mt-0.5">{description}</p>
        )}
      </div>
      <div
        className={`w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-colors ${
          type === "radio" ? "rounded-full" : "rounded-md"
        } ${
          selected
            ? "border-cl-primary bg-cl-primary"
            : "border-gray-300 bg-white"
        }`}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
