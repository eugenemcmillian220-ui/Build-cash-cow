export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          description: string
          prompt: string
          code?: string
          status?: 'draft' | 'generating' | 'completed' | 'error'
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
          status?: 'draft' | 'generating' | 'completed' | 'error'
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      deployments: {
        Row: {
          id: string
          project_id: string
          vercel_url: string
          status: 'pending' | 'deployed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          vercel_url?: string
          status?: 'pending' | 'deployed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          vercel_url?: string
          status?: 'pending' | 'deployed' | 'failed'
          created_at?: string
        }
      }
    }
  }
}
