// Custom tokenizer with stemming, stop-word removal, and TF-IDF for job/candidate matching

const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by",
  "from","as","is","was","are","were","be","been","being","have","has","had",
  "do","does","did","will","would","could","should","may","might","shall",
  "can","need","must","it","its","this","that","these","those","i","me","my",
  "we","our","you","your","he","his","she","her","they","them","their","who",
  "which","what","when","where","how","all","each","every","both","few","more",
  "most","other","some","such","no","not","only","same","so","than","too",
  "very","just","about","above","after","again","also","any","because","before",
  "between","during","into","through","under","until","up","etc","able","like",
  "well","including","work","working","using","use","used","etc","role",
  "looking","join","team","company","position","opportunity","responsibilities",
  "strong","experience","knowledge","understanding","familiarity","ability",
  "years","year","preferred","required","ideal","candidate","seeking","part",
]);

// Simple Porter-like stemmer rules
const SUFFIX_RULES: [RegExp, string][] = [
  [/ational$/, "ate"],
  [/tional$/, "tion"],
  [/enci$/, "ence"],
  [/anci$/, "ance"],
  [/izer$/, "ize"],
  [/iser$/, "ise"],
  [/alli$/, "al"],
  [/entli$/, "ent"],
  [/eli$/, "e"],
  [/ousli$/, "ous"],
  [/ation$/, "ate"],
  [/ator$/, "ate"],
  [/alism$/, "al"],
  [/iveness$/, "ive"],
  [/fulness$/, "ful"],
  [/ousness$/, "ous"],
  [/aliti$/, "al"],
  [/iviti$/, "ive"],
  [/biliti$/, "ble"],
  [/ement$/, ""],
  [/ment$/, ""],
  [/ness$/, ""],
  [/ings$/, ""],
  [/ing$/, ""],
  [/tion$/, "t"],
  [/sion$/, "s"],
  [/ies$/, "y"],
  [/ses$/, "s"],
  [/eed$/, "ee"],
  [/ed$/, ""],
  [/ly$/, ""],
  [/er$/, ""],
  [/s$/, ""],
];

export function stem(word: string): string {
  if (word.length < 4) return word;
  let result = word;
  for (const [pattern, replacement] of SUFFIX_RULES) {
    if (pattern.test(result)) {
      const candidate = result.replace(pattern, replacement);
      if (candidate.length >= 3) {
        result = candidate;
        break;
      }
    }
  }
  return result;
}

