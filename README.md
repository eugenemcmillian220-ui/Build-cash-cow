# AI App Builder 🚀

A full-stack AI-powered application builder that generates, refines, and deploys web applications using natural language descriptions.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## ✨ Features

- 🤖 **AI-Powered Generation**: Describe your app in plain English and let AI generate production-ready code
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 💻 **Monaco Editor**: Full-featured code editor with syntax highlighting and IntelliSense
- 🔴 **Live Preview**: WebContainer integration for real-time app preview
- 🔄 **Iterative Refinement**: Use AI feedback loops to refine and improve generated code
- 📊 **Project Dashboard**: Manage all your projects with a beautiful, intuitive interface
- 📦 **Export Functionality**: Download projects as ZIP files
- 🚀 **One-Click Deployment**: Deploy to Vercel, Netlify, or Render
- 💾 **Supabase Backend**: Scalable database with PostgreSQL
- 🔐 **Authentication**: Built-in auth with email/password and OAuth support
- 👥 **Collaboration**: Real-time collaboration with team support
- 📈 **Analytics**: Usage tracking and analytics dashboard

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4.0, shadcn/ui
- **Editor**: Monaco Editor
- **Preview**: WebContainer API
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Custom AI Agent with OpenAI-compatible API
- **Deployment**: Vercel, Netlify, Render
- **State Management**: Zustand
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account
- AI API access (compatible with OpenAI format)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/eugenemcmillian220-ui/Build-cash-cow.git
cd Build-cash-cow
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Agent Configuration
NEXT_PUBLIC_AI_API_URL=https://your-ai-api.com/v1/chat/completions
AI_API_KEY=your_ai_api_key
AI_MODEL=ollama/codellama:7b

# Vercel Configuration
NEXT_PUBLIC_VERCEL_ACCESS_TOKEN=your_vercel_token

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Usage

### Create a New Project

1. Click "Create New Project"
2. Choose a template or describe your custom app
3. Enter project name and description
4. Provide detailed requirements
5. Click "Generate App with AI"
6. Wait for AI to generate your code

### View and Edit Code

1. Open any project from the dashboard
2. Switch to the "Code" tab
3. View and edit the generated code in Monaco Editor
4. Changes are auto-saved

### AI Chat for Refinement

1. Switch to the "AI Chat" tab
2. Describe what you want to change
3. AI will update the code accordingly
4. Review the changes in the editor

### Live Preview

1. Switch to the "Preview" tab
2. See your app running in real-time
3. Test functionality directly
4. Interact with your generated app

### Deploy Your App

1. Ensure project status is "completed"
2. Click "Deploy" button
3. Choose deployment platform (Vercel, Netlify, Render)
4. Wait for deployment to complete
5. Access your live app

### Download Project

1. Click "Download" button
2. Get a ZIP file with all project files
3. Extract and run locally
4. Customize further as needed

## 🗄 Database Schema

The application uses Supabase with the following main tables:

### Core Tables
- `users` - User profiles and settings
- `projects` - Application projects
- `project_files` - Individual project files
- `templates` - App starter templates
- `chat_history` - AI conversation history
- `deployments` - Deployment records

### Collaboration Tables
- `teams` - Team management
- `team_members` - Team membership
- `invitations` - Team invitations
- `collaborators` - Project collaborators

### Billing & Usage Tables
- `credits` - User credits system
- `subscriptions` - Subscription plans
- `usage_logs` - Usage tracking

### System Tables
- `api_keys` - API key management
- `webhooks` - Webhook configurations
- `notifications` - User notifications
- `audit_logs` - Audit trail
- `comments` - Code discussions
- `file_versions` - Version history
- `settings` - User preferences

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── projects/          # Project CRUD operations
│   │   │   ├── deployments/       # Deployment management
│   │   │   └── export/           # Project export
│   │   ├── create/               # Create new project
│   │   ├── project/[id]/        # Project detail page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Dashboard
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── MonacoEditor.tsx    # Code editor
│   │   └── WebContainerPreview.tsx  # Live preview
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── ai-agent.ts         # AI agent logic
│   │   ├── store.ts            # State management
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # TypeScript types
├── supabase/
│   └── migrations/             # Database migrations
├── public/                     # Static assets
└── package.json
```

## 🔌 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### AI Operations
- `POST /api/projects/[id]/refine` - Refine code with AI

### Deployments
- `GET /api/deployments` - List deployments
- `GET /api/deployments?project_id=xxx` - Get project deployments
- `POST /api/projects/[id]/deploy` - Create deployment

### Export
- `POST /api/export` - Export project as ZIP

## 🎨 Templates

The app comes with 6 built-in templates:

1. **Landing Page** - Modern landing page with hero and CTA
2. **Admin Dashboard** - Full-featured admin panel
3. **E-commerce Store** - Online store with cart
4. **Blog Platform** - Blog with posts and comments
5. **Portfolio Site** - Personal portfolio
6. **SaaS Application** - Full SaaS with auth

## 🔐 Security

- Row Level Security (RLS) on all Supabase tables
- API rate limiting
- CORS configuration
- Secure API key handling
- Authentication with Supabase Auth
- Two-factor authentication support

## 🚢 Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel --prod
```

### Environment Variables for Production

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_AI_API_URL`
- `NEXT_PUBLIC_APP_URL`

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type check
npm run type-check
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [WebContainer](https://webcontainer.io/) - In-browser web development
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Contact

- GitHub: [@eugenemcmillian220-ui](https://github.com/eugenemcmillian220-ui)
- Repository: [Build-cash-cow](https://github.com/eugenemcmillian220-ui/Build-cash-cow)

---

Built with ❤️ using AI and modern web technologies.