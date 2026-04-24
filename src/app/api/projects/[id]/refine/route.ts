import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { appBuilderAgent } from '@/lib/agent'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { feedback } = body

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      )
    }

    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const refinedCode = await appBuilderAgent.refineCode(project.code, feedback)

    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        code: refinedCode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ project: updatedProject })
  } catch (error) {
    console.error('Error refining project:', error)
    return NextResponse.json(
      { error: 'Failed to refine project' },
      { status: 500 }
    )
  }
}
