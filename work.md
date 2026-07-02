# The Ultimate Deployment Guide: Supabase & Vercel

If you are trying to get this project live on the internet and are running into database connection errors (like `Failed to seed database` or internal server errors), follow this guide **exactly step-by-step**.

---

## Phase 1: Local Setup & Database Initialization

Before deploying to the internet, we must ensure your Supabase database is initialized.

### 1. Get Your Connection String
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click on your project.
3. Click the **Connect** button (top right).
4. Copy the connection string. It should look like this:
   `postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres`

### 2. Format Your Password (CRITICAL)
If your password has special characters like `@`, it **will break** the database connection.
For example, if your password is `Titani@asp1r`, you **must** change the `@` to `%40`.
Your fixed string becomes: 
`postgresql://postgres:Titani%40asp1r@db...`

### 3. Update Local Environment
1. Open your code editor.
2. Open `.env.local`.
3. Add the string surrounded by quotes like this:
   ```env
   DATABASE_URL="postgresql://postgres:Titani%40asp1r@db.your-project-id.supabase.co:5432/postgres"
   ```

### 4. Push the Database Schema
Open your terminal in the project folder and run:
```bash
npx drizzle-kit push
```
*(If this succeeds, your Supabase database now has the correct tables).*

### 5. Seed the Database
1. Run `npm run dev` in your terminal.
2. Open `http://localhost:3000` in your browser.
3. Click **Seed Database**.
4. Wait a few minutes. Once it completes, your database is full of data!

---

## Phase 2: Pushing to GitHub

1. Initialize Git (if not already done): `git init`
2. Stage all your files: `git add .`
3. Commit your changes: `git commit -m "Deploy ready"`
4. Go to [GitHub.com](https://github.com/) and create a **New Repository** (do not add a README).
5. Copy the commands GitHub gives you to push an existing repository. They look like this:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/your-repo.git
   git branch -M main
   git push -u origin main
   ```

---

## Phase 3: Vercel Deployment & Fixing Env Variables

### 1. Import to Vercel
1. Go to [Vercel.com](https://vercel.com/) and log in.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.

### 2. Add Environment Variables (The Trickiest Part)
In the configuration screen (or in the Settings -> Environment Variables tab if you already deployed):
1. Key: `DATABASE_URL`
2. Value: Paste your URL, but observe these strict rules:
   - **NO QUOTES:** Unlike the `.env.local` file, do **not** put quotes around the URL in Vercel.
   - **ENCODED PASSWORD:** Make sure your password has the `%40` instead of `@`.
   - The final value should look exactly like this:
     `postgresql://postgres:Titani%40asp1r@db.your-project-id.supabase.co:5432/postgres`

### 3. Force Redeployment
If you added the environment variable *after* your first deployment, the live site does not know about it yet!
1. Go to your project on Vercel.
2. Click the **Deployments** tab.
3. Click the three dots (⋮) on your most recent deployment.
4. Click **Redeploy**.

Once that redeployment finishes, your live URL will connect to Supabase and everything will work perfectly!
