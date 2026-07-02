"use client";

import type { RankedCandidate } from "@/types";
import { ScoreRing } from "./ScoreRing";
import { RadarChart } from "./RadarChart";
import { useEffect, useState } from "react";

interface CandidateModalProps {
  result: RankedCandidate | null;
  onClose: () => void;
}

export function CandidateModal({ result, onClose }: CandidateModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (result) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [result]);

  if (!result) return null;

  const { candidate, scores, breakdown, rank } = result;

  const radarData = [
    { label: "Skills", value: scores.skillMatch },
    { label: "Experience", value: scores.experience },
    { label: "Culture", value: scores.culturalFit },
    { label: "Activity", value: scores.activity },
    { label: "Trajectory", value: scores.trajectory },
  ];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className={`absolute inset-0 bg-primary-100/80 backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={handleClose} 
      />
      <div 
        className={`relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-primary-200 shrink-0 bg-white">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="font-serif italic text-4xl text-primary-900">
                {rank}
              </span>
            </div>
            <div>
              <h2 className="font-serif italic text-5xl text-primary-900 tracking-tight">
                {candidate.firstName} {candidate.lastName}
              </h2>
              <p className="text-primary-600 font-medium tracking-wide mt-2">
                {candidate.currentTitle} <span className="mx-2 text-primary-300">|</span> {candidate.currentCompany}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 text-primary-500 hover:bg-primary-100 hover:text-primary-900 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#fafaf9]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Col: AI Analysis & Radar */}
            <div className="space-y-12 lg:col-span-1">
              <div className="flex flex-col items-center">
                <ScoreRing score={scores.overall} size={160} strokeWidth={8} />
                <h3 className="text-[11px] font-medium tracking-widest uppercase text-primary-500 mt-6 text-center">
                  Overall Match
                </h3>
              </div>
              
              <div className="border-t border-primary-200 pt-10 flex flex-col items-center">
                <h3 className="text-[11px] font-medium tracking-widest uppercase text-primary-500 w-full text-left mb-6">
                  Match Dimensions
                </h3>
                <div className="w-full flex justify-center">
                  <RadarChart data={radarData} size={240} />
                </div>
              </div>

              <div className="border-t border-primary-200 pt-10">
                <h3 className="font-serif italic text-3xl text-primary-900 mb-6">
                  AI Highlights
                </h3>
                <ul className="space-y-4">
                  {breakdown.highlights.map((h, i) => (
                    <li key={i} className="text-sm text-primary-800 flex gap-3 leading-relaxed">
                      <span className="shrink-0 text-accent-500 mt-0.5">✦</span>
                      <span>{h}</span>
                    </li>
                  ))}
                  {breakdown.adjacentSkillMatches?.map((a, i) => (
                    <li key={`adj-${i}`} className="text-sm text-primary-600 flex gap-3 leading-relaxed">
                      <span className="shrink-0 text-primary-400 mt-0.5">↳</span>
                      <span>Matches {a.skill} via {a.via} ({a.weight * 100}% credit)</span>
                    </li>
                  ))}
                </ul>
                
                {breakdown.concerns.length > 0 && (
                  <>
                    <h3 className="font-serif italic text-3xl text-primary-900 mt-10 mb-6">
                      Concerns
                    </h3>
                    <ul className="space-y-4">
                      {breakdown.concerns.map((c, i) => (
                        <li key={i} className="text-sm text-primary-800 flex gap-3 leading-relaxed">
                          <span className="shrink-0 text-primary-400 mt-0.5">○</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Right Col: Details & Timeline */}
            <div className="space-y-12 lg:col-span-2">
              <section>
                <h3 className="font-serif italic text-4xl text-primary-900 mb-6">Professional Summary</h3>
                <p className="text-base text-primary-800 leading-relaxed font-serif text-xl p-8 bg-white border border-primary-200 rounded-3xl">
                  {candidate.summary}
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
                  <div className="bg-white p-5 rounded-2xl border border-primary-200 flex flex-col items-center text-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-primary-500 mb-2">Experience</div>
                    <div className="font-serif text-3xl text-primary-900">{candidate.yearsOfExperience} <span className="text-lg">Yrs</span></div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-primary-200 flex flex-col items-center text-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-primary-500 mb-2">Location</div>
                    <div className="font-serif text-2xl text-primary-900 truncate w-full">{candidate.location}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-primary-200 flex flex-col items-center text-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-primary-500 mb-2">Education</div>
                    <div className="font-serif text-2xl text-primary-900 truncate w-full capitalize">{candidate.educationLevel}</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-primary-200 flex flex-col items-center text-center">
                    <div className="text-[10px] font-medium uppercase tracking-widest text-primary-500 mb-2">Prefers</div>
                    <div className="font-serif text-2xl text-primary-900 truncate w-full capitalize">{candidate.remotePreference}</div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="font-serif italic text-4xl text-primary-900">Skill Analysis</h3>
                  <span className="editorial-badge">
                    {breakdown.semanticSimilarity}% semantic match
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="p-8 bg-white border border-primary-200 rounded-3xl">
                    <div className="text-[11px] font-medium uppercase tracking-widest text-primary-500 mb-6">Candidate Skills</div>
                    <div className="flex flex-wrap gap-2.5">
                      {candidate.skills.map(s => {
                        const isMatched = breakdown.matchedRequiredSkills.includes(s.skillName) || breakdown.matchedPreferredSkills.includes(s.skillName);
                        const isAdjacent = breakdown.adjacentSkillMatches?.some(a => a.via.toLowerCase() === s.skillName.toLowerCase());
                        
                        let badgeClass = "bg-primary-50 text-primary-500 border border-primary-200";
                        if (isMatched) badgeClass = "bg-primary-900 text-white border-transparent";
                        else if (isAdjacent) badgeClass = "bg-white text-primary-900 border border-primary-300 font-medium";

                        return (
                          <span key={s.skillName} className={`px-3 py-1.5 text-xs rounded-full ${badgeClass}`}>
                            {s.skillName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="p-8 bg-white border border-primary-200 rounded-3xl">
                    <div className="text-[11px] font-medium uppercase tracking-widest text-primary-500 mb-6">Missing Critical Skills</div>
                    <div className="flex flex-wrap gap-2.5">
                      {breakdown.missingCriticalSkills.length > 0 ? (
                        breakdown.missingCriticalSkills.map(s => (
                          <span key={s} className="px-3 py-1.5 text-xs rounded-full bg-red-50 text-red-700 border border-red-200">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="font-serif italic text-xl text-primary-900">None! Hits all required skills.</span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif italic text-4xl text-primary-900">Career Timeline</h3>
                  <span className="editorial-badge-solid">
                    {breakdown.careerTrajectory}
                  </span>
                </div>
                
                <div className="relative border-l border-primary-200 ml-4 space-y-12 pl-10">
                  {[...candidate.experience].sort((a, b) => b.startYear - a.startYear).map((exp, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[45px] top-2 w-2.5 h-2.5 rounded-full bg-primary-200 ring-4 ring-[#fafaf9]" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h4 className="font-serif text-3xl text-primary-900">
                          {exp.title}
                        </h4>
                        <span className="editorial-badge">
                          {exp.startYear} - {exp.endYear || "Present"}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-primary-500 mb-4 tracking-wide uppercase">
                        {exp.company}
                      </div>
                      <p className="text-sm text-primary-800 leading-relaxed max-w-2xl">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
