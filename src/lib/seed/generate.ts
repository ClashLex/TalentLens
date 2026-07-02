// Realistic Candidate Data Generator v2
// Creates 100 diverse, realistic candidate profiles with rich behavioral signals

import { v4 as uuidv4 } from "uuid";

const FIRST_NAMES = [
  "Emma","Liam","Sophia","Noah","Olivia","James","Ava","William","Isabella",
  "Benjamin","Mia","Lucas","Charlotte","Mason","Amelia","Ethan","Harper",
  "Alexander","Evelyn","Daniel","Priya","Raj","Wei","Chen","Yuki","Aisha",
  "Omar","Carlos","Maria","Ana","Pavel","Olga","Kenji","Fatima","Kofi",
  "Ngozi","Sven","Ingrid","Marco","Lucia","Diego","Camila","Hassan",
  "Zara","Arjun","Mei","Hiroshi","Sakura","Kwame","Nia","Sofia","Elena",
  "Viktor","Ananya","Ravi","Yuna","Tariq","Leila","Mateo","Valentina",
  "Dmitri","Ayumi","Ibrahim","Nala","Finn","Astrid","Rafael","Clara",
  "Konstantin","Freya","Leo","Iris",
];

const LAST_NAMES = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis",
  "Rodriguez","Martinez","Anderson","Taylor","Thomas","Hernandez","Moore",
  "Martin","Jackson","Thompson","White","Lopez","Lee","Kim","Patel",
  "Nguyen","Chen","Wang","Singh","Mueller","Johansson","Tanaka","Nakamura",
  "Santos","Silva","Okafor","Mensah","Ahmad","Hassan","Volkov","Petrov",
  "Rossi","Ferrari","Dubois","Bernard","Schmidt","Fischer","Yamamoto",
  "Suzuki","Park","Cho","Ali","Khan","Eriksson","Larsson","Andersen",
  "Kovacs","Novak","Popov","Ivanova","Ferreira","Oliveira","Costa",
];

const COMPANIES = [
  "Google","Meta","Amazon","Microsoft","Apple","Netflix","Spotify","Stripe",
  "Shopify","Airbnb","Uber","Lyft","Slack","Notion","Figma","Vercel",
  "Datadog","Snowflake","Confluent","HashiCorp","MongoDB Inc","Elastic",
  "Twilio","Square","Coinbase","Robinhood","Plaid","Brex","Ramp",
  "Acme Corp","TechVault","DataStream","CloudNine","NexGen Labs",
  "QuantumSoft","ByteForge","InnoTech","PixelCraft","CodeHaven",
  "DeepMind","OpenAI","Anthropic","Palantir","Databricks","Scale AI",
  "Hugging Face","Weights & Biases","Cohere","Together AI",
  "JP Morgan","Goldman Sachs","McKinsey","Deloitte","BCG",
  "Siemens","BMW","Tesla","SpaceX","Boston Dynamics",
  "Supabase","Vercel","Railway","Fly.io","PlanetScale","Neon",
];

const INDUSTRIES = [
  "Technology","FinTech","Healthcare","E-commerce","SaaS","Enterprise Software",
  "AI/ML","Cybersecurity","EdTech","Gaming","Media","AdTech","InsurTech",
  "Logistics","Real Estate","Automotive","Energy","Biotech","Telecom",
  "Government","Defense","Travel","Food Tech","Legal Tech","HR Tech",
  "Climate Tech","Web3","Data Infrastructure",
];

const LOCATIONS = [
  "San Francisco, CA","New York, NY","Seattle, WA","Austin, TX","Boston, MA",
  "Los Angeles, CA","Chicago, IL","Denver, CO","Portland, OR","Miami, FL",
  "London, UK","Berlin, Germany","Amsterdam, Netherlands","Toronto, Canada",
  "Singapore","Sydney, Australia","Tokyo, Japan","Bangalore, India",
  "Paris, France","Stockholm, Sweden","Dublin, Ireland","Tel Aviv, Israel",
  "Remote","Zurich, Switzerland","Barcelona, Spain","Seoul, South Korea",
  "São Paulo, Brazil","Dubai, UAE",
];

const UNIVERSITIES = [
  "MIT","Stanford University","Carnegie Mellon","UC Berkeley","Harvard",
  "Georgia Tech","University of Michigan","Cornell University","Columbia",
  "University of Washington","ETH Zurich","Oxford University","Cambridge",
  "IIT Bombay","IIT Delhi","National University of Singapore","Tsinghua",
  "University of Toronto","KAIST","Technical University of Munich",
  "Waterloo University","Caltech","Princeton","Yale","UCLA",
  "University of Illinois","UT Austin","Purdue","Penn State",
  "Imperial College London","EPFL","University of Tokyo","Peking University",
];

