import { NextResponse } from "next/server";
import { db } from "@/db";
import { candidates, candidateSkills, jobDescriptions } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const [candidateCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(candidates);

    const [skillCount] = await db
      .select({ count: sql<number>`count(distinct skill_name)::int` })
      .from(candidateSkills);

    const [searchCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(jobDescriptions);

    const topSkills = await db
      .select({
        skillName: candidateSkills.skillName,
        count: sql<number>`count(*)::int`,
      })
      .from(candidateSkills)
      .groupBy(candidateSkills.skillName)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    return NextResponse.json({
      totalCandidates: candidateCount.count,
      uniqueSkills: skillCount.count,
      totalSearches: searchCount.count,
      topSkills,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
