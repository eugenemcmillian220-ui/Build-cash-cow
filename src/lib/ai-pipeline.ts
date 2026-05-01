import { aiAgent } from './ai-agent'

export interface PipelineResult {
  spec: Record<string, unknown> | null
  code: string
  healed: boolean
}

/**
 * Minimal end-to-end happy-path pipeline:
 *   prompt  ➜  spec  ➜  code  ➜  (self-heal on error)  ➜  result
 *
 * Each step is independent so it can be fleshed out or swapped later.
 */
export async function runPipeline(prompt: string): Promise<PipelineResult> {
  // 1. Generate a structured spec from the prompt
  let spec: Record<string, unknown> | null = null
  try {
    spec = await aiAgent.generateProjectSpec(prompt)
  } catch {
    // Spec generation is best-effort; fall through to raw code gen
  }

  // 2. Generate code (use spec context when available)
  const context = spec ? JSON.stringify(spec, null, 2) : undefined
  let code = await aiAgent.generateCode(prompt, context)

  // 3. Self-heal: if the generated code looks broken, attempt one fix
  let healed = false
  const syntaxError = quickSyntaxCheck(code)
  if (syntaxError) {
    try {
      code = await aiAgent.selfHealCode(code, syntaxError)
      healed = true
    } catch {
      // Keep original code if self-heal fails
    }
  }

  return { spec, code, healed }
}

/**
 * Refine existing code via the AI agent and optionally self-heal.
 */
export async function refinePipeline(
  currentCode: string,
  feedback: string
): Promise<{ code: string; healed: boolean }> {
  let code = await aiAgent.refactorCode(currentCode, feedback)

  let healed = false
  const syntaxError = quickSyntaxCheck(code)
  if (syntaxError) {
    try {
      code = await aiAgent.selfHealCode(code, syntaxError)
      healed = true
    } catch {
      // Keep refactored code even if self-heal fails
    }
  }

  return { code, healed }
}

/**
 * Lightweight heuristic to catch obvious syntax problems before saving.
 * Returns an error description or null when nothing obvious is wrong.
 */
function quickSyntaxCheck(code: string): string | null {
  if (!code || code.trim().length === 0) {
    return 'Generated code is empty'
  }

  // Check for unbalanced braces / parens (simple heuristic)
  const opens = (code.match(/[{(]/g) || []).length
  const closes = (code.match(/[})]/g) || []).length
  if (Math.abs(opens - closes) > 2) {
    return `Unbalanced brackets: ${opens} opening vs ${closes} closing`
  }

  // Check for markdown fences that leaked into the code
  if (code.includes('```')) {
    return 'Code contains markdown fence markers (```)'
  }

  return null
}
