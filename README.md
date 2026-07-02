# TalentLens: Intelligent Candidate Discovery 🎯

![TalentLens](https://img.shields.io/badge/Status-Hackathon_Ready-success) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-blue) ![TF-IDF](https://img.shields.io/badge/AI-TF--IDF_Engine-orange)

**TalentLens** is a next-generation AI recruitment platform built for the **INDIA.RUNS Data & AI Challenge** (conducted by Hack2Skill and Redrob). 

It moves beyond simple keyword matching, utilizing a custom TF-IDF semantic NLP engine to intelligently analyze, map, and rank candidate profiles against complex job descriptions in milliseconds.

---

## 🌟 The Challenge & The Solution

**The Problem:** Traditional applicant tracking systems rely heavily on exact keyword matches. This leads to great candidates being overlooked simply because they used synonymous terms, or because the recruiter couldn't effectively weight the importance of different skills.

**The TalentLens Solution:**
We built a robust, workable Proof of Concept that acts as the ultimate AI recruiter.
1. **Deep Job Understanding:** Parses unstructured job descriptions to identify required vs. preferred skills, seniority, and management requirements.
2. **Contextual Relevance:** Employs a custom Natural Language Processing (NLP) pipeline featuring a TF-IDF (Term Frequency-Inverse Document Frequency) scoring algorithm and a Skill Adjacency Graph (e.g., recognizing that a candidate with "React" possesses highly relevant skills for a "Next.js" role).
3. **Signal Integration:** Analyzes career trajectory, total experience, education, and skill weights to generate a comprehensive, multidimensional match score.
4. **Soulful Editorial UI:** Wraps this immensely powerful engine in a breathtaking, sophisticated, and deeply human interface designed with Instrument Serif and warm stone tones, breaking away from the cold, clinical feel of standard enterprise software.

---

## ⚙️ Technical Architecture

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4.
- **Backend/API:** Next.js Serverless Route Handlers.
- **Database:** PostgreSQL (hosted on Supabase) utilizing Drizzle ORM for extreme type-safety.
- **AI/NLP Engine (Custom Built):**
  - `job-parser.ts`: Extracts weighted entities from raw text.
  - `tokenizer.ts`: Stems and normalizes technical vocabulary.
  - `skill-graph.ts`: Calculates relational proximity between adjacent technologies.
  - `ranker.ts`: The core TF-IDF vector math engine that scores candidates across 5 dimensions (Skills, Experience, Culture, Activity, Trajectory).

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18+)
- A free [Supabase](https://supabase.com/) account for PostgreSQL.

### 2. Environment Setup
Create a `.env.local` file in the root directory and add your Supabase connection string:
```env
DATABASE_URL="postgresql://postgres.your_id:your_password@aws-0-region.pooler.supabase.com:6543/postgres"
```

### 3. Install & Initialize
```bash
npm install
npx drizzle-kit push
```

### 4. Run the Engine
```bash
npm run dev
```
Open `http://localhost:3000`. Click the **Seed Database** button to automatically generate 100 deep, highly realistic candidate profiles into your Supabase instance, creating the corpus necessary for the TF-IDF engine to function.

---

## 🎨 UI/UX Philosophy

Recruitment is fundamentally about people. We consciously rejected the "dark mode cyber-brutalist" trend common in AI tools today. Instead, TalentLens employs a **"Soulful Editorial"** aesthetic:
- **Typography:** `Instrument Serif` for an elegant, humanistic touch, paired with `Inter` for dense data readability.
- **Palette:** Warm ivory backgrounds (`stone-50`) with deep charcoal accents, avoiding the harshness of pure `#FFF` or `#000`.
- **Micro-interactions:** Soft, floating components and pill-shaped elements that invite interaction without overwhelming the user.

---

*Built with ❤️ for the Hack2Skill & Redrob Data & AI Challenge.*
