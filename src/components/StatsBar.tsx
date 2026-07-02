"use client";

import { useEffect, useState, useRef } from "react";
import type { Stats } from "@/types";

interface StatsBarProps {
  stats: Stats | null;
  seeded: boolean;
  seeding: boolean;
  onSeed: () => void;
}

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

export function StatsBar({ stats, seeded, seeding, onSeed }: StatsBarProps) {
  return (
    <div className="mb-10">
      {!seeded ? (
        <div className="editorial-card p-10 text-center max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-6">
            <span className="text-2xl">🌱</span>
          </div>
          <h2 className="font-serif italic text-4xl text-primary-900 mb-3">
            Initialize Database
          </h2>
          <p className="text-primary-600 mb-8 max-w-md">
            Generate 100 diverse, realistic candidate profiles to power the AI ranking engine. This provides the necessary data corpus for TF-IDF scoring.
          </p>
          <button
            onClick={onSeed}
            disabled={seeding}
            className="editorial-button-outline"
          >
            {seeding ? "Generating Data..." : "Seed Database"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Candidates" value={stats?.totalCandidates ?? 0} />
          <StatCard label="Unique Skills" value={stats?.uniqueSkills ?? 0} />
          <StatCard label="Searches Run" value={stats?.totalSearches ?? 0} />
          <StatCard label="Engine Status" value="Online" isText />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, isText = false }: { label: string; value: number | string, isText?: boolean }) {
  return (
    <div className="editorial-card p-6 flex flex-col items-center justify-center text-center">
      <div className="text-[11px] font-medium tracking-wide uppercase text-primary-500 mb-2">
        {label}
      </div>
      <div className={`font-serif text-4xl text-primary-900 ${isText ? 'italic text-accent-600' : ''}`}>
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </div>
    </div>
  );
}
