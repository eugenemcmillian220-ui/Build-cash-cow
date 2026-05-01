export type ProjectStatus = 'draft' | 'generating' | 'completed' | 'deployed' | 'error'
export type DeploymentStatus = 'pending' | 'building' | 'deployed' | 'failed'

export interface ProjectRow {
  id: string
  name: string
  description: string
  prompt: string
  code: string
  status: ProjectStatus
  user_id: string
  created_at: string
  updated_at: string
}

export interface DeploymentRow {
  id: string
  project_id: string
  platform: string
  deployment_url: string | null
  status: DeploymentStatus
  build_logs: string | null
  environment: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow
        Insert: {
          id?: string
          name: string
          description: string
          prompt: string
          code?: string
          status?: ProjectStatus
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          prompt?: string
          code?: string
          status?: ProjectStatus
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      deployments: {
        Row: DeploymentRow
        Insert: {
          id?: string
          project_id: string
          platform?: string
          deployment_url?: string | null
          status?: DeploymentStatus
          build_logs?: string | null
          environment?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          platform?: string
          deployment_url?: string | null
          status?: DeploymentStatus
          build_logs?: string | null
          environment?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
