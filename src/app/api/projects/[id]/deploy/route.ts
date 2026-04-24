import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (projectError) throw projectError
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.status !== 'completed') {
      return NextResponse.json(
        { error: 'Project must be completed before deploying' },
        { status: 400 }
      )
    }

    const deploymentId = uuidv4()

    const { data: deployment, error: insertError } = await supabase
      .from('deployments')
      .insert({
        id: deploymentId,
        project_id: id,
        vercel_url: '',
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) throw insertError

    // In a real implementation, you would trigger a Vercel deployment here
    // For now, we'll simulate it
    simulateDeployment(deploymentId, id).catch((error) => {
      console.error('Error deploying:', error)
      updateDeploymentStatus(deploymentId, 'failed')
    })

    return NextResponse.json({ deployment }, { status: 201 })
  } catch (error) {
    console.error('Error creating deployment:', error)
    return NextResponse.json(
      { error: 'Failed to create deployment' },
      { status: 500 }
    )
  }
}

async function simulateDeployment(deploymentId: string, projectId: string) {
  // Simulate deployment delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const mockVercelUrl = `https://project-${projectId.slice(0, 8)}.vercel.app`

  const { error } = await supabase
    .from('deployments')
    .update({
      vercel_url: mockVercelUrl,
      status: 'deployed',
    })
    .eq('id', deploymentId)

  if (error) throw error
}

async function updateDeploymentStatus(deploymentId: string, status: 'deployed' | 'failed') {
  const { error } = await supabase
    .from('deployments')
    .update({ status })
    .eq('id', deploymentId)

  if (error) {
    console.error('Error updating deployment status:', error)
  }
}
