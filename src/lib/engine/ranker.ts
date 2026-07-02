// ═══════════════════════════════════════════════════════════
// Intelligent Candidate Ranking Engine v2
// Multi-signal scoring with TF-IDF, skill-graph inference,
// contextual relevance, and career trajectory analysis
// ═══════════════════════════════════════════════════════════

import { ParsedJob } from "../nlp/job-parser";
import {
  tokenizeAndStem,
  buildTfVector,
  buildIdfVector,
  buildTfIdfVector,
  cosineSimilarity,
  normalizeSkill,
} from "../nlp/tokenizer";
import { getSkillSimilarity } from "../nlp/skill-graph";

export interface CandidateData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  headline: string | null;
  summary: string | null;
  location: string | null;
  currentTitle: string | null;
  currentCompany: string | null;
  industry: string | null;
  yearsOfExperience: number;
  educationLevel: string | null;
  educationField: string | null;
  university: string | null;
  avatarUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  willingToRelocate: boolean;
  remotePreference: string | null;
  salaryExpectation: number | null;
  noticePeriodDays: number | null;
  skills: CandidateSkillData[];
  experience: WorkExperienceData[];
  activitySignals: ActivitySignalData[];
}

export interface CandidateSkillData {
  skillName: string;
  proficiencyLevel: number;
  yearsUsed: number;
  isPrimary: boolean;
}

export interface WorkExperienceData {
  company: string;
  title: string;
  startYear: number;
  endYear: number | null;
  description: string | null;
  industry: string | null;
  isManagement: boolean;
  teamSize: number | null;
}

export interface ActivitySignalData {
  signalType: string;
  signalValue: number;
  metadata: Record<string, unknown> | null;
  recordedAt: Date;
}

