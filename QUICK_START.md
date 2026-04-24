# Quick Start Guide - AI App Builder

## 🚀 Get Up and Running in 5 Minutes

### 1. Clone and Install
```bash
cd /home/engine/project
npm install
```

### 2. Set Up Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase (2 minutes)
1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key from Settings > API
4. Run SQL from `supabase/migrations/001_initial_schema.sql`

### 4. Run the App
```bash
npm run dev
```

Open http://localhost:3000

### 5. Test It Out

**Create Your First AI App:**
1. Click "Create New Project"
2. Name: "Todo App"
3. Description: "Simple todo list with categories"
4. Prompt: "Create a todo app with:
   - Add, edit, delete todos
   - Categories (Work, Personal, Shopping)
   - Complete/incomplete status
   - Clean purple UI with Tailwind CSS
   - LocalStorage persistence"
5. Click "Generate App with AI"

**What Happens:**
- AI analyzes your prompt
- Generates app specification
- Creates production-ready code
- You can view, refine, and deploy!

## 📁 Project Structure

```
ai-app-builder/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── create/            # Create project page
│   │   ├── project/[id]/       # Project detail page
│   │   └── api/               # API routes
│   │       ├── projects/       # Project CRUD
│   │       └── deployments/    # Deployment tracking
│   ├── lib/
│   │   ├── supabase.ts        # Database client
│   │   └── agent.ts           # AI agent logic
│   └── types/
│       └── index.ts            # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.local.example
├── README.md
└── SETUP.md
```

## 🎯 Key Features

✅ **AI-Powered Generation** - Describe apps in plain English
✅ **Iterative Refinement** - Improve with AI feedback loops
✅ **Code Preview** - View generated code instantly
✅ **One-Click Deploy** - Deploy to Vercel (simulated)
✅ **Modern UI** - Beautiful gradient designs with dark mode
✅ **Type-Safe** - Full TypeScript implementation
✅ **Scalable** - Supabase PostgreSQL backend

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel ready

## 📝 Common Use Cases

1. **Rapid Prototyping** - Test app ideas in minutes
2. **Learning** - Study AI-generated code patterns
3. **MVP Development** - Quick minimum viable products
4. **Code Templates** - Generate boilerplate code
5. **Ideation** - Explore different approaches

## 🎨 Example Prompts

**E-commerce:**
"Build a product catalog with:
- Product grid with images
- Shopping cart functionality
- Filter by category and price
- Clean modern design
- Responsive mobile layout"

**Dashboard:**
"Create analytics dashboard with:
- Line charts for revenue
- Bar charts for users
- Key metrics cards
- Dark mode support
- Real-time data updates"

**Social App:**
"Build a social feed with:
- Post creation
- Like and comment
- User profiles
- Infinite scroll
- Story highlights"

## 🔐 Security Notes

- Currently uses demo user ID
- Add authentication for production
- Implement rate limiting
- Add input validation
- Use environment variables for secrets

## 🚢 Deploying to Production

### Deploy to Vercel:
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

See [SETUP.md](SETUP.md) for detailed instructions.

## 💡 Tips for Best Results

1. **Be Specific**: Include features, UI requirements, tech preferences
2. **Iterate**: Use the refine feature to improve
3. **Start Simple**: Basic apps generate faster and better
4. **Reference Examples**: Mention similar apps you like
5. **Specify Tech Stack**: Mention preferences for React, Tailwind, etc.

## 🐛 Troubleshooting

**Build fails?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Supabase error?**
- Check `.env.local` has correct values
- Verify Supabase project is active
- Run migration script again

**AI generation fails?**
- Check OpenAI API key
- Ensure you have API credits
- Try a simpler prompt

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [OpenAI API](https://platform.openai.com/docs)

## 🎉 You're Ready!

Start building AI-powered apps now. The only limit is your imagination!

For detailed setup, see [SETUP.md](SETUP.md)
For full documentation, see [README.md](README.md)
