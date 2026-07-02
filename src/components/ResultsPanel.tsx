"use client";

import type { RankedCandidate } from "@/types";
import { ScoreRing, MiniScoreBar } from "./ScoreRing";

interface ResultsPanelProps {
  results: RankedCandidate[];
  onSelectCandidate: (candidate: RankedCandidate) => void;
}

export function ResultsPanel({
  results,
  onSelectCandidate,
}: ResultsPanelProps) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-8">
      {results.map((result, idx) => (
        <CandidateCard
          key={result.candidate.id}
          result={result}
          idx={idx}
          onClick={() => onSelectCandidate(result)}
        />
      ))}
    </div>
  );
}

function CandidateCard({
  result,
  idx,
  onClick,
}: {
  result: RankedCandidate;
  idx: number;
  onClick: () => void;
}) {
  const { candidate, scores, breakdown, rank } = result;
  
  return (
    <div
      onClick={onClick}
      className="editorial-card p-6 sm:p-8 cursor-pointer flex flex-col sm:flex-row gap-8 relative group"
    >
      {/* Rank Badge */}
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full border border-primary-300 flex items-center justify-center shadow-sm z-10 group-hover:scale-110 transition-transform">
        <span className="font-serif italic text-2xl text-primary-900">
          {rank}
        </span>
      </div>

      {/* Left Col: Overall Score */}
      <div className="flex items-center justify-center sm:w-32 shrink-0 pt-4 sm:pt-0">
        <ScoreRing score={scores.overall} label="Match Score" />
      </div>

      {/* Mid Col: Candidate Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-serif italic text-4xl text-primary-900 tracking-tight group-hover:text-accent-600 transition-colors">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="text-sm font-medium text-primary-600 mt-2">
              {candidate.currentTitle} <span className="text-primary-300 mx-2">|</span> {candidate.yearsOfExperience} Years Exp.
            </p>
          </div>
          {breakdown.semanticSimilarity > 90 && (
            <span className="editorial-badge hidden sm:block">
              Strong Semantic Match
            </span>
          )}
        </div>

        <p className="text-sm text-primary-700 line-clamp-2 mb-8 leading-relaxed">
          {candidate.headline}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-widest text-primary-500 mb-3 border-b border-primary-200 pb-2">
              Score Breakdown
            </div>
            <div className="space-y-3">
              <MiniScoreBar score={scores.skillMatch} label="Skills" />
              <MiniScoreBar score={scores.experience} label="Experience" />
              <MiniScoreBar score={scores.culturalFit} label="Culture" />
              <MiniScoreBar score={scores.trajectory} label="Trajectory" />
            </div>
          </div>
          
          <div className="flex flex-col h-full">
            <div className="text-[11px] font-medium uppercase tracking-widest text-primary-500 mb-3 border-b border-primary-200 pb-2">
              AI Highlights
            </div>
            <ul className="space-y-2.5 flex-1">
              {breakdown.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="text-sm text-primary-800 flex gap-3">
                  <span className="shrink-0 text-accent-500">✦</span>
                  <span className="leading-snug">{h}</span>
                </li>
              ))}
              {breakdown.concerns.length > 0 && (
                <li className="text-sm text-primary-800 flex gap-3 mt-3 pt-3 border-t border-primary-100">
                  <span className="shrink-0 opacity-50">○</span>
                  <span className="leading-snug">{breakdown.concerns[0]}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