// Skill synonym mapping for semantic understanding
const SKILL_SYNONYMS: Record<string, string> = {
  "js": "javascript",
  "ts": "typescript",
  "py": "python",
  "react.js": "react",
  "reactjs": "react",
  "node.js": "nodejs",
  "node": "nodejs",
  "vue.js": "vue",
  "vuejs": "vue",
  "angular.js": "angular",
  "angularjs": "angular",
  "next.js": "nextjs",
  "next": "nextjs",
  "express.js": "express",
  "expressjs": "express",
  "nest.js": "nestjs",
  "postgres": "postgresql",
  "mongo": "mongodb",
  "k8s": "kubernetes",
  "aws": "amazon web services",
  "gcp": "google cloud platform",
  "google cloud": "google cloud platform",
  "azure": "microsoft azure",
  "ml": "machine learning",
  "ai": "artificial intelligence",
  "dl": "deep learning",
  "nlp": "natural language processing",
  "cv": "computer vision",
  "ci/cd": "continuous integration",
  "cicd": "continuous integration",
  "devops": "development operations",
  "sre": "site reliability engineering",
  "ux": "user experience",
  "ui": "user interface",
  "qa": "quality assurance",
  "tf": "tensorflow",
  "pytorch": "pytorch",
  "sql": "structured query language",
  "nosql": "non relational database",
  "api": "application programming interface",
  "rest": "representational state transfer",
  "graphql": "graph query language",
  "sass": "css preprocessor",
  "scss": "css preprocessor",
  "less": "css preprocessor",
  "tailwind": "tailwindcss",
  "docker": "containerization",
  "terraform": "infrastructure as code",
  "ansible": "configuration management",
  // New additions
  "svelte.js": "svelte",
  "solid.js": "solidjs",
  "solid": "solidjs",
  "deno.js": "deno",
  "bun.js": "bun",
  "supabase": "supabase",
  "prisma": "prisma orm",
  "drizzle": "drizzle orm",
  "trpc": "trpc",
  "hono": "hono",
  "astro.js": "astro",
  "langchain": "langchain",
  "llamaindex": "llamaindex",
  "huggingface": "hugging face",
  "hf": "hugging face",
  "llm": "large language model",
  "llms": "large language model",
  "genai": "generative ai",
  "gen ai": "generative ai",
  "rag": "retrieval augmented generation",
  "pg": "postgresql",
  "psql": "postgresql",
  "ec2": "aws ec2",
  "s3": "aws s3",
  "lambda": "aws lambda",
  "ecs": "aws ecs",
  "eks": "aws eks",
  "gke": "google kubernetes engine",
  "aks": "azure kubernetes service",
  "cdk": "aws cdk",
  "cf": "cloudformation",
  "gh actions": "github actions",
  "gitlab-ci": "gitlab ci",
  "otel": "opentelemetry",
  "o11y": "observability",
  "argocd": "argo cd",
  "helm": "helm charts",
  "swiftui": "swiftui",
  "jetpack": "jetpack compose",
  "rn": "react native",
};

export function normalizeSkill(skill: string): string {
  const lower = skill.toLowerCase().trim();
  return SKILL_SYNONYMS[lower] || lower;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\.+#\-\/]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1)
    .filter((t) => !STOP_WORDS.has(t));
}

export function tokenizeAndStem(text: string): string[] {
  return tokenize(text).map(stem);
}

// Extract compound terms (bigrams) that are meaningful
export function extractBigrams(tokens: string[]): string[] {
  const bigrams: string[] = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return bigrams;
}

// Build TF vector from tokens
export function buildTfVector(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  // Normalize by total tokens
  const total = tokens.length || 1;
  for (const [key, val] of tf) {
    tf.set(key, val / total);
  }
  return tf;
}

// ─── TF-IDF Functions ─────────────────────────────────────

/**
 * Build an IDF vector from a corpus of documents (each document is a token array).
 */
export function buildIdfVector(corpus: string[][]): Map<string, number> {
  const docCount = corpus.length || 1;
  const docFreq = new Map<string, number>();

  for (const doc of corpus) {
    const uniqueTokens = new Set(doc);
    for (const token of uniqueTokens) {
      docFreq.set(token, (docFreq.get(token) || 0) + 1);
    }
  }

  const idf = new Map<string, number>();
  for (const [term, df] of docFreq) {
    // Standard IDF with smoothing
    idf.set(term, Math.log((docCount + 1) / (df + 1)) + 1);
  }
  return idf;
}

/**
 * Build a TF-IDF vector for a single document given a precomputed IDF.
 */
export function buildTfIdfVector(
  tokens: string[],
  idf: Map<string, number>
): Map<string, number> {
  const tf = buildTfVector(tokens);
  const tfIdf = new Map<string, number>();

  for (const [term, tfVal] of tf) {
    const idfVal = idf.get(term) || 1;
    tfIdf.set(term, tfVal * idfVal);
  }

  return tfIdf;
}

// Cosine similarity between two TF(-IDF) vectors
export function cosineSimilarity(
  vecA: Map<string, number>,
  vecB: Map<string, number>
): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  const allKeys = new Set([...vecA.keys(), ...vecB.keys()]);

  for (const key of allKeys) {
    const a = vecA.get(key) || 0;
    const b = vecB.get(key) || 0;
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
