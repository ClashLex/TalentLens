export interface Stats {
  totalCandidates: number;
  uniqueSkills: number;
  totalSearches: number;
  topSkills: { skillName: string; count: number }[];
}

export interface SkillRequirement {
  skill: string;
  normalized: string;
  weight: number;
  context: string;
}

export interface ParsedJob {
  requiredSkills: SkillRequirement[];
  preferredSkills: SkillRequirement[];
  seniorityLevel: string;
  minYearsExperience: number;
  industryKeywords: string[];
  roleKeywords: string[];
  softSkills: string[];
  managementRequired: boolean;
  teamLeadership: boolean;
  educationPreference: string | null;
  remoteCompatible: boolean;
  domainExpertise: string[];
}

export interface CandidateSkill {
  skillName: string;
  proficiencyLevel: number;
  yearsUsed: number;
  isPrimary: boolean;
}

export interface CandidateExperience {
  company: string;
  title: string;
  startYear: number;
  endYear: number | null;
  description: string | null;
  industry: string | null;
  isManagement: boolean;
  teamSize: number | null;
}

export interface CandidateInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  headline: string | null;
  summary: string | null;
  currentTitle: string | null;
  currentCompany: string | null;
  location: string | null;
  industry: string | null;
  yearsOfExperience: number;
  educationLevel: string | null;
  university: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  remotePreference: string | null;
  skills: CandidateSkill[];
  experience: CandidateExperience[];
}

export interface ScoreBreakdown {
  matchedRequiredSkills: string[];
  matchedPreferredSkills: string[];
  missingCriticalSkills: string[];
  adjacentSkillMatches: { skill: string; via: string; weight: number }[];
  semanticSimilarity: number;
  seniorityAlignment: number;
  industryMatch: number;
  locationFit: number;
  careerTrajectory: string;
  topSignals: string[];
  highlights: string[];
  concerns: string[];
}

export interface Scores {
  overall: number;
  skillMatch: number;
  experience: number;
  culturalFit: number;
  activity: number;
  trajectory: number;
}

export interface RankedCandidate {
  rank: number;
  candidate: CandidateInfo;
  scores: Scores;
  breakdown: ScoreBreakdown;
}

export interface SearchResponse {
  jobId: string;
  parsedJob: ParsedJob;
  results: RankedCandidate[];
  totalCandidates: number;
  elapsedMs: number;
}
