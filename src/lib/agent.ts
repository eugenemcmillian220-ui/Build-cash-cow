import OpenAI from 'openai'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const AppSpecSchema = z.object({
  name: z.string().describe('The name of the application'),
  description: z.string().describe('A brief description of what the app does'),
  features: z.array(z.string()).describe('List of key features'),
  techStack: z.object({
    framework: z.string().describe('Framework to use (Next.js, React, etc.)'),
    styling: z.string().describe('Styling approach (Tailwind, CSS Modules, etc.)'),
    database: z.string().optional().describe('Database if needed'),
  }),
})

export class AppBuilderAgent {
  async generateAppSpec(prompt: string): Promise<z.infer<typeof AppSpecSchema>> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software architect. Analyze the user\'s request and generate a detailed app specification. Be specific about features and technologies.',
        },
        {
          role: 'user',
          content: `Generate an app specification for: ${prompt}`,
        },
      ],
      functions: [
        {
          name: 'generate_spec',
          description: 'Generate app specification',
          parameters: zodToJsonSchema(AppSpecSchema),
        },
      ],
      function_call: { name: 'generate_spec' },
    })

    const functionCall = completion.choices[0].message.function_call
    if (!functionCall) {
      throw new Error('No function call in response')
    }

    return AppSpecSchema.parse(JSON.parse(functionCall.arguments))
  }

  async generateCode(spec: z.infer<typeof AppSpecSchema>): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert full-stack developer. Generate complete, production-ready code based on the specification.
          
          Requirements:
          - Use Next.js 14 with App Router
          - Use TypeScript
          - Use Tailwind CSS
          - Include proper error handling
          - Write clean, modular code
          - Include necessary imports
          - Follow best practices
          
          Return only the code without any markdown formatting or explanations.`,
        },
        {
          role: 'user',
          content: `Generate code for an app with these specifications:
${JSON.stringify(spec, null, 2)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    return completion.choices[0].message.content || ''
  }

  async refineCode(currentCode: string, feedback: string): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert full-stack developer. Refine the existing code based on the user feedback. Keep the same structure but improve based on the feedback.',
        },
        {
          role: 'user',
          content: `Current code:\n${currentCode}\n\nUser feedback:\n${feedback}\n\nRefined code:`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    return completion.choices[0].message.content || currentCode
  }
}

function zodToJsonSchema(schema: z.ZodTypeAny): any {
  if (schema instanceof z.ZodObject) {
    return {
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(schema.shape).map(([key, value]) => [
          key,
          zodToJsonSchema(value as z.ZodTypeAny),
        ])
      ),
      required: Object.keys(schema.shape).filter(
        (key) => !schema.shape[key].isOptional?.()
      ),
    }
  } else if (schema instanceof z.ZodString) {
    return { type: 'string', description: schema.description }
  } else if (schema instanceof z.ZodArray) {
    return {
      type: 'array',
      items: zodToJsonSchema(schema.element as z.ZodTypeAny),
      description: schema.description,
    }
  } else if (schema instanceof z.ZodObject) {
    return zodToJsonSchema(schema)
  } else {
    return { type: 'string' }
  }
}

export const appBuilderAgent = new AppBuilderAgent()
