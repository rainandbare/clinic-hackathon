"use client";

export default function WizardHeader() {
  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-cl-border">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-cl-primary" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
        <span className="text-lg font-bold text-cl-text-primary">CareLocate</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-cl-primary" aria-label="Share">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
        </button>
        <div className="w-9 h-9 rounded-full bg-cl-primary-light flex items-center justify-center">
          <svg className="w-4 h-4 text-cl-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </header>
  );
}
