"use client";

import { useEffect, useState, useRef } from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ScoreRing({
  score,
  size = 90,
  strokeWidth = 6,
  label,
}: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const frameRef = useRef<number>(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const endVal = Math.round(score);

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(0 + (endVal - 0) * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e7e5e4" /* stone-200 */
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#292524" /* stone-900 */
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="font-serif italic text-primary-900" style={{ fontSize: size > 60 ? '2rem' : '1.25rem' }}>
          {displayScore}
        </span>
      </div>
      {label && (
        <span className="text-[10px] font-medium tracking-widest uppercase text-primary-500 mt-3">
          {label}
        </span>
      )}
    </div>
  );
}

export function MiniScoreBar({
  score,
  label,
  maxWidth = 100,
}: {
  score: number;
  label: string;
  maxWidth?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-medium tracking-wide text-primary-500 w-20 text-right shrink-0">
        {label}
      </span>
      <div
        className="h-1.5 bg-primary-200 flex-1 rounded-full overflow-hidden"
        style={{ maxWidth }}
      >
        <div
          className="h-full bg-primary-800 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="font-serif italic text-base text-primary-900 w-8">
        {Math.round(score)}
      </span>
    </div>
  );
}
