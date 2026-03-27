"use client";

interface StepProgressProps {
  current: number;
  total: number;
  label?: string;
}

export default function StepProgress({ current, total, label }: StepProgressProps) {
  return (
    <div className="flex items-center gap-2 px-5 pt-4">
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-2 w-5 rounded-full transition-colors ${
              i < current ? "bg-cl-primary" : "bg-cl-primary-muted"
            }`}
          />
        ))}
      </div>
      {label && (
        <span className="text-xs text-cl-text-muted ml-auto">{label}</span>
      )}
    </div>
  );
}
