import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { aiAgent } from '@/lib/ai-agent'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data: projects, error } = await (supabase as any)
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, description, prompt } = body

    if (!name || !description || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const projectId = uuidv4()

    const { data: project, error: insertError } = await (supabase as any)
      .from('projects')
      .insert({
        id: projectId,
        name,
        description,
        prompt,
        code: '',
        status: 'generating',
        user_id: 'demo-user', // In production, use authenticated user ID
      })
      .select()
      .single()

    if (insertError) throw insertError

    // Start async generation
    generateAppCode(projectId, prompt).catch((error) => {
      console.error('Error generating app:', error)
      updateProjectStatus(projectId, 'error')
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

async function generateAppCode(projectId: string, prompt: string) {
  try {
    // Generate code using AI agent
    const code = await aiAgent.generateCode(prompt)

    // Update project with generated code
    if (!supabase) return

    const { error } = await (supabase as any)
      .from('projects')
      .update({
        code,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)

    if (error) throw error
  } catch (error) {
    console.error('Error in generateAppCode:', error)
    throw error
  }
}

async function updateProjectStatus(projectId: string, status: 'completed' | 'error') {
  if (!supabase) return

  const { error } = await (supabase as any)
    .from('projects')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', projectId)

  if (error) {
    console.error('Error updating project status:', error)
  }
}