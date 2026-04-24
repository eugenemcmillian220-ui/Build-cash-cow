# AI App Builder

A full-stack AI-powered application builder that generates, refines, and deploys web applications using natural language descriptions.

## Features

- 🤖 **AI-Powered Generation**: Describe your app in plain English and let AI generate production-ready code
- 🎨 **Next.js 14**: Built with the latest Next.js App Router, TypeScript, and Tailwind CSS
- 💾 **Supabase Backend**: Scalable database with PostgreSQL for project management
- 🚀 **Vercel Deployment**: One-click deployment to Vercel
- ♻️ **Iterative Refinement**: Use AI feedback loops to refine and improve generated code
- 📊 **Dashboard**: Manage all your projects with a beautiful, intuitive interface

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- OpenAI API key

### 1. Clone and Install

```bash
git clone https://github.com/eugenemcmillian220-ui/Build-cash-cow.git
cd Build-cash-cow
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your:
   - Project URL
   - anon/public key
3. Navigate to the SQL Editor in Supabase
4. Run the migration script from `supabase/migrations/001_initial_schema.sql`

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Copy from .env.local.example and fill in your values:
cp .env.local.example .env.local
```

Add your actual values:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Create a New Project

1. Click "Create New Project"
2. Enter your project name and description
3. Describe your app in detail (features, UI requirements, functionality)
4. Click "Generate App with AI"
5. Wait for the AI to generate your code

### View and Refine Code

1. Open any project from the dashboard
2. Click "View Code" to see the generated code
3. Use the "Refine with AI" section to request changes
4. Describe what you want to improve or change
5. The AI will update your code accordingly

### Deploy to Vercel

1. Ensure your project status is "completed"
2. Click "Deploy to Vercel"
3. Wait for the deployment to finish
4. Click "Open App" to view your deployed application

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── projects/
│   │   │   │   ├── route.ts          # List and create projects
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts      # Get, update, delete project
│   │   │   │       ├── refine/route.ts  # Refine project with AI
│   │   │   │       └── deploy/route.ts  # Deploy project
│   │   │   └── deployments/
│   │   │       └── route.ts          # List deployments
│   │   ├── create/
│   │   │   └── page.tsx              # Create new project page
│   │   ├── project/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Project detail page
│   │   ├── page.tsx                  # Home/Dashboard page
│   │   └── layout.tsx                # Root layout
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client
│   │   └── agent.ts                  # AI agent logic
│   └── types/
│       └── index.ts                  # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Database schema
└── package.json
```

## API Routes

### `GET /api/projects`
List all projects

### `POST /api/projects`
Create a new project and start AI generation

### `GET /api/projects/[id]`
Get a specific project

### `DELETE /api/projects/[id]`
Delete a project

### `POST /api/projects/[id]/refine`
Refine project code with AI feedback

### `POST /api/projects/[id]/deploy`
Create a deployment to Vercel

### `GET /api/deployments?project_id=xxx`
List deployments for a project

## Database Schema

### Projects Table
- `id`: UUID (primary key)
- `name`: Project name
- `description`: Brief description
- `prompt`: User's original prompt
- `code`: Generated code
- `status`: draft, generating, completed, or error
- `user_id`: User identifier
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Deployments Table
- `id`: UUID (primary key)
- `project_id`: Reference to projects table
- `vercel_url`: Deployment URL
- `status`: pending, deployed, or failed
- `created_at`: Creation timestamp

## Deployment to Vercel

1. Push your code to GitHub
2. Import your project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

For automatic Vercel deployments, you would need to:
1. Install Vercel CLI: `npm i -g vercel`
2. Set up Vercel API token
3. Integrate Vercel deployment API in the backend

## Customization

### AI Prompts

Modify the system prompts in `src/lib/agent.ts` to customize:
- App specification generation
- Code generation style
- Refinement behavior

### Styling

Customize Tailwind configuration in `tailwind.config.ts`
Update colors and themes in component files

### Database

Add more tables or columns in `supabase/migrations/`
Update TypeScript types in `src/types/index.ts`

## Troubleshooting

### AI Generation Errors
- Check your OpenAI API key is valid
- Ensure you have sufficient API credits
- Review the logs for specific error messages

### Database Errors
- Verify Supabase credentials
- Run the migration script
- Check RLS policies if using auth

### Deployment Issues
- Ensure project status is "completed"
- Check Vercel API configuration
- Review deployment logs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.
