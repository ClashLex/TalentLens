import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  candidates,
  candidateSkills,
  workExperience,
  activitySignals,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [candidate] = await db
      .select()
      .from(candidates)
      .where(eq(candidates.id, id));

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    const skills = await db
      .select()
      .from(candidateSkills)
      .where(eq(candidateSkills.candidateId, id));
    const experience = await db
      .select()
      .from(workExperience)
      .where(eq(workExperience.candidateId, id));
    const signals = await db
      .select()
      .from(activitySignals)
      .where(eq(activitySignals.candidateId, id));

    return NextResponse.json({
      ...candidate,
      skills,
      experience: experience.sort((a, b) => b.startYear - a.startYear),
      activitySignals: signals,
    });
  } catch (error) {
    console.error("Candidate fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch candidate" },
      { status: 500 }
    );
  }
}