export interface RankingResult {
  candidateId: string;
  overallScore: number;
  skillMatchScore: number;
  experienceScore: number;
  culturalFitScore: number;
  activityScore: number;
  trajectoryScore: number;
  scoreBreakdown: ScoreBreakdown;
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

// ─── Dynamic Weight Configuration ─────────────────────────
// Weights adjust based on the type of role detected
interface WeightProfile {
  skillMatch: number;
  experience: number;
  culturalFit: number;
  activity: number;
  trajectory: number;
}

function getWeightProfile(parsedJob: ParsedJob): WeightProfile {
  // Detect role archetype from skills and keywords
  const allSkills = [...parsedJob.requiredSkills, ...parsedJob.preferredSkills]
    .map(s => s.skill.toLowerCase());

  const isDataRole = allSkills.some(s =>
    ["machine learning", "data science", "tensorflow", "pytorch", "deep learning",
     "nlp", "computer vision", "data engineering", "spark", "pandas"].includes(s)
  );
  const isDevOpsRole = allSkills.some(s =>
    ["kubernetes", "docker", "terraform", "aws", "ci/cd", "devops", "sre",
     "ansible", "prometheus", "infrastructure"].includes(s)
  );
  const isManagementRole = parsedJob.managementRequired || parsedJob.teamLeadership;

  if (isDataRole) {
    return { skillMatch: 0.40, experience: 0.20, culturalFit: 0.10, activity: 0.15, trajectory: 0.15 };
  }
  if (isDevOpsRole) {
    return { skillMatch: 0.35, experience: 0.25, culturalFit: 0.10, activity: 0.15, trajectory: 0.15 };
  }
  if (isManagementRole) {
    return { skillMatch: 0.25, experience: 0.25, culturalFit: 0.20, activity: 0.10, trajectory: 0.20 };
  }
  // Default engineering profile
  return { skillMatch: 0.35, experience: 0.20, culturalFit: 0.15, activity: 0.15, trajectory: 0.15 };
}

// ─── Main Ranking Function ────────────────────────────────
export function rankCandidates(
  candidates: CandidateData[],
  parsedJob: ParsedJob,
  jobTitle: string,
  jobDescription: string
): RankingResult[] {
  const weights = getWeightProfile(parsedJob);

  // Build TF-IDF corpus from all candidates + job
  const jobText = `${jobTitle} ${jobDescription}`;
  const jobTokens = tokenizeAndStem(jobText);

  const candidateTexts = candidates.map(buildCandidateText);
  const candidateTokenArrays = candidateTexts.map(tokenizeAndStem);

  // Build IDF from the full corpus (all candidates + job)
  const corpus = [jobTokens, ...candidateTokenArrays];
  const idf = buildIdfVector(corpus);

  // Build TF-IDF vector for the job
  const jobTfIdf = buildTfIdfVector(jobTokens, idf);

  const results: RankingResult[] = candidates.map((candidate, idx) => {
    const skillScore = computeSkillMatchScore(candidate, parsedJob);
    const expScore = computeExperienceScore(candidate, parsedJob);
    const culturalScore = computeCulturalFitScore(candidate, parsedJob, jobDescription);
    const actScore = computeActivityScore(candidate);
    const trajScore = computeTrajectoryScore(candidate, parsedJob);

    // TF-IDF semantic similarity (much better than raw TF)
    const candidateTfIdf = buildTfIdfVector(candidateTokenArrays[idx], idf);
    const semanticSim = cosineSimilarity(jobTfIdf, candidateTfIdf);

    // Weighted combination with semantic boost
    const baseScore =
      skillScore.score * weights.skillMatch +
      expScore.score * weights.experience +
      culturalScore.score * weights.culturalFit +
      actScore.score * weights.activity +
      trajScore.score * weights.trajectory;

    // Semantic similarity acts as a multiplier (0.85 to 1.15x)
    const semanticMultiplier = 0.85 + semanticSim * 0.30;
    const overallScore = Math.min(100, baseScore * semanticMultiplier);

    const breakdown: ScoreBreakdown = {
      matchedRequiredSkills: skillScore.matchedRequired,
      matchedPreferredSkills: skillScore.matchedPreferred,
      missingCriticalSkills: skillScore.missingCritical,
      adjacentSkillMatches: skillScore.adjacentMatches,
      semanticSimilarity: Math.round(semanticSim * 100),
      seniorityAlignment: expScore.seniorityMatch,
      industryMatch: culturalScore.industryMatch,
      locationFit: culturalScore.locationFit,
      careerTrajectory: trajScore.trajectory,
      topSignals: actScore.topSignals,
      highlights: generateHighlights(candidate, parsedJob, skillScore, expScore, trajScore),
      concerns: generateConcerns(candidate, parsedJob, skillScore, expScore),
    };

    return {
      candidateId: candidate.id,
      overallScore: Math.round(overallScore * 10) / 10,
      skillMatchScore: Math.round(skillScore.score * 10) / 10,
      experienceScore: Math.round(expScore.score * 10) / 10,
      culturalFitScore: Math.round(culturalScore.score * 10) / 10,
      activityScore: Math.round(actScore.score * 10) / 10,
      trajectoryScore: Math.round(trajScore.score * 10) / 10,
      scoreBreakdown: breakdown,
    };
  });

  // Sort by overall score descending
  results.sort((a, b) => b.overallScore - a.overallScore);
  return results;
}

// ─── Skill Match Scoring (with adjacency graph) ───────────
function computeSkillMatchScore(
  candidate: CandidateData,
  parsedJob: ParsedJob
) {
  const candidateSkillMap = new Map<string, CandidateSkillData>();
  for (const skill of candidate.skills) {
    const normalized = normalizeSkill(skill.skillName);
    candidateSkillMap.set(normalized, skill);
    // Also store original lowercase
    candidateSkillMap.set(skill.skillName.toLowerCase(), skill);
  }

  // Also extract skills from summary/headline/experience descriptions
  const textSkills = new Set<string>();
  const textToScan = `${candidate.headline || ""} ${candidate.summary || ""} ${candidate.experience.map((e) => `${e.title} ${e.description || ""}`).join(" ")}`;
  const lowerText = textToScan.toLowerCase();

  for (const reqSkill of [...parsedJob.requiredSkills, ...parsedJob.preferredSkills]) {
    if (lowerText.includes(reqSkill.normalized) || lowerText.includes(reqSkill.skill.toLowerCase())) {
      textSkills.add(reqSkill.normalized);
    }
  }

  let totalWeight = 0;
  let matchedWeight = 0;
  const matchedRequired: string[] = [];
  const matchedPreferred: string[] = [];
  const missingCritical: string[] = [];
  const adjacentMatches: { skill: string; via: string; weight: number }[] = [];

  for (const req of parsedJob.requiredSkills) {
    totalWeight += req.weight;
    const directMatch = candidateSkillMap.get(req.normalized) || candidateSkillMap.get(req.skill.toLowerCase());
    const textMatch = textSkills.has(req.normalized);

    if (directMatch || textMatch) {
      const skill = typeof directMatch === "object" ? directMatch : null;
      // Proficiency bonus
      const profBonus = skill ? (skill.proficiencyLevel / 5) * 0.3 : 0.15;
      // Years used bonus
      const yearsBonus = skill ? Math.min(skill.yearsUsed / 10, 0.2) : 0.05;
      matchedWeight += req.weight * (0.5 + profBonus + yearsBonus);
      matchedRequired.push(req.skill);
    } else {
      // Try adjacency-based matching
      let bestAdjacentScore = 0;
      let bestAdjacentSkill = "";
      for (const cs of candidate.skills) {
        const sim = getSkillSimilarity(cs.skillName.toLowerCase(), req.skill.toLowerCase());
        if (sim > bestAdjacentScore) {
          bestAdjacentScore = sim;
          bestAdjacentSkill = cs.skillName;
        }
        // Also check normalized
        const simNorm = getSkillSimilarity(normalizeSkill(cs.skillName), req.normalized);
        if (simNorm > bestAdjacentScore) {
          bestAdjacentScore = simNorm;
          bestAdjacentSkill = cs.skillName;
        }
      }

      if (bestAdjacentScore >= 0.4) {
        // Partial credit for adjacent skills
        matchedWeight += req.weight * bestAdjacentScore * 0.5;
        adjacentMatches.push({
          skill: req.skill,
          via: bestAdjacentSkill,
          weight: Math.round(bestAdjacentScore * 100) / 100,
        });
      } else {
        missingCritical.push(req.skill);
      }
    }
  }

  for (const pref of parsedJob.preferredSkills) {
    totalWeight += pref.weight * 0.5;
    const directMatch = candidateSkillMap.get(pref.normalized) || candidateSkillMap.get(pref.skill.toLowerCase());
    const textMatch = textSkills.has(pref.normalized);

    if (directMatch || textMatch) {
      matchedWeight += pref.weight * 0.4;
      matchedPreferred.push(pref.skill);
    } else {
      // Adjacent match for preferred (lower threshold)
      for (const cs of candidate.skills) {
        const sim = getSkillSimilarity(cs.skillName.toLowerCase(), pref.skill.toLowerCase());
        if (sim >= 0.5) {
          matchedWeight += pref.weight * sim * 0.25;
          break;
        }
      }
    }
  }

  const score = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 50;

  return {
    score: Math.min(100, score),
    matchedRequired,
    matchedPreferred,
    missingCritical,
    adjacentMatches,
  };
}

// ─── Experience Scoring (with recency weighting) ──────────
function computeExperienceScore(
  candidate: CandidateData,
  parsedJob: ParsedJob
) {
  let score = 0;

  // Years of experience alignment
  const yoe = candidate.yearsOfExperience;
  const requiredYoe = parsedJob.minYearsExperience;
  if (yoe >= requiredYoe) {
    score += 40;
    // Slight bonus for extra experience, diminishing returns
    const extraYears = yoe - requiredYoe;
    score += Math.min(extraYears * 3, 15);
    // Penalty for being massively overqualified
    if (extraYears > 10) score -= (extraYears - 10) * 2;
  } else {
    // Partial credit for close matches
    const deficit = requiredYoe - yoe;
    score += Math.max(0, 40 - deficit * 10);
  }

  // Seniority level alignment
  const seniorityMap: Record<string, number> = {
    intern: 1, junior: 2, mid: 3, senior: 4, staff: 5, director: 6, executive: 7,
  };
  const jobLevel = seniorityMap[parsedJob.seniorityLevel] || 3;
  const candidateLevel = inferSeniorityLevel(candidate);
  const levelDiff = Math.abs(jobLevel - candidateLevel);
  const seniorityMatch = Math.max(0, 100 - levelDiff * 25);
  score += seniorityMatch * 0.3;

  // Management experience alignment
  if (parsedJob.managementRequired || parsedJob.teamLeadership) {
    const hasManagement = candidate.experience.some((e) => e.isManagement);
    const hasLeadTitle = candidate.experience.some((e) =>
      /\b(lead|manager|director|head|vp|chief)\b/i.test(e.title)
    );
    if (hasManagement || hasLeadTitle) score += 15;
  }

  // Education alignment
  if (parsedJob.educationPreference) {
    const educationScore = matchEducation(
      candidate.educationLevel,
      parsedJob.educationPreference
    );
    score += educationScore * 0.1;
  }

  // ─── Recency weighting ──────────────────────────────────
  // Recent roles in relevant areas count more
  const currentYear = new Date().getFullYear();
  const sortedExp = [...candidate.experience].sort((a, b) => {
    const aEnd = a.endYear || currentYear;
    const bEnd = b.endYear || currentYear;
    return bEnd - aEnd;
  });

  if (sortedExp.length > 0) {
    const mostRecent = sortedExp[0];
    // Bonus for currently employed
    if (mostRecent.endYear === null) score += 3;

    // Check if recent role title aligns with job
    const recentTitle = (mostRecent.title || "").toLowerCase();
    for (const rk of parsedJob.roleKeywords.slice(0, 5)) {
      if (recentTitle.includes(rk.toLowerCase())) {
        score += 5;
        break;
      }
    }
  }

  return {
    score: Math.min(100, score),
    seniorityMatch,
  };
}

// ─── Cultural Fit Scoring ─────────────────────────────────
function computeCulturalFitScore(
  candidate: CandidateData,
  parsedJob: ParsedJob,
  jobDescription: string
) {
  let score = 50; // baseline
  let industryMatch = 0;
  let locationFit = 50;

  // Industry alignment
  if (parsedJob.industryKeywords.length > 0 && candidate.industry) {
    const candidateIndustry = candidate.industry.toLowerCase();
    for (const ik of parsedJob.industryKeywords) {
      if (candidateIndustry.includes(ik.toLowerCase())) {
        industryMatch = 100;
        score += 20;
        break;
      }
    }
    // Check work experience industries
    if (industryMatch === 0) {
      for (const exp of candidate.experience) {
        if (exp.industry) {
          for (const ik of parsedJob.industryKeywords) {
            if (exp.industry.toLowerCase().includes(ik.toLowerCase())) {
              industryMatch = 70;
              score += 15;
              break;
            }
          }
        }
        if (industryMatch > 0) break;
      }
    }
  } else {
    industryMatch = 50;
  }

  // Remote compatibility
  if (parsedJob.remoteCompatible) {
    if (candidate.remotePreference === "remote") {
      locationFit = 100;
      score += 15;
    } else if (candidate.remotePreference === "hybrid") {
      locationFit = 70;
      score += 10;
    }
  }

  // Willingness to relocate
  if (candidate.willingToRelocate) {
    locationFit = Math.max(locationFit, 80);
    score += 5;
  }

  // Soft skills match via text analysis
  const candidateText = `${candidate.summary || ""} ${candidate.headline || ""}`.toLowerCase();
  let softSkillMatches = 0;
  for (const ss of parsedJob.softSkills) {
    if (candidateText.includes(ss.toLowerCase())) {
      softSkillMatches++;
    }
  }
  if (parsedJob.softSkills.length > 0) {
    score += (softSkillMatches / parsedJob.softSkills.length) * 10;
  }

  // Domain expertise match
  if (parsedJob.domainExpertise.length > 0) {
    let domainMatches = 0;
    for (const de of parsedJob.domainExpertise) {
      if (candidateText.includes(de.toLowerCase())) domainMatches++;
    }
    score += Math.min(5, domainMatches * 2);
  }

  return {
    score: Math.min(100, score),
    industryMatch,
    locationFit,
  };
}

// ─── Activity/Behavioral Signal Scoring ───────────────────
function computeActivityScore(candidate: CandidateData) {
  let score = 50; // baseline
  const topSignals: string[] = [];

  for (const signal of candidate.activitySignals) {
    switch (signal.signalType) {
      case "profile_completeness":
        score += signal.signalValue * 0.1;
        if (signal.signalValue > 80) topSignals.push("Complete profile");
        break;
      case "job_search_activity":
        score += signal.signalValue * 0.15;
        if (signal.signalValue > 50) topSignals.push("Actively looking");
        break;
      case "response_rate":
        score += signal.signalValue * 0.12;
        if (signal.signalValue > 70) topSignals.push("High response rate");
        break;
      case "content_engagement":
        score += signal.signalValue * 0.05;
        if (signal.signalValue > 60) topSignals.push("Industry thought leader");
        break;
      case "skill_endorsements":
        score += signal.signalValue * 0.08;
        if (signal.signalValue > 50) topSignals.push("Highly endorsed");
        break;
      case "certification_recent":
        score += signal.signalValue * 0.1;
        if (signal.signalValue > 0) topSignals.push("Recent certifications");
        break;
      case "open_to_opportunities":
        score += signal.signalValue * 0.2;
        if (signal.signalValue > 50) topSignals.push("Open to opportunities");
        break;
      case "github_contributions":
        score += signal.signalValue * 0.08;
        if (signal.signalValue > 50) topSignals.push("Active open source contributor");
        break;
      case "conference_speaker":
        score += signal.signalValue * 0.06;
        if (signal.signalValue > 0) topSignals.push("Conference speaker");
        break;
      case "blog_publications":
        score += signal.signalValue * 0.04;
        if (signal.signalValue > 0) topSignals.push("Published author");
        break;
      case "mentoring_activity":
        score += signal.signalValue * 0.06;
        if (signal.signalValue > 40) topSignals.push("Active mentor");
        break;
      case "patent_filed":
        score += signal.signalValue * 0.08;
        if (signal.signalValue > 0) topSignals.push("Patent holder");
        break;
      case "hackathon_winner":
        score += signal.signalValue * 0.07;
        if (signal.signalValue > 0) topSignals.push("Hackathon winner");
        break;
      case "community_moderator":
        score += signal.signalValue * 0.05;
        if (signal.signalValue > 0) topSignals.push("Community leader");
        break;
      default:
        score += signal.signalValue * 0.03;
    }
  }

  // Recency bonus - more recent signals are more valuable
  const now = Date.now();
  const recentSignals = candidate.activitySignals.filter(
    (s) => now - new Date(s.recordedAt).getTime() < 30 * 24 * 60 * 60 * 1000
  );
  if (recentSignals.length > 0) {
    score += 5;
    topSignals.push("Recent platform activity");
  }

  // Portfolio / GitHub presence bonus
  if (candidate.githubUrl) score += 3;
  if (candidate.portfolioUrl) score += 2;

  return {
    score: Math.min(100, Math.max(0, score)),
    topSignals: topSignals.slice(0, 5),
  };
}

// ─── Career Trajectory Scoring ────────────────────────────
function computeTrajectoryScore(
  candidate: CandidateData,
  parsedJob: ParsedJob
) {
  const experience = [...candidate.experience].sort(
    (a, b) => a.startYear - b.startYear
  );

  if (experience.length === 0) {
    return { score: 30, trajectory: "No work history" };
  }

  let score = 40;
  let trajectory = "Stable";

  // Career progression analysis
  const titles = experience.map((e) => e.title);
  const levels = titles.map(inferTitleLevel);
  let progressionCount = 0;
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1]) progressionCount++;
  }
  const progressionRate = levels.length > 1
    ? progressionCount / (levels.length - 1)
    : 0;

  if (progressionRate > 0.5) {
    score += 25;
    trajectory = "Strong upward trajectory";
  } else if (progressionRate > 0.25) {
    score += 15;
    trajectory = "Steady growth";
  } else if (progressionRate === 0 && levels.length > 1) {
    score += 5;
    trajectory = "Lateral moves / specialist path";
  }

  // Tenure stability
  const tenures = experience.map((e) => {
    const end = e.endYear || new Date().getFullYear();
    return end - e.startYear;
  });
  const avgTenure = tenures.reduce((a, b) => a + b, 0) / tenures.length;
  if (avgTenure >= 2) {
    score += 15;
  } else if (avgTenure < 1) {
    score -= 10;
    trajectory += " (frequent moves)";
  }

  // Relevance of most recent role
  const mostRecent = experience[experience.length - 1];
  if (mostRecent && mostRecent.endYear === null) {
    score += 5; // Currently employed bonus
  }

  // Team size growth
  const teamSizes = experience
    .filter((e) => e.teamSize !== null)
    .map((e) => e.teamSize!);
  if (teamSizes.length > 1) {
    const teamGrowth = teamSizes[teamSizes.length - 1] > teamSizes[0];
    if (teamGrowth && (parsedJob.managementRequired || parsedJob.teamLeadership)) {
      score += 10;
      trajectory += " + growing leadership scope";
    }
  }

  // Company quality signal — known companies get a slight bonus
  const knownCompanies = new Set([
    "google","meta","amazon","microsoft","apple","netflix","stripe","airbnb",
    "uber","spotify","datadog","snowflake","openai","anthropic","deepmind",
    "palantir","databricks","coinbase","shopify","twilio","square",
  ]);
  const hasKnownCompany = experience.some(e =>
    knownCompanies.has(e.company.toLowerCase())
  );
  if (hasKnownCompany) {
    score += 5;
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    trajectory,
  };
}

