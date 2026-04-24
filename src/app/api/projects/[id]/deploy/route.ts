import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
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
      .single() as any

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

    const { data: deployment, error: insertError } = await (supabase as any)
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

    // Start deployment process
    if (platform === 'vercel') {
      deployToVercel(deploymentId, id, project).catch((error) => {
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

async function deployToVercel(deploymentId: string, projectId: string, project: any) {
  // In a real implementation, you would:
  // 1. Create a zip file of the project
  // 2. Upload to Vercel using their API
  // 3. Monitor deployment status
  
  // For demo purposes, we'll simulate a successful deployment
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const mockVercelUrl = `https://ai-app-${projectId.slice(0, 8)}.vercel.app`

  if (!supabase) return

  const { error } = await (supabase as any)
    .from('deployments')
    .update({
      deployment_url: mockVercelUrl,
      status: 'deployed',
    })
    .eq('id', deploymentId)

  if (error) throw error

  // Update project status
  await (supabase as any)
    .from('projects')
    .update({ status: 'deployed' })
    .eq('id', projectId)
}

async function updateDeploymentStatus(
  deploymentId: string, 
  status: 'deployed' | 'failed',
  buildLogs?: string
) {
  if (!supabase) return

  const updates: any = { status }
  if (buildLogs) updates.build_logs = buildLogs

  const { error } = await (supabase as any)
    .from('deployments')
    .update(updates)
    .eq('id', deploymentId)

  if (error) {
    console.error('Error updating deployment status:', error)
  }
}