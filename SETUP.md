# Setup Guide for AI App Builder

This guide will walk you through setting up and deploying your AI-powered app builder.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- An OpenAI API key
- A Vercel account (free tier works)
- Git installed

## Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project" and fill in:
   - Name: `ai-app-builder` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
3. Wait for the project to be created (~2 minutes)
4. Go to Project Settings > API
5. Copy the following values:
   - **Project URL**: Something like `https://xxxxxxxxxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

6. Go to the SQL Editor in your Supabase dashboard
7. Click "New Query" and paste the contents of `supabase/migrations/001_initial_schema.sql`
8. Click "Run" to create the database tables

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your actual values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Get your OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Application

### Create a Test Project

1. Click "Create New Project"
2. Fill in the form:
   - **Name**: "Todo App"
   - **Description**: "A simple todo list with categories"
   - **Prompt**: "Create a todo app with the following features:
      - Add, edit, and delete todos
      - Categories for todos (Work, Personal, Shopping)
      - Mark todos as complete
      - Filter by category
      - Clean, modern UI with purple accents
      - Use Tailwind CSS for styling
      - Store data in localStorage"
3. Click "Generate App with AI"
4. Wait for the AI to generate the code (may take 30-60 seconds)

### View and Deploy

1. Once generated, view the code
2. Click "Deploy to Vercel" (this will simulate deployment)
3. After a few seconds, you'll see a deployment URL

### Refine the App

1. In the "Refine with AI" section, enter feedback like:
   "Add a dark mode toggle and improve the mobile layout"
2. Click "Refine App"
3. The AI will update the code based on your feedback

## Step 6: Deploy to Vercel

### Option A: Deploy from Vercel Dashboard (Recommended for beginners)

1. Push your code to GitHub
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXT_PUBLIC_APP_URL`: Your Vercel URL (after first deploy)

6. Click "Deploy"
7. Wait for deployment to complete (~2-3 minutes)
8. Your app is now live!

### Option B: Deploy with Vercel CLI (Recommended for developers)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name: `ai-app-builder` (or your preference)
   - In which directory? `./`
   - Override settings? **No**

5. Add environment variables when prompted:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   OPENAI_API_KEY=your-openai-key
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ```

6. Your app is now deployed!

## Troubleshooting

### Supabase Connection Error

**Error**: "Failed to fetch projects"
**Solution**:
- Check that `.env.local` exists and has correct values
- Verify Supabase project is active (not paused)
- Check Supabase API keys are correct
- Ensure you've run the migration script

### AI Generation Fails

**Error**: "Failed to generate app"
**Solution**:
- Check OpenAI API key is valid
- Ensure you have OpenAI API credits
- Try a simpler prompt
- Check browser console for detailed errors

### Build Errors

**Error**: TypeScript or build errors
**Solution**:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Deployment Fails

**Error**: Vercel deployment fails
**Solution**:
- Check Vercel logs for specific errors
- Ensure all environment variables are set
- Check that Supabase is accessible from Vercel
- Verify `vercel.json` configuration

## Production Considerations

### Authentication

The current implementation uses a demo user ID. To add authentication:

1. Install Supabase Auth:
   ```bash
   npm install @supabase/auth-helpers-nextjs
   ```

2. Update database policies in Supabase:
   ```sql
   -- Replace demo policies with user-specific ones
   DROP POLICY "Allow all access for demo" ON projects;
   DROP POLICY "Allow all access for demo" ON deployments;

   CREATE POLICY "Users can view own projects"
     ON projects FOR SELECT
     USING (auth.uid()::text = user_id);

   CREATE POLICY "Users can create own projects"
     ON projects FOR INSERT
     WITH CHECK (auth.uid()::text = user_id);

   CREATE POLICY "Users can update own projects"
     ON projects FOR UPDATE
     USING (auth.uid()::text = user_id);

   CREATE POLICY "Users can delete own projects"
     ON projects FOR DELETE
     USING (auth.uid()::text = user_id);
   ```

3. Add login/signup pages using Supabase Auth

### Real Vercel Deployment

The current deployment is simulated. To enable real Vercel deployments:

1. Install Vercel SDK:
   ```bash
   npm install vercel
   ```

2. Set up Vercel API token in environment variables:
   ```env
   VERCEL_TOKEN=your_vercel_token
   VERCEL_TEAM_ID=your_team_id
   ```

3. Update `src/app/api/projects/[id]/deploy/route.ts` to use real Vercel API

### Rate Limiting

To prevent API abuse:

1. Add rate limiting middleware:
   ```bash
   npm install @vercel/rate-limit
   ```

2. Implement rate limiting on API routes

### Error Monitoring

Add error monitoring with Sentry or similar tools:

1. Install Sentry:
   ```bash
   npm install @sentry/nextjs
   ```

2. Configure Sentry in your app

## Next Steps

- Add user authentication
- Implement real Vercel deployments
- Add more AI models (Claude, etc.)
- Add team collaboration features
- Add project templates
- Implement version control for generated code
- Add deployment rollback functionality
- Add analytics dashboard

## Support

If you encounter issues:
1. Check the [README.md](README.md) for documentation
2. Review the [troubleshooting section](#troubleshooting)
3. Check browser console for errors
4. Check Supabase logs
5. Check Vercel deployment logs

Happy building! 🚀
