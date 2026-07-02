# Deployment & GitHub Guide

This guide will walk you through pushing your completed TalentLens project to GitHub and making it "live" on the internet using Vercel.

---

## 1. Pushing to GitHub

Now that the app is working locally and connected to your Supabase database, it's time to back up your code to GitHub.

*(Note: We have already added `.env.local` and `work.md` to your `.gitignore` file, so your database passwords and these instructions will remain safely on your computer and will NOT be uploaded to the public internet!)*

1. Open a new terminal in your project folder.
2. Initialize Git (if not already done):
   ```bash
   git init
   ```
3. Stage all your files:
   ```bash
   git add .
   ```
4. Commit your changes:
   ```bash
   git commit -m "feat: complete Hackathon submission with Supabase integration"
   ```
5. Go to [GitHub.com](https://github.com/) and create a **New Repository** (e.g., `talentlens-ai`). **Do not** add a README or .gitignore from the GitHub interface.
6. Copy the commands GitHub provides under *"…or push an existing repository from the command line"* and paste them into your terminal. They look like this:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/talentlens-ai.git
   git branch -M main
   git push -u origin main
   ```

Your code is now safely on GitHub!

---

## 2. Making It Live (Deploying to Vercel)

Next.js apps are easiest to deploy on **Vercel** (the company that created Next.js). It's completely free.

1. Go to [Vercel.com](https://vercel.com/) and sign up or log in using your GitHub account.
2. Click **Add New...** -> **Project**.
3. You will see a list of your GitHub repositories. Find the one you just created (`talentlens-ai`) and click **Import**.
4. In the configuration screen, leave everything as default (Framework: Next.js), but open the **Environment Variables** section.
5. You need to add your Supabase connection string here so the live site can talk to your database!
   - **Key:** `DATABASE_URL`
   - **Value:** Paste your actual Supabase URL here (the one from your `.env.local` file).
6. Click **Deploy**.

Vercel will now build your application. This usually takes about 1-2 minutes. Once it's done, you will be given a live URL (e.g., `https://talentlens-ai.vercel.app`) that you can share with the hackathon judges!
