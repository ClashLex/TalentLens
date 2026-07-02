// Skill Adjacency Graph — Powers implicit skill inference & partial credit
// Groups skills into clusters with weighted relationships

export interface SkillNode {
  name: string;
  cluster: string;
  aliases: string[];
}

export interface SkillEdge {
  from: string;
  to: string;
  weight: number; // 0–1, how related the skills are
}

// ─── Skill Clusters ───────────────────────────────────────
export const SKILL_CLUSTERS: Record<string, string[]> = {
  frontend: [
    "javascript", "typescript", "react", "vue", "angular", "svelte", "nextjs",
    "nuxt", "gatsby", "remix", "html", "css", "sass", "tailwindcss", "bootstrap",
    "material ui", "chakra ui", "webpack", "vite", "rollup", "esbuild",
    "jest", "cypress", "playwright", "figma", "storybook", "solidjs", "qwik", "astro",
  ],
  backend: [
    "nodejs", "express", "django", "flask", "fastapi", "spring", "rails",
    "laravel", "asp.net", "dotnet", "nestjs", "python", "java", "go", "golang",
    "rust", "ruby", "php", "c#", "scala", "elixir", "graphql", "rest", "grpc",
    "websocket", "microservices", "trpc", "hono", "bun", "deno",
  ],
  data: [
    "python", "r", "sql", "machine learning", "deep learning", "tensorflow",
    "pytorch", "scikit-learn", "keras", "pandas", "numpy", "spark", "hadoop",
    "airflow", "kafka", "data science", "data engineering", "data analytics",
    "business intelligence", "nlp", "computer vision", "mlflow", "dbt",
    "snowflake", "databricks", "langchain", "llamaindex", "huggingface",
  ],
  devops: [
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform",
    "ansible", "jenkins", "github actions", "gitlab ci", "circleci", "linux",
    "bash", "nginx", "prometheus", "grafana", "datadog", "ci/cd", "devops",
    "sre", "infrastructure", "pulumi", "argocd", "helm",
  ],
  mobile: [
    "ios", "android", "react native", "flutter", "swift", "kotlin",
    "xamarin", "objective-c", "dart", "swiftui", "jetpack compose",
  ],
  security: [
    "cybersecurity", "oauth", "jwt", "sso", "ldap", "saml", "penetration testing",
    "owasp", "zero trust", "encryption", "iam", "siem",
  ],
  database: [
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra",
    "dynamodb", "sqlite", "oracle", "sql server", "mariadb", "couchdb",
    "neo4j", "supabase", "prisma", "drizzle", "firebase",
  ],
  design: [
    "figma", "sketch", "adobe xd", "photoshop", "illustrator",
    "user experience", "user interface", "design systems", "prototyping",
    "accessibility", "responsive design",
  ],
};

// ─── Skill Edges (implicit relationships) ─────────────────
const SKILL_EDGES: SkillEdge[] = [
  // Frontend implicit relationships
  { from: "react", to: "javascript", weight: 0.9 },
  { from: "react", to: "html", weight: 0.7 },
  { from: "react", to: "css", weight: 0.6 },
  { from: "nextjs", to: "react", weight: 0.9 },
  { from: "nextjs", to: "nodejs", weight: 0.6 },
  { from: "vue", to: "javascript", weight: 0.9 },
  { from: "angular", to: "typescript", weight: 0.9 },
  { from: "svelte", to: "javascript", weight: 0.8 },
  { from: "gatsby", to: "react", weight: 0.8 },
  { from: "remix", to: "react", weight: 0.8 },
  { from: "solidjs", to: "javascript", weight: 0.8 },
  { from: "tailwindcss", to: "css", weight: 0.8 },
  { from: "sass", to: "css", weight: 0.9 },
  { from: "typescript", to: "javascript", weight: 0.85 },

  // Backend implicit relationships
  { from: "nodejs", to: "javascript", weight: 0.85 },
  { from: "express", to: "nodejs", weight: 0.9 },
  { from: "nestjs", to: "nodejs", weight: 0.85 },
  { from: "nestjs", to: "typescript", weight: 0.8 },
  { from: "django", to: "python", weight: 0.9 },
  { from: "flask", to: "python", weight: 0.9 },
  { from: "fastapi", to: "python", weight: 0.9 },
  { from: "spring", to: "java", weight: 0.9 },
  { from: "rails", to: "ruby", weight: 0.9 },
  { from: "laravel", to: "php", weight: 0.9 },
  { from: "trpc", to: "typescript", weight: 0.8 },
  { from: "hono", to: "typescript", weight: 0.7 },
  { from: "graphql", to: "rest", weight: 0.5 },

  // Data/ML implicit relationships
  { from: "tensorflow", to: "python", weight: 0.8 },
  { from: "tensorflow", to: "machine learning", weight: 0.9 },
  { from: "pytorch", to: "python", weight: 0.8 },
  { from: "pytorch", to: "deep learning", weight: 0.9 },
  { from: "scikit-learn", to: "python", weight: 0.85 },
  { from: "scikit-learn", to: "machine learning", weight: 0.9 },
  { from: "keras", to: "tensorflow", weight: 0.8 },
  { from: "pandas", to: "python", weight: 0.9 },
  { from: "numpy", to: "python", weight: 0.9 },
  { from: "spark", to: "data engineering", weight: 0.8 },
  { from: "deep learning", to: "machine learning", weight: 0.9 },
  { from: "nlp", to: "machine learning", weight: 0.7 },
  { from: "computer vision", to: "deep learning", weight: 0.8 },
  { from: "langchain", to: "python", weight: 0.7 },
  { from: "langchain", to: "machine learning", weight: 0.6 },

  // DevOps implicit relationships
  { from: "kubernetes", to: "docker", weight: 0.85 },
  { from: "terraform", to: "aws", weight: 0.6 },
  { from: "terraform", to: "infrastructure", weight: 0.9 },
  { from: "ansible", to: "linux", weight: 0.7 },
  { from: "jenkins", to: "ci/cd", weight: 0.9 },
  { from: "github actions", to: "ci/cd", weight: 0.9 },
  { from: "prometheus", to: "grafana", weight: 0.7 },
  { from: "helm", to: "kubernetes", weight: 0.8 },
  { from: "argocd", to: "kubernetes", weight: 0.8 },
  { from: "pulumi", to: "infrastructure", weight: 0.85 },

  // Mobile implicit relationships
  { from: "react native", to: "react", weight: 0.7 },
  { from: "react native", to: "javascript", weight: 0.7 },
  { from: "flutter", to: "dart", weight: 0.9 },
  { from: "swift", to: "ios", weight: 0.9 },
  { from: "kotlin", to: "android", weight: 0.85 },
  { from: "swiftui", to: "swift", weight: 0.9 },
  { from: "jetpack compose", to: "kotlin", weight: 0.9 },

  // Database implicit relationships
  { from: "supabase", to: "postgresql", weight: 0.8 },
  { from: "prisma", to: "postgresql", weight: 0.6 },
  { from: "drizzle", to: "postgresql", weight: 0.6 },
  { from: "firebase", to: "nosql", weight: 0.6 },
  { from: "mongodb", to: "nosql", weight: 0.9 },
];