// ─── Helper Functions ─────────────────────────────────────

function inferSeniorityLevel(candidate: CandidateData): number {
  const title = (candidate.currentTitle || "").toLowerCase();
  if (/\b(chief|cto|ceo|cio|vp|vice president)\b/.test(title)) return 7;
  if (/\b(director|head)\b/.test(title)) return 6;
  if (/\b(staff|principal|architect)\b/.test(title)) return 5;
  if (/\b(senior|sr\.?|lead)\b/.test(title)) return 4;
  if (/\b(mid|intermediate)\b/.test(title)) return 3;
  if (/\b(junior|jr\.?|associate)\b/.test(title)) return 2;
  if (/\b(intern|trainee)\b/.test(title)) return 1;
  // Infer from years
  if (candidate.yearsOfExperience >= 10) return 5;
  if (candidate.yearsOfExperience >= 5) return 4;
  if (candidate.yearsOfExperience >= 3) return 3;
  return 2;
}

function inferTitleLevel(title: string): number {
  const t = title.toLowerCase();
  if (/\b(chief|cto|ceo|cio|vp)\b/.test(t)) return 7;
  if (/\b(director|head)\b/.test(t)) return 6;
  if (/\b(staff|principal|architect)\b/.test(t)) return 5;
  if (/\b(senior|sr\.?|lead)\b/.test(t)) return 4;
  if (/\b(mid)\b/.test(t)) return 3;
  if (/\b(junior|jr\.?|associate)\b/.test(t)) return 2;
  if (/\b(intern|trainee)\b/.test(t)) return 1;
  return 3;
}

