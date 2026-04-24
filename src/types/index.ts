export interface Project {
  id: string
  name: string
  description: string
  prompt: string
  code: string
  status: 'draft' | 'generating' | 'completed' | 'error'
  user_id: string
  created_at: string
  updated_at: string
}

export interface Deployment {
  id: string
  project_id: string
  vercel_url: string
  status: 'pending' | 'deployed' | 'failed'
  created_at: string
}

export interface AppSpec {
  name: string
  description: string
  features: string[]
  techStack: {
    framework: string
    styling: string
    database?: string
  }
}