// ─── Precomputed lookup maps ──────────────────────────────
const adjacencyMap = new Map<string, Map<string, number>>();

function ensureBuilt() {
  if (adjacencyMap.size > 0) return;
  for (const edge of SKILL_EDGES) {
    // Bidirectional
    if (!adjacencyMap.has(edge.from)) adjacencyMap.set(edge.from, new Map());
    if (!adjacencyMap.has(edge.to)) adjacencyMap.set(edge.to, new Map());
    adjacencyMap.get(edge.from)!.set(edge.to, edge.weight);
    adjacencyMap.get(edge.to)!.set(edge.from, edge.weight * 0.7); // reverse is weaker
  }
}

/**
 * Get the similarity weight between two skills.
 * Returns 1.0 for exact match, 0–0.9 for adjacent skills, 0 for unrelated.
 */
export function getSkillSimilarity(skillA: string, skillB: string): number {
  const a = skillA.toLowerCase();
  const b = skillB.toLowerCase();
  if (a === b) return 1.0;

  ensureBuilt();
  const neighbors = adjacencyMap.get(a);
  if (neighbors && neighbors.has(b)) {
    return neighbors.get(b)!;
  }

  // Same cluster bonus (weaker)
  for (const cluster of Object.values(SKILL_CLUSTERS)) {
    if (cluster.includes(a) && cluster.includes(b)) {
      return 0.2;
    }
  }

  return 0;
}

/**
 * Find all skills related to the given skill, sorted by weight.
 */
export function getRelatedSkills(skill: string): { skill: string; weight: number }[] {
  ensureBuilt();
  const lower = skill.toLowerCase();
  const neighbors = adjacencyMap.get(lower);
  if (!neighbors) return [];
  return Array.from(neighbors.entries())
    .map(([s, w]) => ({ skill: s, weight: w }))
    .sort((a, b) => b.weight - a.weight);
}

/**
 * Get the cluster(s) a skill belongs to.
 */
export function getSkillClusters(skill: string): string[] {
  const lower = skill.toLowerCase();
  return Object.entries(SKILL_CLUSTERS)
    .filter(([, skills]) => skills.includes(lower))
    .map(([cluster]) => cluster);
}

/**
 * Compute a coverage score: how well a set of candidate skills covers a set of required skills.
 * Uses direct match, synonym match, and adjacency-based partial credit.
 */
export function computeSkillCoverage(
  candidateSkills: string[],
  requiredSkills: string[]
): { coverage: number; directMatches: string[]; adjacentMatches: { skill: string; via: string; weight: number }[] } {
  const candidateSet = new Set(candidateSkills.map(s => s.toLowerCase()));
  const directMatches: string[] = [];
  const adjacentMatches: { skill: string; via: string; weight: number }[] = [];
  let totalCredit = 0;

  for (const required of requiredSkills) {
    const lower = required.toLowerCase();
    if (candidateSet.has(lower)) {
      directMatches.push(required);
      totalCredit += 1.0;
    } else {
      // Check adjacency
      let bestMatch = 0;
      let bestVia = "";
      for (const cs of candidateSkills) {
        const sim = getSkillSimilarity(cs.toLowerCase(), lower);
        if (sim > bestMatch) {
          bestMatch = sim;
          bestVia = cs;
        }
      }
      if (bestMatch > 0.3) {
        adjacentMatches.push({ skill: required, via: bestVia, weight: bestMatch });
        totalCredit += bestMatch * 0.6; // partial credit, discounted
      }
    }
  }

  return {
    coverage: requiredSkills.length > 0 ? totalCredit / requiredSkills.length : 1,
    directMatches,
    adjacentMatches,
  };
}
