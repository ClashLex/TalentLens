import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  candidates,
  candidateSkills,
  workExperience,
  activitySignals,
} from "@/db/schema";
import { generateCandidates } from "@/lib/seed/generate";
import { sql } from "drizzle-orm";

export async function POST() {
  try {
    // Check if data already exists
    const existing = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(candidates);
    if (existing[0].count > 0) {
      return NextResponse.json({
        message: `Database already seeded with ${existing[0].count} candidates`,
        count: existing[0].count,
      });
    }

    const generated = generateCandidates(100);

    for (const c of generated) {
      // Insert candidate
      await db.insert(candidates).values({
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
        yearsOfExperience: c.yearsOfExperience,
        educationLevel: c.educationLevel,
        educationField: c.educationField,
        university: c.university,
        avatarUrl: c.avatarUrl,
        linkedinUrl: c.linkedinUrl,
        githubUrl: c.githubUrl,
        portfolioUrl: c.portfolioUrl,
        willingToRelocate: c.willingToRelocate,
        remotePreference: c.remotePreference,
        salaryExpectation: c.salaryExpectation,
        noticePeriodDays: c.noticePeriodDays,
      });

      // Insert skills
      for (const skill of c.skills) {
        await db.insert(candidateSkills).values({
          candidateId: c.id,
          skillName: skill.skillName,
          proficiencyLevel: skill.proficiencyLevel,
          yearsUsed: skill.yearsUsed,
          isPrimary: skill.isPrimary,
        });
      }

      // Insert experience
      for (const exp of c.experience) {
        await db.insert(workExperience).values({
          candidateId: c.id,
          company: exp.company,
          title: exp.title,
          startYear: exp.startYear,
          endYear: exp.endYear,
          description: exp.description,
          industry: exp.industry,
          isManagement: exp.isManagement,
          teamSize: exp.teamSize,
        });
      }

      // Insert activity signals
      for (const signal of c.activitySignals) {
        await db.insert(activitySignals).values({
          candidateId: c.id,
          signalType: signal.signalType,
          signalValue: signal.signalValue,
          metadata: signal.metadata,
        });
      }
    }

    return NextResponse.json({
      message: `Seeded ${generated.length} candidates successfully`,
      count: generated.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