interface SkillProfile {
  skills: { name: string; proficiency: number; years: number; primary: boolean }[];
  titles: string[];
  headline: string;
  summaries: string[];
}

const SKILL_PROFILES: Record<string, SkillProfile> = {
  fullstack: {
    skills: [
      { name: "JavaScript", proficiency: 5, years: 6, primary: true },
      { name: "TypeScript", proficiency: 4, years: 4, primary: true },
      { name: "React", proficiency: 5, years: 5, primary: true },
      { name: "Node.js", proficiency: 4, years: 5, primary: true },
      { name: "PostgreSQL", proficiency: 4, years: 4, primary: false },
      { name: "GraphQL", proficiency: 3, years: 2, primary: false },
      { name: "Docker", proficiency: 3, years: 3, primary: false },
      { name: "AWS", proficiency: 3, years: 3, primary: false },
      { name: "Git", proficiency: 5, years: 6, primary: false },
      { name: "HTML", proficiency: 5, years: 7, primary: false },
      { name: "CSS", proficiency: 4, years: 7, primary: false },
      { name: "TailwindCSS", proficiency: 4, years: 3, primary: false },
    ],
    titles: ["Full Stack Developer", "Software Engineer", "Full Stack Engineer", "Web Developer"],
    headline: "Full Stack Developer | React & Node.js Expert",
    summaries: [
      "Passionate full-stack developer with expertise in modern web technologies. Experienced in building scalable applications using React, Node.js, and cloud services. Strong advocate for clean code and test-driven development.",
      "Versatile engineer shipping production features across the entire stack. Loves building delightful user experiences with React while designing robust backend services in Node.js and PostgreSQL.",
      "Full-stack craftsperson focused on performance and developer experience. Builds pixel-perfect UIs with React/TypeScript and designs efficient APIs using Express and GraphQL.",
    ],
  },
  frontend: {
    skills: [
      { name: "JavaScript", proficiency: 5, years: 5, primary: true },
      { name: "TypeScript", proficiency: 5, years: 4, primary: true },
      { name: "React", proficiency: 5, years: 5, primary: true },
      { name: "Next.js", proficiency: 4, years: 3, primary: true },
      { name: "CSS", proficiency: 5, years: 6, primary: false },
      { name: "TailwindCSS", proficiency: 5, years: 3, primary: false },
      { name: "Vue", proficiency: 3, years: 2, primary: false },
      { name: "Figma", proficiency: 3, years: 2, primary: false },
      { name: "Jest", proficiency: 4, years: 3, primary: false },
      { name: "Cypress", proficiency: 3, years: 2, primary: false },
      { name: "Webpack", proficiency: 3, years: 3, primary: false },
      { name: "GraphQL", proficiency: 3, years: 2, primary: false },
    ],
    titles: ["Frontend Developer", "UI Engineer", "Frontend Engineer", "React Developer"],
    headline: "Frontend Engineer | Building Beautiful User Experiences",
    summaries: [
      "Creative frontend developer focused on building exceptional user interfaces. Expert in React ecosystem with a keen eye for design and accessibility. Passionate about performance optimization and component architecture.",
      "Frontend specialist turning Figma designs into interactive, accessible web apps. Deep experience in React, TypeScript, and modern CSS. Obsessed with 60fps animations and sub-second page loads.",
      "UI-focused engineer building component libraries and design systems at scale. Expert in Next.js, TailwindCSS, and animation frameworks. Advocate for web accessibility and inclusive design.",
    ],
  },
  backend: {
    skills: [
      { name: "Python", proficiency: 5, years: 6, primary: true },
      { name: "Java", proficiency: 4, years: 5, primary: true },
      { name: "PostgreSQL", proficiency: 5, years: 6, primary: true },
      { name: "Redis", proficiency: 4, years: 4, primary: false },
      { name: "Docker", proficiency: 4, years: 4, primary: false },
      { name: "Kubernetes", proficiency: 3, years: 2, primary: false },
      { name: "AWS", proficiency: 4, years: 5, primary: true },
      { name: "Microservices", proficiency: 4, years: 4, primary: false },
      { name: "Kafka", proficiency: 3, years: 3, primary: false },
      { name: "Django", proficiency: 4, years: 4, primary: false },
      { name: "Spring", proficiency: 3, years: 3, primary: false },
      { name: "Linux", proficiency: 4, years: 6, primary: false },
    ],
    titles: ["Backend Developer", "Software Engineer", "Backend Engineer", "Platform Engineer"],
    headline: "Backend Engineer | Distributed Systems & Cloud Architecture",
    summaries: [
      "Experienced backend engineer specializing in distributed systems and cloud-native architectures. Proficient in designing high-throughput, fault-tolerant systems. Passionate about API design, database optimization, and infrastructure automation.",
      "Systems-oriented engineer building reliable services at scale. Expertise in Python, Java, and PostgreSQL with deep knowledge of messaging systems and microservice patterns. Reduced p99 latency by 65% at previous role.",
      "Backend craftsperson focused on correctness and observability. Designs event-driven architectures using Kafka and builds rock-solid APIs. Strong advocate for chaos engineering and production readiness.",
    ],
  },
  datascience: {
    skills: [
      { name: "Python", proficiency: 5, years: 5, primary: true },
      { name: "Machine Learning", proficiency: 5, years: 4, primary: true },
      { name: "TensorFlow", proficiency: 4, years: 3, primary: true },
      { name: "PyTorch", proficiency: 4, years: 3, primary: true },
      { name: "Pandas", proficiency: 5, years: 5, primary: false },
      { name: "NumPy", proficiency: 5, years: 5, primary: false },
      { name: "Scikit-learn", proficiency: 4, years: 4, primary: false },
      { name: "SQL", proficiency: 4, years: 4, primary: false },
      { name: "Spark", proficiency: 3, years: 2, primary: false },
      { name: "NLP", proficiency: 4, years: 3, primary: false },
      { name: "R", proficiency: 3, years: 2, primary: false },
      { name: "Deep Learning", proficiency: 4, years: 3, primary: false },
    ],
    titles: ["Data Scientist", "ML Engineer", "Machine Learning Engineer", "AI Researcher"],
    headline: "Data Scientist | Machine Learning & AI Innovator",
    summaries: [
      "Data scientist with a strong foundation in machine learning, deep learning, and statistical modeling. Experience deploying ML models at scale in production environments. Published research in NLP and computer vision.",
      "ML engineer bridging research and production. Built recommendation systems serving 50M+ users and NLP pipelines processing 100K+ documents daily. Strong background in experiment design and A/B testing.",
      "AI researcher turned applied ML engineer. Expertise in transformers, representation learning, and few-shot methods. Shipped multiple models improving conversion by 20-40% using PyTorch and MLflow.",
    ],
  },
  devops: {
    skills: [
      { name: "AWS", proficiency: 5, years: 5, primary: true },
      { name: "Docker", proficiency: 5, years: 5, primary: true },
      { name: "Kubernetes", proficiency: 5, years: 4, primary: true },
      { name: "Terraform", proficiency: 4, years: 4, primary: true },
      { name: "Linux", proficiency: 5, years: 7, primary: false },
      { name: "Python", proficiency: 4, years: 5, primary: false },
      { name: "Bash", proficiency: 5, years: 7, primary: false },
      { name: "Jenkins", proficiency: 4, years: 4, primary: false },
      { name: "Ansible", proficiency: 4, years: 3, primary: false },
      { name: "Prometheus", proficiency: 4, years: 3, primary: false },
      { name: "Grafana", proficiency: 4, years: 3, primary: false },
      { name: "CI/CD", proficiency: 5, years: 5, primary: false },
    ],
    titles: ["DevOps Engineer", "SRE", "Platform Engineer", "Cloud Engineer", "Infrastructure Engineer"],
    headline: "DevOps Engineer | Cloud Infrastructure & Automation",
    summaries: [
      "DevOps professional passionate about building reliable, scalable infrastructure. Expert in container orchestration, CI/CD pipelines, and cloud architecture. Strong focus on observability, security, and developer experience.",
      "Platform engineer enabling developer velocity at scale. Designed Kubernetes platforms serving 500+ microservices and built golden-path CI/CD reducing deploy times from hours to minutes.",
      "SRE focused on uptime, incident response, and toil elimination. Manages multi-region AWS infrastructure with 99.99% availability. Built self-healing systems using custom operators and GitOps workflows.",
    ],
  },
  mobile: {
    skills: [
      { name: "React Native", proficiency: 5, years: 4, primary: true },
      { name: "iOS", proficiency: 4, years: 4, primary: true },
      { name: "Android", proficiency: 4, years: 4, primary: true },
      { name: "Swift", proficiency: 4, years: 3, primary: false },
      { name: "Kotlin", proficiency: 4, years: 3, primary: false },
      { name: "TypeScript", proficiency: 4, years: 4, primary: false },
      { name: "JavaScript", proficiency: 5, years: 5, primary: false },
      { name: "Flutter", proficiency: 3, years: 2, primary: false },
      { name: "Firebase", proficiency: 4, years: 3, primary: false },
      { name: "GraphQL", proficiency: 3, years: 2, primary: false },
      { name: "Git", proficiency: 4, years: 5, primary: false },
      { name: "Agile", proficiency: 4, years: 4, primary: false },
    ],
    titles: ["Mobile Developer", "iOS Developer", "Android Developer", "Mobile Engineer"],
    headline: "Mobile Developer | iOS, Android & Cross-Platform Expert",
    summaries: [
      "Mobile development specialist with experience in native and cross-platform frameworks. Built and shipped multiple apps with millions of users. Focused on performance, user experience, and platform-specific best practices.",
      "Cross-platform mobile engineer shipping beautiful apps to both stores. Expert in React Native with native iOS/Android experience for performance-critical features. Reduced app size by 40% and improved cold start by 60%.",
      "Mobile-first engineer passionate about gesture-driven UIs and offline-first architectures. Deep experience with Swift, Kotlin, and React Native. Built apps featured in App Store and Play Store.",
    ],
  },
  security: {
    skills: [
      { name: "Cybersecurity", proficiency: 5, years: 6, primary: true },
      { name: "Python", proficiency: 4, years: 5, primary: false },
      { name: "Linux", proficiency: 5, years: 7, primary: true },
      { name: "AWS", proficiency: 4, years: 4, primary: false },
      { name: "Docker", proficiency: 3, years: 3, primary: false },
      { name: "Kubernetes", proficiency: 3, years: 2, primary: false },
      { name: "OAuth", proficiency: 5, years: 5, primary: true },
      { name: "LDAP", proficiency: 4, years: 4, primary: false },
      { name: "Bash", proficiency: 5, years: 7, primary: false },
      { name: "Terraform", proficiency: 3, years: 2, primary: false },
      { name: "Java", proficiency: 3, years: 3, primary: false },
      { name: "Go", proficiency: 3, years: 2, primary: false },
    ],
    titles: ["Security Engineer", "Cybersecurity Analyst", "AppSec Engineer", "Security Architect"],
    headline: "Security Engineer | Protecting Systems at Scale",
    summaries: [
      "Security professional with deep expertise in application security, infrastructure hardening, and threat modeling. Experienced in building secure systems from the ground up and conducting penetration testing.",
      "AppSec engineer embedding security into the SDLC. Built automated SAST/DAST pipelines and led company-wide security training programs. Identified and remediated 200+ vulnerabilities in production systems.",
      "Security architect designing zero-trust networks and IAM solutions. Expert in OAuth 2.0, SAML, and mTLS. Led SOC 2 compliance initiatives and built SIEM integrations for real-time threat detection.",
    ],
  },
  productmanager: {
    skills: [
      { name: "Agile", proficiency: 5, years: 5, primary: true },
      { name: "Scrum", proficiency: 5, years: 5, primary: true },
      { name: "Jira", proficiency: 5, years: 6, primary: false },
      { name: "SQL", proficiency: 3, years: 3, primary: false },
      { name: "Data Analytics", proficiency: 4, years: 4, primary: true },
      { name: "Figma", proficiency: 3, years: 2, primary: false },
      { name: "Python", proficiency: 2, years: 1, primary: false },
      { name: "JavaScript", proficiency: 2, years: 1, primary: false },
      { name: "Confluence", proficiency: 4, years: 4, primary: false },
    ],
    titles: ["Product Manager", "Senior Product Manager", "Technical Product Manager", "Product Owner"],
    headline: "Product Manager | Building Products Users Love",
    summaries: [
      "Product manager with a technical background, experienced in driving product strategy and execution. Skilled in user research, data-driven decision making, and cross-functional collaboration. Track record of launching successful products.",
      "Technical PM bridging engineering and business. Managed platforms with $20M+ ARR and drove 35% improvement in key metrics through data-informed prioritization. Expert in running effective discovery sprints.",
      "Customer-obsessed product leader with 0-to-1 and scaling experience. Built and launched 5 products from scratch, 3 achieving product-market fit within 6 months. Strong analytics background with SQL and Python.",
    ],
  },
  // ─── New Archetypes ─────────────────────────────────────
  dataEngineering: {
    skills: [
      { name: "Python", proficiency: 5, years: 6, primary: true },
      { name: "Spark", proficiency: 5, years: 4, primary: true },
      { name: "Airflow", proficiency: 4, years: 3, primary: true },
      { name: "Kafka", proficiency: 4, years: 3, primary: true },
      { name: "PostgreSQL", proficiency: 4, years: 5, primary: false },
      { name: "AWS", proficiency: 4, years: 4, primary: false },
      { name: "Docker", proficiency: 4, years: 3, primary: false },
      { name: "SQL", proficiency: 5, years: 6, primary: false },
      { name: "Data Engineering", proficiency: 5, years: 5, primary: false },
      { name: "Hadoop", proficiency: 3, years: 3, primary: false },
      { name: "Terraform", proficiency: 3, years: 2, primary: false },
      { name: "Scala", proficiency: 3, years: 2, primary: false },
    ],
    titles: ["Data Engineer", "Senior Data Engineer", "Analytics Engineer", "Data Platform Engineer"],
    headline: "Data Engineer | Building Scalable Data Pipelines",
    summaries: [
      "Data engineer building reliable, high-throughput data pipelines. Expert in Spark, Airflow, and streaming architectures. Processed 10TB+ daily with sub-minute latency SLAs. Advocate for data quality and lineage.",
      "Analytics engineer bridging raw data and business intelligence. Builds dbt models, designs data warehouses, and creates self-serve analytics platforms. Reduced time-to-insight from weeks to hours.",
      "Data platform engineer focused on democratizing data access. Built real-time streaming pipelines with Kafka and designed medallion architectures on cloud data lakes. Expert in data governance and cost optimization.",
    ],
  },
  aiml: {
    skills: [
      { name: "Python", proficiency: 5, years: 5, primary: true },
      { name: "PyTorch", proficiency: 5, years: 4, primary: true },
      { name: "Machine Learning", proficiency: 5, years: 5, primary: true },
      { name: "Deep Learning", proficiency: 5, years: 4, primary: true },
      { name: "NLP", proficiency: 4, years: 3, primary: false },
      { name: "LangChain", proficiency: 4, years: 2, primary: false },
      { name: "Hugging Face", proficiency: 4, years: 2, primary: false },
      { name: "Docker", proficiency: 3, years: 3, primary: false },
      { name: "AWS", proficiency: 3, years: 3, primary: false },
      { name: "Kubernetes", proficiency: 3, years: 2, primary: false },
      { name: "MLflow", proficiency: 4, years: 2, primary: false },
      { name: "Computer Vision", proficiency: 4, years: 3, primary: false },
    ],
    titles: ["AI Engineer", "ML Research Engineer", "Applied Scientist", "NLP Engineer"],
    headline: "AI/ML Engineer | LLMs, NLP & Production AI",
    summaries: [
      "AI engineer specializing in large language models and production ML systems. Built RAG pipelines, fine-tuned foundation models, and designed evaluation frameworks. Published at NeurIPS and EMNLP.",
      "Applied ML scientist shipping AI features to millions of users. Expert in transformer architectures, efficient inference, and model optimization. Reduced serving costs by 70% through quantization and distillation.",
      "NLP engineer building intelligent document processing systems. Deep experience with BERT, GPT, and custom embedding models. Designed semantic search systems achieving 95%+ precision at scale.",
    ],
  },
  cloudArchitect: {
    skills: [
      { name: "AWS", proficiency: 5, years: 7, primary: true },
      { name: "GCP", proficiency: 4, years: 3, primary: false },
      { name: "Azure", proficiency: 4, years: 3, primary: false },
      { name: "Terraform", proficiency: 5, years: 5, primary: true },
      { name: "Kubernetes", proficiency: 5, years: 4, primary: true },
      { name: "Docker", proficiency: 5, years: 5, primary: false },
      { name: "Python", proficiency: 4, years: 5, primary: false },
      { name: "Go", proficiency: 4, years: 3, primary: false },
      { name: "Microservices", proficiency: 5, years: 5, primary: false },
      { name: "Linux", proficiency: 5, years: 8, primary: false },
      { name: "Prometheus", proficiency: 4, years: 3, primary: false },
      { name: "CI/CD", proficiency: 5, years: 5, primary: false },
    ],
    titles: ["Cloud Architect", "Solutions Architect", "Staff Platform Engineer", "Principal Engineer"],
    headline: "Cloud Architect | Multi-Cloud & Infrastructure at Scale",
    summaries: [
      "Cloud architect designing multi-region, multi-cloud platforms for enterprise workloads. AWS Solutions Architect Professional certified. Led migrations reducing infrastructure costs by 45% while improving reliability.",
      "Solutions architect bridging business requirements and technical implementation. Designed event-driven serverless architectures processing 1M+ events/sec. Expert in cost optimization and FinOps practices.",
      "Principal platform engineer building internal developer platforms. Created golden-path templates, service meshes, and self-service infrastructure. Improved developer onboarding time from weeks to hours.",
    ],
  },
  uxDesigner: {
    skills: [
      { name: "Figma", proficiency: 5, years: 5, primary: true },
      { name: "User Experience", proficiency: 5, years: 6, primary: true },
      { name: "User Interface", proficiency: 5, years: 6, primary: true },
      { name: "HTML", proficiency: 4, years: 5, primary: false },
      { name: "CSS", proficiency: 4, years: 5, primary: false },
      { name: "JavaScript", proficiency: 3, years: 3, primary: false },
      { name: "React", proficiency: 3, years: 2, primary: false },
      { name: "Sketch", proficiency: 4, years: 4, primary: false },
      { name: "Adobe XD", proficiency: 3, years: 2, primary: false },
      { name: "Agile", proficiency: 4, years: 4, primary: false },
      { name: "Data Analytics", proficiency: 3, years: 2, primary: false },
    ],
    titles: ["UX Designer", "Product Designer", "UI/UX Designer", "Design Lead"],
    headline: "Product Designer | User-Centered Design & Research",
    summaries: [
      "Product designer creating intuitive, accessible experiences. Expert in user research, prototyping, and design systems. Led redesigns that improved NPS by 30+ points and reduced support tickets by 50%.",
      "UX designer passionate about inclusive, data-informed design. Builds design systems used by 40+ engineers and conducts weekly user research sessions. Proficient in Figma, Framer, and front-end development.",
      "Design lead driving product vision through research-backed design decisions. Expert in service design, journey mapping, and accessibility. Mentors junior designers and established design critique culture.",
    ],
  },
};

