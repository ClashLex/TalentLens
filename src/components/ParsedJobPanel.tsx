"use client";

import type { ParsedJob } from "@/types";

interface ParsedJobPanelProps {
  parsedJob: ParsedJob;
}

export function ParsedJobPanel({ parsedJob }: ParsedJobPanelProps) {
  return (
    <div className="editorial-card p-8 h-full flex flex-col">
      <h3 className="font-serif italic text-2xl text-primary-900 mb-6">
        Job Analysis
      </h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-primary-200">
        <span className="editorial-badge">
          {parsedJob.seniorityLevel}
        </span>
        <span className="editorial-badge bg-primary-900 text-white border-transparent">
          {parsedJob.minYearsExperience}+ Yrs
        </span>
        {parsedJob.remoteCompatible && (
          <span className="editorial-badge text-accent-600 bg-accent-50 border-accent-200">
            Remote OK
          </span>
        )}
        {parsedJob.managementRequired && (
          <span className="editorial-badge">
            Management
          </span>
        )}
      </div>

      <div className="space-y-8 flex-1">
        {parsedJob.requiredSkills.length > 0 && (
          <div>
            <div className="text-[11px] font-medium tracking-wide uppercase text-primary-500 mb-3">
              Required Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {parsedJob.requiredSkills.map((s, i) => (
                <div key={i} className="px-3 py-1.5 bg-primary-50 rounded-full border border-primary-200 text-xs font-medium text-primary-800 flex items-center gap-2">
                  <span>{s.skill}</span>
                  <span className="text-primary-400 text-[10px]">{Math.round(s.weight * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {parsedJob.preferredSkills.length > 0 && (
          <div>
            <div className="text-[11px] font-medium tracking-wide uppercase text-primary-500 mb-3">
              Preferred Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {parsedJob.preferredSkills.map((s, i) => (
                <div key={i} className="px-3 py-1.5 bg-transparent rounded-full border border-primary-200 text-xs text-primary-600">
                  {s.skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
