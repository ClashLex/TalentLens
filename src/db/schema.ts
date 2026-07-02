import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// ─── Candidates ───────────────────────────────────────────
export const candidates = pgTable("candidates", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  headline: varchar("headline", { length: 300 }),
  summary: text("summary"),
  location: varchar("location", { length: 200 }),
  currentTitle: varchar("current_title", { length: 200 }),
  currentCompany: varchar("current_company", { length: 200 }),
  industry: varchar("industry", { length: 150 }),
  yearsOfExperience: integer("years_of_experience").default(0),
  educationLevel: varchar("education_level", { length: 100 }),
  educationField: varchar("education_field", { length: 200 }),
  university: varchar("university", { length: 300 }),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  githubUrl: varchar("github_url", { length: 500 }),
  portfolioUrl: varchar("portfolio_url", { length: 500 }),
  willingToRelocate: boolean("willing_to_relocate").default(false),
  remotePreference: varchar("remote_preference", { length: 50 }).default("hybrid"),
  salaryExpectation: integer("salary_expectation"),
  noticePeriodDays: integer("notice_period_days").default(30),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Candidate Skills ─────────────────────────────────────
export const candidateSkills = pgTable("candidate_skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  skillName: varchar("skill_name", { length: 150 }).notNull(),
  proficiencyLevel: integer("proficiency_level").default(3), // 1-5
  yearsUsed: integer("years_used").default(1),
  isPrimary: boolean("is_primary").default(false),
});

// ─── Work Experience ──────────────────────────────────────
export const workExperience = pgTable("work_experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  company: varchar("company", { length: 250 }).notNull(),
  title: varchar("title", { length: 250 }).notNull(),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"), // null = current
  description: text("description"),
  industry: varchar("industry", { length: 150 }),
  isManagement: boolean("is_management").default(false),
  teamSize: integer("team_size"),
});

// ─── Activity Signals (behavioral data) ───────────────────
export const activitySignals = pgTable("activity_signals", {
  id: uuid("id").primaryKey().defaultRandom(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  signalType: varchar("signal_type", { length: 100 }).notNull(),
  signalValue: real("signal_value").default(0),
  metadata: jsonb("metadata"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// ─── Job Descriptions ─────────────────────────────────────
export const jobDescriptions = pgTable("job_descriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 300 }).notNull(),
  rawDescription: text("raw_description").notNull(),
  company: varchar("company", { length: 250 }),
  location: varchar("location", { length: 200 }),
  remotePolicy: varchar("remote_policy", { length: 50 }),
  seniorityLevel: varchar("seniority_level", { length: 100 }),
  industry: varchar("industry", { length: 150 }),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  parsedSkills: jsonb("parsed_skills"),
  parsedRequirements: jsonb("parsed_requirements"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Search Results (cached rankings) ─────────────────────
export const searchResults = pgTable("search_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobDescriptionId: uuid("job_description_id")
    .notNull()
    .references(() => jobDescriptions.id, { onDelete: "cascade" }),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  overallScore: real("overall_score").notNull(),
  skillMatchScore: real("skill_match_score").default(0),
  experienceScore: real("experience_score").default(0),
  culturalFitScore: real("cultural_fit_score").default(0),
  activityScore: real("activity_score").default(0),
  trajectoryScore: real("trajectory_score").default(0),
  scoreBreakdown: jsonb("score_breakdown"),
  rank: integer("rank"),
  createdAt: timestamp("created_at").defaultNow(),
});