const PROFILE_TYPES = Object.keys(SKILL_PROFILES);

const SIGNAL_TYPES = [
  "profile_completeness",
  "job_search_activity",
  "response_rate",
  "content_engagement",
  "skill_endorsements",
  "certification_recent",
  "open_to_opportunities",
  "github_contributions",
  "conference_speaker",
  "blog_publications",
  "mentoring_activity",
  "patent_filed",
  "hackathon_winner",
  "community_moderator",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function vary(value: number, range: number): number {
  return Math.max(1, value + randInt(-range, range));
}

const SENIORITY_PREFIXES = ["", "Junior ", "Mid-Level ", "Senior ", "Staff ", "Principal ", "Lead "];

export interface GeneratedCandidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  headline: string;
  summary: string;
  location: string;
  currentTitle: string;
  currentCompany: string;
  industry: string;
  yearsOfExperience: number;
  educationLevel: string;
  educationField: string;
  university: string;
  avatarUrl: string | null;
  linkedinUrl: string;
  githubUrl: string | null;
  portfolioUrl: string | null;
  willingToRelocate: boolean;
  remotePreference: string;
  salaryExpectation: number;
  noticePeriodDays: number;
  skills: { skillName: string; proficiencyLevel: number; yearsUsed: number; isPrimary: boolean }[];
  experience: {
    company: string; title: string; startYear: number; endYear: number | null;
    description: string; industry: string; isManagement: boolean; teamSize: number | null;
  }[];
  activitySignals: {
    signalType: string; signalValue: number; metadata: Record<string, unknown>;
  }[];
}

