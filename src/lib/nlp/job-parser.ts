// Deep Job Description Parser
// Extracts structured requirements from natural language job descriptions

import { tokenize, normalizeSkill, extractBigrams } from "./tokenizer";

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

export interface SkillRequirement {
  skill: string;
  normalized: string;
  weight: number; // 0-1, how critical this skill is
  context: string; // "required" | "preferred" | "mentioned"
}

// Known technical skills dictionary for extraction (expanded)
const TECH_SKILLS = new Set([
  // Languages
  "javascript","typescript","python","java","c++","c#","go","golang","rust",
  "ruby","php","swift","kotlin","scala","r","matlab","perl","haskell","elixir",
  "dart","objective-c","lua","zig","v","nim","crystal","julia",
  // Frontend frameworks
  "react","angular","vue","svelte","nextjs","nuxt","gatsby","remix",
  "solidjs","qwik","astro","htmx","alpine.js","lit",
  // Backend frameworks
  "nodejs","express","django","flask","fastapi","spring","rails","laravel",
  "asp.net","dotnet",".net","nest","nestjs","hono","bun","deno","trpc",
  // Databases
  "postgresql","mysql","mongodb","redis","elasticsearch","cassandra","dynamodb",
  "sqlite","oracle","sql server","mariadb","couchdb","neo4j","cockroachdb",
  "planetscale","neon","turso","supabase","firebase",
  // ORMs & Query
  "prisma","drizzle","sequelize","typeorm","sqlalchemy","hibernate",
  // Cloud providers
  "aws","azure","gcp","google cloud","amazon web services","heroku","vercel",
  "netlify","cloudflare","digitalocean","fly.io","railway",
  // DevOps & Infra
  "docker","kubernetes","terraform","ansible","jenkins","github actions",
  "gitlab ci","circleci","travis","bamboo","pulumi","argocd","helm",
  "packer","vagrant","nomad",
  // APIs & Architecture
  "graphql","rest","grpc","websocket","soap","microservices","event-driven",
  "serverless","message queue",
  // AI & ML
  "tensorflow","pytorch","scikit-learn","keras","pandas","numpy","spark",
  "hadoop","airflow","kafka","rabbitmq","celery","mlflow","kubeflow",
  "langchain","llamaindex","huggingface","openai","anthropic",
  "stable diffusion","transformers","bert","gpt",
  // Tools & Platforms
  "git","linux","bash","nginx","apache","prometheus","grafana","datadog",
  "new relic","splunk","elasticsearch","kibana","logstash",
  "opentelemetry","jaeger","zipkin",
  // Design
  "figma","sketch","adobe xd","photoshop","illustrator","framer","canva",
  // CSS & Styling
  "tailwindcss","tailwind","bootstrap","material ui","chakra ui",
  "styled-components","emotion","vanilla extract","panda css",
  // Testing
  "jest","mocha","cypress","selenium","playwright","pytest","junit",
  "vitest","testing library","storybook","chromatic",
  // Project mgmt
  "agile","scrum","kanban","jira","confluence","linear","notion",
  // Data & AI domains
  "machine learning","deep learning","nlp","computer vision","data science",
  "data engineering","data analytics","business intelligence",
  "generative ai","large language model","prompt engineering",
  "retrieval augmented generation","mlops","feature engineering",
  // Blockchain
  "blockchain","web3","solidity","ethereum","smart contracts",
  // Mobile
  "ios","android","react native","flutter","xamarin","swiftui",
  "jetpack compose","capacitor","ionic",
  // Web fundamentals
  "html","css","sass","less","webpack","vite","rollup","esbuild",
  "turbopack","parcel",
  // Auth & Security
  "oauth","jwt","sso","ldap","saml","auth0","keycloak",
  "owasp","penetration testing","zero trust",
  // CI/CD & methodology
  "ci/cd","devops","sre","infrastructure",
  "tdd","bdd","ddd","clean architecture",
  // Messaging & Streaming
  "kafka","rabbitmq","nats","pulsar","sns","sqs","redis streams",
  // Observability
  "prometheus","grafana","datadog","new relic","pagerduty",
]);

