'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore } from '@/lib/store'

const TEMPLATES = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Beautiful landing page with hero section, features, and CTA',
    icon: '🎯',
    prompt: 'Create a modern landing page with a hero section, features grid, testimonials, and a call-to-action footer. Use a clean, professional design with smooth animations.'
  },
  {
    id: 'dashboard',
    name: 'Admin Dashboard',
    description: 'Full-featured admin dashboard with charts and tables',
    icon: '📊',
    prompt: 'Create an admin dashboard with sidebar navigation, data charts, statistics cards, a data table with filtering, and user management section.'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Online store with product listings and cart',
    icon: '🛒',
    prompt: 'Create an e-commerce store with product grid, product cards with images and prices, shopping cart sidebar, and checkout flow.'
  },
  {
    id: 'blog',
    name: 'Blog Platform',
    description: 'Blog with posts, categories, and comments',
    icon: '✍️',
    prompt: 'Create a blog platform with a homepage showing recent posts, individual post pages with content, sidebar with categories, and comment section.'
  },
  {
    id: 'portfolio',
    name: 'Portfolio Site',
    description: 'Personal portfolio with projects and about section',
    icon: '💼',
    prompt: 'Create a personal portfolio website with an about section, projects showcase with case studies, skills section, and contact form.'
  },
  {
    id: 'saas',
    name: 'SaaS Application',
    description: 'SaaS app with authentication and dashboard',
    icon: '☁️',
    prompt: 'Create a SaaS application with login/signup pages, user dashboard, subscription plans section, and settings page.'
  }
]

export default function CreateProject() {
  const router = useRouter()
  const { addProject, setLoading } = useAppStore()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customMode, setCustomMode] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectPrompt, setProjectPrompt] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null)

  const handleSelectTemplate = (template: typeof TEMPLATES[0]) => {
    setSelectedTemplate(template.id)
    setCustomMode(false)
    setProjectPrompt(template.prompt)
    setProjectName(`${template.name} Project`)
    setProjectDescription(template.description)
  }

  const handleCustomMode = () => {
    setSelectedTemplate(null)
    setCustomMode(true)
  }

  const handleCreateProject = async () => {
    if (!projectName || !projectDescription || !projectPrompt) {
      alert('Please fill in all fields')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          prompt: projectPrompt
        })
      })

      if (!response.ok) throw new Error('Failed to create project')

      const data = await response.json()
      setCreatedProjectId(data.project.id)
      addProject(data.project)
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/project/${data.project.id}`)
      }, 1500)
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
      setIsCreating(false)
    }
  }

  if (createdProjectId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Project Created!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your AI is now generating your application...
              </p>
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Create New Project
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose a template or describe your custom application
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Templates Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Start with a Template
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCustomMode}
                className={customMode ? 'bg-purple-50 border-purple-600' : ''}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Custom AI Generation
              </Button>
            </div>

            <div className="grid gap-3">
              {TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id
                      ? 'ring-2 ring-purple-600 bg-purple-50'
                      : ''
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{template.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Configuration Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Project Configuration
            </h2>

            <Card>
              <CardHeader>
                <CardTitle>
                  {customMode ? 'Custom Project' : TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Select a Template'}
                </CardTitle>
                <CardDescription>
                  Configure your project details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Name
                  </label>
                  <Input
                    placeholder="My Awesome App"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Textarea
                    placeholder="A brief description of your project"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Requirements
                  </label>
                  <Textarea
                    placeholder={
                      customMode
                        ? 'Describe your application in detail... What features do you need? What should it look like?'
                        : 'Customize the template with your specific requirements...'
                    }
                    value={projectPrompt}
                    onChange={(e) => setProjectPrompt(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                <Button
                  onClick={handleCreateProject}
                  disabled={isCreating || !projectName || !projectDescription || !projectPrompt}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate App with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}