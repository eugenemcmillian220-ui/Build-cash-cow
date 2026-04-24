import { create } from 'zustand'

export interface Project {
  id: string
  user_id: string
  name: string
  description: string
  prompt: string
  code?: string
  status: 'draft' | 'generating' | 'completed' | 'error' | 'deployed'
  framework?: string
  tech_stack?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface Deployment {
  id: string
  project_id: string
  user_id?: string
  platform: string
  deployment_url?: string
  status: 'pending' | 'building' | 'deployed' | 'failed' | 'rolling_back'
  build_logs?: string
  environment: Record<string, any>
  created_at: string
  updated_at: string
}

interface AppState {
  currentProject: Project | null
  projects: Project[]
  chatMessages: ChatMessage[]
  deployments: Deployment[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setCurrentProject: (project: Project | null) => void
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  removeProject: (id: string) => void
  
  addChatMessage: (message: ChatMessage) => void
  clearChatMessages: () => void
  
  setDeployments: (deployments: Deployment[]) => void
  addDeployment: (deployment: Deployment) => void
  updateDeployment: (id: string, updates: Partial<Deployment>) => void
  
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentProject: null,
  projects: [],
  chatMessages: [],
  deployments: [],
  isLoading: false,
  error: null,
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects]
  })),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, ...updates }
      : state.currentProject
  })),
  
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject
  })),
  
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
  
  clearChatMessages: () => set({ chatMessages: [] }),
  
  setDeployments: (deployments) => set({ deployments }),
  
  addDeployment: (deployment) => set((state) => ({
    deployments: [deployment, ...state.deployments]
  })),
  
  updateDeployment: (id, updates) => set((state) => ({
    deployments: state.deployments.map(d => 
      d.id === id ? { ...d, ...updates } : d
    )
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}))