const SOFT_SKILLS = [
  "communication","leadership","teamwork","problem solving","critical thinking",
  "adaptability","creativity","time management","collaboration","mentoring",
  "presentation","negotiation","decision making","conflict resolution",
  "strategic thinking","analytical","attention to detail","self motivated",
  "proactive","innovative","entrepreneurial","empathetic","ownership",
  "cross-functional","stakeholder management","prioritization",
];

const SENIORITY_PATTERNS: { pattern: RegExp; level: string; yearsMin: number }[] = [
  { pattern: /\b(intern|internship)\b/i, level: "intern", yearsMin: 0 },
  { pattern: /\b(junior|entry[\s-]level|associate|graduate)\b/i, level: "junior", yearsMin: 0 },
  { pattern: /\b(mid[\s-]?level|intermediate)\b/i, level: "mid", yearsMin: 3 },
  { pattern: /\b(senior|sr\.?|lead)\b/i, level: "senior", yearsMin: 5 },
  { pattern: /\b(staff|principal|architect)\b/i, level: "staff", yearsMin: 8 },
  { pattern: /\b(director|head of|vp|vice president)\b/i, level: "director", yearsMin: 10 },
  { pattern: /\b(c[\s-]?level|cto|cio|chief)\b/i, level: "executive", yearsMin: 15 },
];

const INDUSTRY_KEYWORDS = [
  "fintech","finance","banking","healthcare","healthtech","medtech",
  "e-commerce","ecommerce","retail","saas","enterprise","startup",
  "edtech","education","gaming","media","advertising","adtech",
  "cybersecurity","security","insurance","insurtech","logistics",
  "supply chain","real estate","proptech","automotive","energy",
  "cleantech","biotech","pharmaceutical","telecom","government",
  "defense","aerospace","agriculture","agtech","travel","hospitality",
  "food","foodtech","legal","legaltech","hr","hrtech","martech",
  "climate","sustainability","web3","defi","crypto",
];

