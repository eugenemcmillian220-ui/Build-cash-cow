import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('project_id')

    let query = supabase.from('deployments').select('*')

    if (projectId) {
      query = query.eq('project_id', projectId)
    }

    const { data: deployments, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) throw error

    return NextResponse.json({ deployments })
  } catch (error) {
    console.error('Error fetching deployments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deployments' },
      { status: 500 }
    )
  }
}
