import OpenAI from 'openai'

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export class AIAgent {
  private apiKey: string
  private baseURL: string
  private model: string

  constructor() {
    this.apiKey = process.env.AI_API_KEY || 'sk-demo-key'
    this.baseURL = process.env.NEXT_PUBLIC_AI_API_URL || 'https://ai-coder-agent-selfhost.zocomputer.io/api/v1'
    this.model = process.env.AI_MODEL || 'ollama/codellama:7b'
  }

  private createClient(): OpenAI {
    return new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseURL,
      dangerouslyAllowBrowser: true // Only for demo purposes
    })
  }

  async chat(messages: Message[]): Promise<AIResponse> {
    try {
      const client = this.createClient()
      
      const response = await client.chat.completions.create({
        model: this.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 4000
      })

      const choice = response.choices[0]
      return {
        content: choice.message.content || '',
        model: response.model,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens
        } : undefined
      }
    } catch (error) {
      console.error('AI Agent Error:', error)
      throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async generateCode(prompt: string, context?: string): Promise<string> {
    const systemPrompt = `You are an expert full-stack developer specializing in Next.js 14+, TypeScript, and Tailwind CSS.

Generate complete, production-ready code based on the user's requirements.

Requirements:
- Use Next.js 14 with App Router
- Use TypeScript with proper type definitions
- Use Tailwind CSS for styling
- Follow React best practices
- Include proper error handling
- Write clean, modular code
- Include necessary imports
- Add comments only for complex logic
- Return only the code without markdown formatting

Always provide complete, working code that can be directly used.`

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: context ? `${context}\n\nRequirement: ${prompt}` : prompt }
    ]

    const response = await this.chat(messages)
    return response.content
  }

  async refactorCode(code: string, instruction: string): Promise<string> {
    const systemPrompt = `You are an expert code refactoring specialist.

Analyze the existing code and improve it based on the user's instructions.

Requirements:
- Maintain the same functionality
- Improve code quality and readability
- Follow best practices
- Fix any issues
- Keep the same structure when appropriate
- Return only the refactored code without markdown formatting`

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Existing code:\n${code}\n\nInstruction: ${instruction}` }
    ]

    const response = await this.chat(messages)
    return response.content
  }

  async generateProjectSpec(description: string): Promise<any> {
    const systemPrompt = `You are an expert software architect. Analyze the user's request and generate a detailed application specification.

Return a JSON object with the following structure:
{
  "name": "Project Name",
  "description": "Brief description",
  "features": ["feature1", "feature2", ...],
  "techStack": {
    "framework": "Next.js 14",
    "styling": "Tailwind CSS",
    "database": "Supabase/PostgreSQL"
  },
  "pages": [
    {
      "path": "/",
      "name": "Home",
      "description": "Page description"
    }
  ],
  "components": [
    {
      "name": "ComponentName",
      "description": "Component description"
    }
  ]
}

Be specific about features, pages, and components needed.`

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: description }
    ]

    const response = await this.chat(messages)
    
    // Extract JSON from the response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch (e) {
        console.error('Failed to parse JSON:', e)
      }
    }
    
    throw new Error('Failed to generate valid project specification')
  }

  async selfHealCode(code: string, errorMessage: string): Promise<string> {
    const systemPrompt = `You are an expert debugging specialist. Analyze the code and error message, then provide a fixed version.

Requirements:
- Identify the root cause of the error
- Fix the issue completely
- Maintain the original functionality
- Follow best practices
- Return only the fixed code without markdown formatting`

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Code with error:\n${code}\n\nError message: ${errorMessage}` }
    ]

    const response = await this.chat(messages)
    return response.content
  }
}

export const aiAgent = new AIAgent()