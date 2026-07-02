"use client";

export function Header() {
  return (
    <header className="py-10">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-primary-300 pb-8">
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="font-serif italic text-5xl sm:text-6xl text-primary-900 tracking-tight">
              TalentLens
            </h1>
            <p className="text-primary-600 text-sm tracking-wide mt-2">
              Intelligent Candidate Discovery
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="editorial-badge flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
              NLP Engine
            </div>
            <div className="editorial-badge-solid">
              TF-IDF Active
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
