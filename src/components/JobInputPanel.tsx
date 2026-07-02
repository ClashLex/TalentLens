"use client";

import { useState, useEffect, useRef } from "react";

interface JobInputPanelProps {
  onSearch: (title: string, description: string) => void;
  searching: boolean;
  seeded: boolean;
}

const EXAMPLE_JOBS = [
  {
    title: "Senior Full Stack Engineer",
    description: `We are looking for a Senior Full Stack Engineer to join our growing team. 

Requirements:
- 5+ years of experience in software development
- Strong proficiency in React, TypeScript, and Node.js
- Experience with PostgreSQL or similar relational databases
- Experience with cloud services (AWS preferred)
- Understanding of RESTful APIs and GraphQL
- Experience with Docker and CI/CD pipelines
- Strong problem-solving and communication skills

Preferred:
- Experience with Next.js or similar frameworks
- Familiarity with Kubernetes and microservices architecture
- Experience with TailwindCSS
- Background in agile/scrum methodology
- Experience leading small teams

We offer remote-friendly work in a SaaS company building developer tools.`,
  },
  {
    title: "Machine Learning Engineer",
    description: `Join our AI team as a Machine Learning Engineer to build and deploy production ML systems.

Requirements:
- Master's degree or PhD in Computer Science, Mathematics, or related field
- 3+ years of experience with Python and machine learning frameworks
- Strong experience with TensorFlow or PyTorch
- Experience with NLP and deep learning
- Proficiency in scikit-learn, pandas, and numpy
- Experience deploying ML models to production
- Knowledge of Docker and cloud platforms (AWS/GCP)

Nice to have:
- Published research in ML/AI conferences
- Experience with MLOps tools (MLflow, Kubeflow)
- Knowledge of Spark and distributed computing
- Experience with computer vision
- Background in healthcare or fintech domain

Remote position. Looking for a senior-level candidate with strong analytical and communication skills.`,
  },
];

export function JobInputPanel({
  onSearch,
  searching,
  seeded,
}: JobInputPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSearch(title.trim(), description.trim());
    }
  };

  const loadExample = (idx: number) => {
    const example = EXAMPLE_JOBS[idx];
    setTitle(example.title);

    setIsTyping(true);
    setDescription("");
    let i = 0;
    const speed = 2;
    const typeNext = () => {
      if (i < example.description.length) {
        setDescription(example.description.slice(0, i + speed));
        i += speed;
        typingRef.current = setTimeout(typeNext, 8);
      } else {
        setDescription(example.description);
        setIsTyping(false);
      }
    };
    if (typingRef.current) clearTimeout(typingRef.current);
    typeNext();
  };

  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  const isReady = seeded && title.trim() && description.trim() && !searching && !isTyping;
  const charCount = description.length;

  return (
    <div className="editorial-card p-8 md:p-10">
      {/* Quick Load Examples */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-primary-200 pb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-primary-500 shrink-0">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_JOBS.map((job, i) => (
            <button
              key={i}
              onClick={() => loadExample(i)}
              disabled={isTyping}
              className="text-[13px] px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-900 hover:text-white transition-colors disabled:opacity-50"
            >
              {job.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Senior Full Stack Engineer"
            className="editorial-input w-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-primary-900">
              Job Description
            </label>
            <span className="text-[11px] font-medium text-primary-500 tracking-wide">
              {charCount > 0 ? `${charCount} characters` : ''}
              {isTyping && <span className="ml-2 text-accent-500 italic">typing...</span>}
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={10}
            placeholder="Paste the complete job description here..."
            className="editorial-input w-full resize-y min-h-[200px]"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={!isReady}
            className="editorial-button disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
          >
            {searching ? "Analyzing Candidates..." : "Discover Top Matches"}
          </button>
        </div>
      </form>
    </div>
  );
}
