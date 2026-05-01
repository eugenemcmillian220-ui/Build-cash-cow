import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseUntyped } from '@/lib/supabase'
import type { ProjectRow } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

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
    const { platform = 'vercel' } = body

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .returns<ProjectRow[]>()
      .single()

    if (projectError) throw projectError
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.status !== 'completed' && project.status !== 'deployed') {
      return NextResponse.json(
        { error: 'Project must be completed before deploying' },
        { status: 400 }
      )
    }

    const deploymentId = uuidv4()

    const { data: deployment, error: insertError } = await supabaseUntyped!
      .from('deployments')
      .insert({
        id: deploymentId,
        project_id: id,
        platform,
        deployment_url: null,
        status: 'building',
        environment: {},
      })
      .select()
      .single()

    if (insertError) throw insertError

    if (platform === 'vercel') {
      deployToVercel(deploymentId, id).catch((error) => {
        console.error('Error deploying:', error)
        updateDeploymentStatus(deploymentId, 'failed', 'Deployment failed')
      })
    }

    return NextResponse.json({ deployment }, { status: 201 })
  } catch (error) {
    console.error('Error creating deployment:', error)
    return NextResponse.json(
      { error: 'Failed to create deployment' },
      { status: 500 }
    )
  }
}

async function deployToVercel(deploymentId: string, projectId: string) {
  // TODO: Wire real Vercel API deployment here.
  // For now, simulate a successful deployment after a short delay.
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const mockVercelUrl = `https://ai-app-${projectId.slice(0, 8)}.vercel.app`

  if (!supabaseUntyped) return

  const { error } = await supabaseUntyped
    .from('deployments')
    .update({
      deployment_url: mockVercelUrl,
      status: 'deployed',
    })
    .eq('id', deploymentId)

  if (error) throw error

  await supabaseUntyped
    .from('projects')
    .update({ status: 'deployed' })
    .eq('id', projectId)
}

async function updateDeploymentStatus(
  deploymentId: string,
  status: 'deployed' | 'failed',
  buildLogs?: string
) {
  if (!supabaseUntyped) return

  const updates: Record<string, unknown> = { status }
  if (buildLogs) updates.build_logs = buildLogs

  const { error } = await supabaseUntyped
    .from('deployments')
    .update(updates)
    .eq('id', deploymentId)

  if (error) {
    console.error('Error updating deployment status:', error)
  }
}
