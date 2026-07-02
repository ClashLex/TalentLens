# Project Setup & Deployment Guide

You have successfully added your Supabase `DATABASE_URL` to the `.env.local` file! Here is the complete step-by-step process to get your database initialized, the app running locally, and finally, how to push it to GitHub.

---

## Part 1: Getting the App Working Locally

Now that your Supabase connection string is securely in `.env.local`, follow these steps:

### 1. Push the Database Schema
You need to tell Supabase what your database tables look like. Drizzle ORM handles this automatically.
Open your terminal in the project folder and run:
```bash
npx drizzle-kit push
```
*If this succeeds, you will see a message confirming the `candidates` table was pushed to your database.*

### 2. Start the Development Server
Run the following command to start the Next.js app:
```bash
npm run dev
```

### 3. Seed the Database
1. Open your browser and go to `http://localhost:3000`.
2. You will see the new Soulful Editorial UI.
3. Click the **"Seed Database"** button. This will connect to your Supabase instance and generate 100 highly realistic candidate profiles.
4. Once it finishes, the app is fully functional! You can start entering job descriptions to see the AI ranking engine at work.

---

## Part 2: Pushing to GitHub

Now that the project is working, it's time to save your code to GitHub.

### 1. Initialize Git (If you haven't already)
If this project isn't already a Git repository, initialize it:
```bash
git init
```

### 2. Ensure Secrets are Protected
**CRITICAL:** Never push your `.env.local` file to GitHub!
Double-check that you have a file named `.gitignore` in your project folder, and ensure it contains these lines:
```
.env
.env.local
.env.*.local
node_modules/
.next/
```
*(Next.js includes this by default, so you should be safe).*

### 3. Commit Your Code
Run these commands to stage and commit your beautiful new UI and AI engine upgrades:
```bash
git add .
git commit -m "feat: complete UI overhaul and semantic AI ranking engine integration"
```

### 4. Create a GitHub Repository
1. Go to [GitHub.com](https://github.com/) and click **New Repository**.
2. Name it (e.g., `talentlens-ai`).
3. Keep it Public or Private (your choice).
4. Do **NOT** check "Add a README file" (we already made an awesome one).
5. Click **Create repository**.

### 5. Push Your Code
GitHub will give you a block of code under the heading *"…or push an existing repository from the command line"*. Copy and paste those commands into your terminal. It will look like this:
```bash
git remote add origin https://github.com/YOUR_USERNAME/talentlens-ai.git
git branch -M main
git push -u origin main
```

🎉 **Congratulations!** Your codebase is now safely backed up on GitHub and fully connected to a live Supabase database!
