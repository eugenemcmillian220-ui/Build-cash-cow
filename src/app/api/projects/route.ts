import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { appBuilderAgent } from '@/lib/agent'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    const { data: projects, error } = await supabase
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
    const body = await request.json()
    const { name, description, prompt } = body

    if (!name || !description || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const projectId = uuidv4()

    const { data: project, error: insertError } = await supabase
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
    // Generate app specification
    const spec = await appBuilderAgent.generateAppSpec(prompt)

    // Generate code
    const code = await appBuilderAgent.generateCode(spec)

    // Update project with generated code
    const { error } = await supabase
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
  const { error } = await supabase
    .from('projects')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', projectId)

  if (error) {
    console.error('Error updating project status:', error)
  }
}
