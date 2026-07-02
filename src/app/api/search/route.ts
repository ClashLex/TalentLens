import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  candidates,
  candidateSkills,
  workExperience,
  activitySignals,
  jobDescriptions,
  searchResults,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { parseJobDescription } from "@/lib/nlp/job-parser";
import { rankCandidates, CandidateData } from "@/lib/engine/ranker";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, jobDescription, filters } = body;

    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: "Job title and description are required" },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Parse the job description using NLP
    const parsedJob = parseJobDescription(jobTitle, jobDescription);

    // Save the job description
    const [savedJob] = await db
      .insert(jobDescriptions)
      .values({
        title: jobTitle,
        rawDescription: jobDescription,
        company: filters?.company || null,
        location: filters?.location || null,
        remotePolicy: filters?.remotePolicy || null,
        seniorityLevel: parsedJob.seniorityLevel,
        industry: parsedJob.industryKeywords[0] || null,
        salaryMin: filters?.salaryMin || null,
        salaryMax: filters?.salaryMax || null,
        parsedSkills: {
          required: parsedJob.requiredSkills,
          preferred: parsedJob.preferredSkills,
        },
        parsedRequirements: {
          seniority: parsedJob.seniorityLevel,
          minYears: parsedJob.minYearsExperience,
          management: parsedJob.managementRequired,
          education: parsedJob.educationPreference,
          remote: parsedJob.remoteCompatible,
          softSkills: parsedJob.softSkills,
        },
      })
      .returning();

    // Fetch all candidates with full data
    const allCandidates = await db.select().from(candidates);

    // Fetch related data for each candidate
    const candidateDataArray: CandidateData[] = await Promise.all(
      allCandidates.map(async (c) => {
        const skills = await db
          .select()
          .from(candidateSkills)
          .where(eq(candidateSkills.candidateId, c.id));
        const experience = await db
          .select()
          .from(workExperience)
          .where(eq(workExperience.candidateId, c.id));
        const signals = await db
          .select()
          .from(activitySignals)
          .where(eq(activitySignals.candidateId, c.id));

        return {
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          headline: c.headline,
          summary: c.summary,
          location: c.location,
          currentTitle: c.currentTitle,
          currentCompany: c.currentCompany,
          industry: c.industry,
          yearsOfExperience: c.yearsOfExperience ?? 0,
          educationLevel: c.educationLevel,
          educationField: c.educationField,
          university: c.university,
          avatarUrl: c.avatarUrl,
          linkedinUrl: c.linkedinUrl,
          githubUrl: c.githubUrl,
          portfolioUrl: c.portfolioUrl,
          willingToRelocate: c.willingToRelocate ?? false,
          remotePreference: c.remotePreference,
          salaryExpectation: c.salaryExpectation,
          noticePeriodDays: c.noticePeriodDays,
          skills: skills.map((s) => ({
            skillName: s.skillName,
            proficiencyLevel: s.proficiencyLevel ?? 3,
            yearsUsed: s.yearsUsed ?? 1,
            isPrimary: s.isPrimary ?? false,
          })),
          experience: experience.map((e) => ({
            company: e.company,
            title: e.title,
            startYear: e.startYear,
            endYear: e.endYear,
            description: e.description,
            industry: e.industry,
            isManagement: e.isManagement ?? false,
            teamSize: e.teamSize,
          })),
          activitySignals: signals.map((s) => ({
            signalType: s.signalType,
            signalValue: s.signalValue ?? 0,
            metadata: (s.metadata as Record<string, unknown>) || null,
            recordedAt: s.recordedAt ?? new Date(),
          })),
        };
      })
    );

    // Run the ranking engine
    const rankings = rankCandidates(
      candidateDataArray,
      parsedJob,
      jobTitle,
      jobDescription
    );

    // Save search results
    for (let i = 0; i < rankings.length; i++) {
      const r = rankings[i];
      await db.insert(searchResults).values({
        jobDescriptionId: savedJob.id,
        candidateId: r.candidateId,
        overallScore: r.overallScore,
        skillMatchScore: r.skillMatchScore,
        experienceScore: r.experienceScore,
        culturalFitScore: r.culturalFitScore,
        activityScore: r.activityScore,
        trajectoryScore: r.trajectoryScore,
        scoreBreakdown: r.scoreBreakdown as unknown as Record<string, unknown>,
        rank: i + 1,
      });
    }

    // Build response with candidate details
    const rankedCandidates = rankings.map((r, idx) => {
      const candidate = candidateDataArray.find((c) => c.id === r.candidateId)!;
      return {
        rank: idx + 1,
        candidate: {
          id: candidate.id,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          email: candidate.email,
          headline: candidate.headline,
          summary: candidate.summary,
          currentTitle: candidate.currentTitle,
          currentCompany: candidate.currentCompany,
          location: candidate.location,
          industry: candidate.industry,
          yearsOfExperience: candidate.yearsOfExperience,
          educationLevel: candidate.educationLevel,
          university: candidate.university,
          linkedinUrl: candidate.linkedinUrl,
          githubUrl: candidate.githubUrl,
          portfolioUrl: candidate.portfolioUrl,
          remotePreference: candidate.remotePreference,
          skills: candidate.skills.slice(0, 10),
          experience: candidate.experience,
        },
        scores: {
          overall: r.overallScore,
          skillMatch: r.skillMatchScore,
          experience: r.experienceScore,
          culturalFit: r.culturalFitScore,
          activity: r.activityScore,
          trajectory: r.trajectoryScore,
        },
        breakdown: r.scoreBreakdown,
      };
    });

    const elapsed = Date.now() - startTime;

    return NextResponse.json({
      jobId: savedJob.id,
      parsedJob,
      results: rankedCandidates,
      totalCandidates: allCandidates.length,
      elapsedMs: elapsed,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", details: String(error) },
      { status: 500 }
    );
  }
}
