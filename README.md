# 🎯 TalentLens AI — Intelligent Candidate Discovery

![TalentLens AI Banner](/api/placeholder/1200/400)

**An ultimate AI recruiter built for the Data & AI Challenge: Intelligent Candidate Discovery**  
*Part of INDIA.RUNS hosted by Hack2Skill and Redrob.*

---

## 🏆 The Challenge

The objective of this challenge is to move beyond traditional, keyword-based recruitment filters. The task is to build a robust, workable Proof of Concept (PoC) that acts as the ultimate AI recruiter—capable of deep job understanding, contextual relevance, and multi-signal integration.

TalentLens AI answers this challenge by delivering a **lightning-fast, highly accurate, and expertly ranked shortlist of the best-fit candidates.**

---

## ✨ Features & Capabilities

TalentLens AI doesn't just match strings; it understands context, trajectory, and behavior.

### 🧠 1. Deep Job Understanding (NLP Parser)
- **Beyond Keywords:** Extracts required skills, preferred skills, seniority levels, management requirements, education preferences, and soft skills using an advanced tokenizer.
- **Implicit Skill Inference:** Utilizes a custom **Skill Adjacency Graph** to map relationships between technologies (e.g., granting partial credit for `JavaScript` if a candidate knows `TypeScript` or `React`).
- **Synonym Normalization:** Maps over 100 industry synonyms (e.g., `k8s` → `kubernetes`, `aws` → `amazon web services`) to prevent missed matches due to terminology differences.

### 🎯 2. Contextual Relevance (TF-IDF Semantic Engine)
- **Global Context:** Builds a Term Frequency-Inverse Document Frequency (TF-IDF) vector across the entire candidate pool.
- **Semantic Similarity:** Computes cosine similarity between the parsed job requirements and the candidate's entire corpus (headline, summary, and experience), acting as a powerful contextual multiplier.
- **Dynamic Role Weighting:** Automatically adjusts scoring weights based on the job archetype (e.g., DevOps roles weight infrastructure skills higher; management roles weight cultural fit and leadership higher).

### 📈 3. Signal Integration & Trajectory Scoring
- **Experience Recency:** Heavily weights skills and experiences from the candidate's most recent roles.
- **Behavioral Signals:** Integrates 14 distinct activity signals (e.g., "Hackathon Winner", "Mentoring Activity", "High Response Rate", "Patent Filed") to score passive and active candidates.
- **Career Trajectory:** Analyzes title progression and tenure stability to determine if a candidate has a "Strong upward trajectory" or "Steady growth."

### 🎨 4. Premium UI/UX (The "Wow" Factor)
- **Glassmorphic Design:** Built with Tailwind CSS v4, featuring a beautiful animated mesh gradient background and layered glass effects.
- **Multi-Axis Radar Charts:** Visualizes exactly *why* a candidate matched across 5 dimensions: Skills, Experience, Culture, Activity, and Trajectory.
- **Podium Rankings:** Highlights the top 3 candidates with distinct gold, silver, and bronze glow effects.
- **AI Explainability:** Generates plain-text "AI Highlights" and "Potential Concerns" for every candidate, showing the recruiter exactly what the engine found.

---

## 🏗️ Architecture & Tech Stack

This project was built with a modern, high-performance web stack:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (via [Drizzle ORM](https://orm.drizzle.team/))
- **NLP/AI Layer:** Custom TypeScript TF-IDF and Graph-based inference engine (`src/lib/engine`)
- **Data Seeding:** Generates 100 highly realistic candidates across 12 tech archetypes (`src/lib/seed`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database running locally

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/intelligent-candidate-ranking-system.git
cd intelligent-candidate-ranking-system
npm install
```

### 2. Configure Database
Create a `.env.local` file in the root directory and add your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app_db"
```

*Note: Ensure your local PostgreSQL instance is running and the database `app_db` exists.*

### 3. Initialize & Run
Push the database schema using Drizzle:
```bash
npx drizzle-kit push
```

Start the development server:
```bash
npm run dev
```

### 4. Seed the Database
Open the application at `http://localhost:3000`. Click the **"🚀 Seed Database"** button to instantly generate 100 realistic, highly detailed candidate profiles with complete career histories and behavioral signals.

---

## 💡 How to use the PoC

1. **Load a Job Description:** Use one of the "Quick Load Examples" or paste your own job description.
2. **AI Analysis:** The engine will instantly parse the description, extracting required skills, preferred skills, seniority, and industry focus.
3. **Review Matches:** The top candidates will be ranked instantly.
4. **Deep Dive:** Click on any candidate to open the Modal. View their multi-axis Radar Chart, read the AI's highlights and concerns, and review their skill heatmap and career timeline.

---

## 🤝 Contribution & Acknowledgements

Built for the **INDIA.RUNS** hackathon.
Hosted by **Hack2Skill** and **Redrob AI**.

*"Unleashing innovation to find the hidden gems in talent acquisition."*