export function generateCandidates(count: number): GeneratedCandidate[] {
  const candidates: GeneratedCandidate[] = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1, 999)}@email.com`;
    }
    usedEmails.add(email);

    const profileType = pick(PROFILE_TYPES);
    const profile = SKILL_PROFILES[profileType];
    const yoe = randInt(1, 18);
    const seniorityIdx = Math.min(
      Math.floor(yoe / 3),
      SENIORITY_PREFIXES.length - 1
    );
    const seniority = SENIORITY_PREFIXES[seniorityIdx];
    const baseTitle = pick(profile.titles);
    const currentTitle = `${seniority}${baseTitle}`.trim();
    const currentCompany = pick(COMPANIES);
    const industry = pick(INDUSTRIES);
    const location = pick(LOCATIONS);

    // Generate skills with variation
    const skills = profile.skills.map((s) => ({
      skillName: s.name,
      proficiencyLevel: Math.min(5, Math.max(1, vary(s.proficiency, 1))),
      yearsUsed: Math.min(yoe, vary(s.years, 2)),
      isPrimary: s.primary,
    }));

    // Add some random extra skills
    const extraSkillOptions = [
      "Communication","Problem Solving","System Design","API Design",
      "Database Design","Performance Optimization","Code Review",
      "Technical Writing","Mentoring","Architecture","Distributed Systems",
      "Observability","Security Best Practices","Accessibility",
    ];
    const extraCount = randInt(1, 4);
    for (let j = 0; j < extraCount; j++) {
      skills.push({
        skillName: pick(extraSkillOptions),
        proficiencyLevel: randInt(2, 4),
        yearsUsed: randInt(1, yoe),
        isPrimary: false,
      });
    }

    // Generate work experience
    const expCount = Math.min(randInt(1, 5), Math.ceil(yoe / 2));
    const experience: GeneratedCandidate["experience"]= [];
    let currentYear = new Date().getFullYear();
    for (let j = 0; j < expCount; j++) {
      const tenure = randInt(1, 4);
      const startYear = currentYear - tenure;
      const isManagement = j === 0 && yoe >= 5 && Math.random() > 0.6;
      experience.push({
        company: j === 0 ? currentCompany : pick(COMPANIES),
        title: j === 0 ? currentTitle : `${pick(SENIORITY_PREFIXES.slice(0, seniorityIdx + 1))}${pick(profile.titles)}`.trim(),
        startYear,
        endYear: j === 0 ? null : currentYear,
        description: generateExpDescription(profileType, isManagement),
        industry: pick(INDUSTRIES),
        isManagement,
        teamSize: isManagement ? randInt(3, 30) : null,
      });
      currentYear = startYear - randInt(0, 1);
    }

    // Generate activity signals
    const activitySignals: GeneratedCandidate["activitySignals"] = [];
    const signalCount = randInt(4, 10);
    const usedSignals = new Set<string>();
    for (let j = 0; j < signalCount; j++) {
      let signalType = pick(SIGNAL_TYPES);
      while (usedSignals.has(signalType)) {
        signalType = pick(SIGNAL_TYPES);
      }
      usedSignals.add(signalType);
      activitySignals.push({
        signalType,
        signalValue: randInt(10, 95),
        metadata: { source: "platform", generated: true },
      });
    }

    const educationLevels = ["bachelors", "masters", "phd"];
    const educationFields = [
      "Computer Science", "Software Engineering", "Data Science",
      "Electrical Engineering", "Mathematics", "Physics",
      "Information Technology", "Business Administration",
      "Cognitive Science", "Statistics",
    ];

    // Pick a unique summary from the array
    const summaryBase = pick(profile.summaries);

    candidates.push({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      headline: `${seniority}${profile.headline}`.replace(/\|/, `| ${currentCompany} |`),
      summary: summaryBase + ` Currently at ${currentCompany} with ${yoe} years of experience in the ${industry} space.`,
      location,
      currentTitle,
      currentCompany,
      industry,
      yearsOfExperience: yoe,
      educationLevel: pick(educationLevels),
      educationField: pick(educationFields),
      university: pick(UNIVERSITIES),
      avatarUrl: null,
      linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randInt(100, 999)}`,
      githubUrl: Math.random() > 0.3 ? `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : null,
      portfolioUrl: Math.random() > 0.6 ? `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.dev` : null,
      willingToRelocate: Math.random() > 0.5,
      remotePreference: pick(["remote", "hybrid", "onsite"]),
      salaryExpectation: randInt(60, 250) * 1000,
      noticePeriodDays: pick([14, 30, 60, 90]),
      skills,
      experience,
      activitySignals,
    });
  }

  return candidates;
}

function generateExpDescription(profileType: string, isManagement: boolean): string {
  const descriptions: Record<string, string[]> = {
    fullstack: [
      "Built and maintained full-stack web applications using React and Node.js. Implemented CI/CD pipelines reducing deployment time by 75%.",
      "Developed RESTful APIs and integrated third-party services. Migrated monolith to microservices architecture serving 2M+ requests/day.",
      "Implemented responsive designs and optimized application performance. Achieved 98+ Lighthouse performance scores across all pages.",
      "Collaborated with design team to implement pixel-perfect UIs. Led migration from JavaScript to TypeScript improving code reliability by 40%.",
    ],
    frontend: [
      "Developed interactive user interfaces using React and TypeScript. Built component library used by 30+ engineers across 5 teams.",
      "Implemented design systems and reusable component libraries. Created Storybook documentation with 200+ component stories.",
      "Optimized web performance achieving 95+ Lighthouse scores. Reduced bundle size by 60% through code splitting and tree shaking.",
      "Led accessibility initiatives across the platform. Achieved WCAG 2.1 AA compliance and improved screen reader experience for 50K+ users.",
    ],
    backend: [
      "Designed and implemented microservices architecture. Built event-driven system processing 500K+ events/minute with sub-100ms latency.",
      "Built high-throughput data processing pipelines. Migrated batch ETL to real-time streaming reducing data freshness from hours to seconds.",
      "Optimized database queries and improved system performance by 40%. Redesigned indexing strategy handling 10x traffic growth without scaling.",
      "Implemented event-driven architecture using Kafka and RabbitMQ. Designed dead-letter queues and retry mechanisms achieving 99.99% delivery rate.",
    ],
    datascience: [
      "Developed machine learning models for prediction and classification. Built churn prediction model with 92% AUC saving $5M annually.",
      "Built NLP pipelines for text analysis and sentiment detection. Processed 1M+ documents daily with custom transformer models.",
      "Conducted A/B testing and statistical analysis to drive product decisions. Designed experiment framework supporting 50+ concurrent tests.",
      "Deployed ML models to production using MLflow and Docker. Reduced model serving latency from 200ms to 15ms through optimization.",
    ],
    devops: [
      "Managed cloud infrastructure on AWS serving millions of users. Achieved 99.99% uptime across 3 regions with automated failover.",
      "Implemented CI/CD pipelines reducing deployment time by 60%. Built blue-green deployment system enabling zero-downtime releases.",
      "Set up monitoring and alerting using Prometheus and Grafana. Created custom dashboards reducing MTTR from 2 hours to 15 minutes.",
      "Containerized applications and managed Kubernetes clusters. Migrated 200+ services to k8s reducing infrastructure costs by 35%.",
    ],
    mobile: [
      "Developed cross-platform mobile applications using React Native. Shipped apps to 5M+ users with 4.8-star average rating.",
      "Built native iOS features using Swift and UIKit. Implemented ARKit features increasing user engagement by 45%.",
      "Optimized app performance and reduced crash rates by 80%. Improved cold start time from 3.5s to 1.2s through lazy loading.",
      "Implemented push notifications and deep linking. Built real-time chat feature processing 10K+ messages/second.",
    ],
    security: [
      "Conducted security audits and penetration testing. Identified and remediated 150+ vulnerabilities across production systems.",
      "Implemented OAuth 2.0 and SSO across enterprise applications. Designed zero-trust architecture for 10K+ employee organization.",
      "Designed security policies and incident response procedures. Led team through 3 security incidents with zero data breach.",
      "Built automated vulnerability scanning pipelines. Created SAST/DAST integration reducing security review time by 70%.",
    ],
    productmanager: [
      "Led cross-functional teams to deliver product features on time. Shipped 12 features in 6 months with 95% on-time delivery.",
      "Conducted user research and synthesized insights into product roadmap. Ran 100+ user interviews leading to 3 major pivot decisions.",
      "Managed product backlog and sprint planning for engineering team. Improved velocity by 30% through better ticket grooming and estimation.",
      "Drove product strategy resulting in 30% user growth. Launched referral program generating 40% of new user acquisitions.",
    ],
    dataEngineering: [
      "Built and maintained ETL/ELT pipelines processing 10TB+ daily. Achieved sub-minute data freshness for real-time dashboards.",
      "Designed data warehouse schema and implemented dbt models. Created 200+ transformation models powering company-wide analytics.",
      "Implemented streaming data pipelines using Kafka and Spark Structured Streaming. Processed 1M+ events/second with exactly-once semantics.",
      "Led data platform migration to cloud lakehouse architecture. Reduced data processing costs by 60% while improving query performance 5x.",
    ],
    aiml: [
      "Fine-tuned and deployed large language models for enterprise use cases. Built RAG system achieving 95% accuracy on domain-specific queries.",
      "Designed and built ML inference infrastructure serving 100M+ predictions daily. Achieved p99 latency under 50ms through model optimization.",
      "Built computer vision pipeline for automated quality inspection. Reduced manual inspection time by 85% with 99.2% accuracy.",
      "Developed recommendation engine using collaborative filtering and deep learning. Improved click-through rate by 35% and revenue by 20%.",
    ],
    cloudArchitect: [
      "Designed multi-region cloud architecture for global SaaS platform. Achieved 99.999% availability with automated disaster recovery.",
      "Led cloud migration of legacy systems to AWS. Migrated 50+ services reducing infrastructure costs by 45% and improving performance 3x.",
      "Built internal developer platform with self-service infrastructure provisioning. Reduced new service onboarding from 2 weeks to 30 minutes.",
      "Designed and implemented service mesh using Istio. Improved observability and security across 300+ microservices.",
    ],
    uxDesigner: [
      "Led end-to-end product design for consumer mobile app with 2M+ users. Improved task completion rate by 40% through UX optimization.",
      "Built and maintained design system with 150+ components. Reduced design-to-development handoff time by 60%.",
      "Conducted usability studies and A/B tests to validate design decisions. Improved onboarding conversion by 55% through iterative design.",
      "Designed accessible interfaces meeting WCAG 2.1 AA standards. Created inclusive design guidelines adopted by 3 product teams.",
    ],
  };

  let desc = pick(descriptions[profileType] || descriptions.fullstack);
  if (isManagement) {
    desc += " Led and mentored a team of engineers, conducting code reviews, 1-on-1s, and performance calibrations.";
  }
  return desc;
}