function matchEducation(
  candidateLevel: string | null,
  requiredLevel: string
): number {
  const levels: Record<string, number> = {
    "high school": 1,
    "associate": 2,
    "bachelors": 3,
    "masters": 4,
    "phd": 5,
  };
  const cLevel = levels[(candidateLevel || "").toLowerCase()] || 0;
  const rLevel = levels[requiredLevel.toLowerCase()] || 0;
  if (cLevel >= rLevel) return 100;
  if (cLevel === rLevel - 1) return 60;
  return 20;
}

function buildCandidateText(candidate: CandidateData): string {
  const parts = [
    candidate.headline || "",
    candidate.summary || "",
    candidate.currentTitle || "",
    candidate.industry || "",
    ...candidate.skills.map((s) => s.skillName),
    ...candidate.experience.map((e) => `${e.title} ${e.company} ${e.description || ""}`),
  ];
  return parts.join(" ");
}

function generateHighlights(
  candidate: CandidateData,
  parsedJob: ParsedJob,
  skillScore: { matchedRequired: string[]; matchedPreferred: string[]; adjacentMatches: { skill: string; via: string; weight: number }[] },
  expScore: { seniorityMatch: number },
  trajScore: { trajectory: string }
): string[] {
  const highlights: string[] = [];

  if (skillScore.matchedRequired.length > 0) {
    highlights.push(
      `Matches ${skillScore.matchedRequired.length}/${parsedJob.requiredSkills.length} required skills`
    );
  }

  if (skillScore.adjacentMatches.length > 0) {
    highlights.push(
      `${skillScore.adjacentMatches.length} adjacent skill matches`
    );
  }

  if (expScore.seniorityMatch >= 75) {
    highlights.push("Seniority level well-aligned");
  }

  if (trajScore.trajectory.includes("upward")) {
    highlights.push("Strong career progression");
  }

  if (candidate.skills.some((s) => s.isPrimary && s.proficiencyLevel >= 4)) {
    highlights.push("Expert-level primary skills");
  }

  if (candidate.githubUrl) {
    highlights.push("Active GitHub presence");
  }

  if (candidate.portfolioUrl) {
    highlights.push("Has portfolio/personal site");
  }

  return highlights.slice(0, 5);
}

function generateConcerns(
  candidate: CandidateData,
  parsedJob: ParsedJob,
  skillScore: { missingCritical: string[] },
  expScore: { seniorityMatch: number }
): string[] {
  const concerns: string[] = [];

  if (skillScore.missingCritical.length > 0) {
    concerns.push(
      `Missing ${skillScore.missingCritical.length} critical skill(s): ${skillScore.missingCritical.slice(0, 3).join(", ")}`
    );
  }

  if (expScore.seniorityMatch < 50) {
    concerns.push("Seniority level mismatch");
  }

  if (candidate.yearsOfExperience < parsedJob.minYearsExperience) {
    concerns.push(
      `${parsedJob.minYearsExperience - candidate.yearsOfExperience} years below minimum experience`
    );
  }

  if (candidate.yearsOfExperience > parsedJob.minYearsExperience + 12) {
    concerns.push("Potentially overqualified");
  }

  return concerns.slice(0, 3);
}
