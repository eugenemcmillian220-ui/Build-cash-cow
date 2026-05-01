import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseUntyped } from '@/lib/supabase'
import type { ProjectRow } from '@/lib/types'
import { refinePipeline } from '@/lib/ai-pipeline'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

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
      .returns<ProjectRow[]>()
      .single()

    if (fetchError) throw fetchError
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const result = await refinePipeline(project.code, feedback)

    const { data: updatedProject, error: updateError } = await supabaseUntyped!
      .from('projects')
      .update({
        code: result.code,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ project: updatedProject, code: result.code })
  } catch (error) {
    console.error('Error refining project:', error)
    return NextResponse.json(
      { error: 'Failed to refine project' },
      { status: 500 }
    )
  }
}