export function parseJobDescription(title: string, description: string): ParsedJob {
  const fullText = `${title} ${description}`;
  const lowerText = fullText.toLowerCase();
  const tokens = tokenize(fullText);
  const bigrams = extractBigrams(tokens);

  // Extract skills
  const requiredSkills: SkillRequirement[] = [];
  const preferredSkills: SkillRequirement[] = [];

  // Split description into sections for context
  const requiredSection = extractSection(description, ["required", "must have", "requirements", "qualifications", "essential", "minimum qualifications"]);
  const preferredSection = extractSection(description, ["preferred", "nice to have", "bonus", "plus", "desired", "optional", "preferred qualifications"]);

  for (const skill of TECH_SKILLS) {
    const skillRegex = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i");
    if (skillRegex.test(fullText)) {
      const normalized = normalizeSkill(skill);
      const inRequired = requiredSection && skillRegex.test(requiredSection);
      const inPreferred = preferredSection && skillRegex.test(preferredSection);
      const inTitle = skillRegex.test(title);

      // Weight based on where it appears
      let weight = 0.5;
      if (inTitle) weight = 1.0;
      else if (inRequired) weight = 0.9;
      else if (inPreferred) weight = 0.6;

      // Count mentions for emphasis
      const mentions = (fullText.match(new RegExp(`\\b${escapeRegex(skill)}\\b`, "gi")) || []).length;
      weight = Math.min(1, weight + mentions * 0.05);

      const req: SkillRequirement = {
        skill,
        normalized,
        weight,
        context: inRequired ? "required" : inPreferred ? "preferred" : "mentioned",
      };

      if (inRequired || inTitle) {
        requiredSkills.push(req);
      } else {
        preferredSkills.push(req);
      }
    }
  }

  // Also check bigrams for multi-word skills
  const multiWordSkills = [
    "machine learning", "deep learning", "data science", "data engineering",
    "data analytics", "computer vision", "natural language processing",
    "generative ai", "react native", "google cloud", "amazon web services",
    "sql server", "material ui", "chakra ui", "adobe xd",
    "github actions", "gitlab ci", "jetpack compose", "prompt engineering",
    "clean architecture", "smart contracts", "large language model",
  ];
  for (const mws of multiWordSkills) {
    if (lowerText.includes(mws) && !requiredSkills.some(s => s.skill === mws) && !preferredSkills.some(s => s.skill === mws)) {
      const inRequired = requiredSection && requiredSection.toLowerCase().includes(mws);
      const inPreferred = preferredSection && preferredSection.toLowerCase().includes(mws);
      const inTitle = title.toLowerCase().includes(mws);
      let weight = 0.5;
      if (inTitle) weight = 1.0;
      else if (inRequired) weight = 0.9;
      else if (inPreferred) weight = 0.6;
      const req: SkillRequirement = {
        skill: mws,
        normalized: normalizeSkill(mws),
        weight,
        context: inRequired ? "required" : inPreferred ? "preferred" : "mentioned",
      };
      if (inRequired || inTitle) requiredSkills.push(req);
      else preferredSkills.push(req);
    }
  }

  // Detect seniority
  let seniorityLevel = "mid";
  let minYearsExperience = 2;
  for (const { pattern, level, yearsMin } of SENIORITY_PATTERNS) {
    if (pattern.test(fullText)) {
      seniorityLevel = level;
      minYearsExperience = yearsMin;
      break;
    }
  }

  // Extract explicit years requirement
  const yearsMatch = fullText.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)/i);
  if (yearsMatch) {
    minYearsExperience = parseInt(yearsMatch[1], 10);
  }

  // Industry detection
  const industryKeywords = INDUSTRY_KEYWORDS.filter((kw) =>
    new RegExp(`\\b${escapeRegex(kw)}\\b`, "i").test(fullText)
  );

  // Soft skills
  const softSkills = SOFT_SKILLS.filter((ss) =>
    new RegExp(`\\b${escapeRegex(ss)}\\b`, "i").test(lowerText)
  );

  // Management/leadership
  const managementRequired = /\b(manage|managing|management|people manager)\b/i.test(fullText);
  const teamLeadership = /\b(lead|leading|leader|tech lead|team lead)\b/i.test(fullText);

  // Education
  let educationPreference: string | null = null;
  if (/\b(phd|doctorate|doctoral)\b/i.test(fullText)) educationPreference = "phd";
  else if (/\b(master'?s?|msc|mba|m\.s\.)\b/i.test(fullText)) educationPreference = "masters";
  else if (/\b(bachelor'?s?|bsc|b\.s\.|degree)\b/i.test(fullText)) educationPreference = "bachelors";

  // Remote
  const remoteCompatible = /\b(remote|work from home|distributed|anywhere)\b/i.test(fullText);

  // Domain expertise from bigrams
  const domainExpertise = bigrams
    .filter((bg) => {
      const parts = bg.split(" ");
      return parts.every((p) => p.length > 2) && !TECH_SKILLS.has(bg);
    })
    .slice(0, 10);

  // Role keywords
  const roleKeywords = tokens
    .filter((t) => !TECH_SKILLS.has(t) && t.length > 3)
    .slice(0, 20);

  return {
    requiredSkills: requiredSkills.sort((a, b) => b.weight - a.weight),
    preferredSkills: preferredSkills.sort((a, b) => b.weight - a.weight),
    seniorityLevel,
    minYearsExperience,
    industryKeywords,
    roleKeywords,
    softSkills,
    managementRequired,
    teamLeadership,
    educationPreference,
    remoteCompatible,
    domainExpertise,
  };
}

function extractSection(text: string, keywords: string[]): string | null {
  // Try to find section headers and capture content until next section or double newline
  for (const kw of keywords) {
    // Match section header patterns: "Requirements:", "Must Have:", "## Requirements", "- Requirements", etc.
    const patterns = [
      new RegExp(`(?:^|\\n)\\s*(?:#+\\s*)?${escapeRegex(kw)}[:\\s]*\\n([\\s\\S]*?)(?=\\n\\s*(?:#+\\s*)?(?:preferred|nice to have|bonus|requirements|qualifications|about|benefits|compensation|what we offer)\\s*[:\\n]|$)`, "i"),
      new RegExp(`${escapeRegex(kw)}[:\\s]*([\\s\\S]*?)(?=\\n\\s*\\n|$)`, "i"),
    ];
    for (const regex of patterns) {
      const match = text.match(regex);
      if (match && match[1] && match[1].trim().length > 10) return match[1];
    }
  }
  return null;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
