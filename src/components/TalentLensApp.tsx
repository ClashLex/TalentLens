"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "./Header";
import { StatsBar } from "./StatsBar";
import { JobInputPanel } from "./JobInputPanel";
import { ResultsPanel } from "./ResultsPanel";
import { CandidateModal } from "./CandidateModal";
import { ParsedJobPanel } from "./ParsedJobPanel";
import type { SearchResponse, Stats, RankedCandidate } from "@/types";

export function TalentLensApp() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [searching, setSearching] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);
  
  // Search state
  const [currentSearch, setCurrentSearch] = useState<SearchResponse | null>(null);
  
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
      if (data.totalCandidates > 0) setSeeded(true);
    } catch {
      // stats fetch failed silently
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSeeded(true);
      await fetchStats();
    } catch (err) {
      setError(String(err));
    } finally {
      setSeeding(false);
    }
  };

  const handleSearch = async (jobTitle: string, jobDescription: string) => {
    setSearching(true);
    setError(null);
    setCurrentSearch(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setCurrentSearch(data);
      await fetchStats();
    } catch (err) {
      setError(String(err));
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <Header />

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Error State */}
        {error && (
          <div className="editorial-card border-accent-500 bg-accent-50/50 p-5 text-accent-600 text-sm">
            <span className="font-bold mr-2">Error:</span> {error}
          </div>
        )}

        {/* Stats Bar (Top) */}
        <StatsBar stats={stats} seeded={seeded} seeding={seeding} onSeed={handleSeed} />

        {/* Job Input (Middle) */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-serif italic text-3xl text-primary-900">I. Define Profile</h2>
            <div className="h-px bg-primary-200 flex-1" />
          </div>
          <JobInputPanel
            onSearch={handleSearch}
            searching={searching}
            seeded={seeded}
          />
        </section>

        {/* Results (Bottom) */}
        {(searching || currentSearch) && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-serif italic text-3xl text-primary-900">II. AI Analysis</h2>
              <div className="h-px bg-primary-200 flex-1" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Parsed Job */}
              {currentSearch?.parsedJob && (
                <div className="lg:col-span-4">
                  <ParsedJobPanel parsedJob={currentSearch.parsedJob} />
                </div>
              )}

              {/* Right Column: Ranked Candidates */}
              <div className={currentSearch?.parsedJob ? "lg:col-span-8" : "lg:col-span-12"}>
                {searching ? (
                  <div className="editorial-card p-16 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                    <div className="w-10 h-10 border-2 border-primary-200 border-t-primary-900 rounded-full animate-spin mb-6" />
                    <h3 className="font-serif text-2xl text-primary-900 mb-2">Analyzing Candidates</h3>
                    <p className="text-primary-500 text-sm">Computing TF-IDF vectors across the corpus...</p>
                  </div>
                ) : currentSearch ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                      <div className="text-sm text-primary-500">
                        Processed <strong className="text-primary-900">{currentSearch.totalCandidates}</strong> profiles in <strong className="text-primary-900">{currentSearch.elapsedMs}ms</strong>
                      </div>
                    </div>
                    <ResultsPanel
                      results={currentSearch.results}
                      onSelectCandidate={setSelectedCandidate}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Candidate Detail Modal */}
      <CandidateModal
        result={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
}
