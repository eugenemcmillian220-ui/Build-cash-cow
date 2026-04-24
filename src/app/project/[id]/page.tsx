'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Code2, Play, Download, Share2, Trash2, Sparkles, ExternalLink, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import MonacoEditor from '@/components/MonacoEditor'
import WebContainerPreview from '@/components/WebContainerPreview'
import { useAppStore } from '@/lib/store'
import { formatRelativeTime } from '@/lib/utils'

export default function ProjectDetail() {
  const params = useParams()
  const router = useRouter()
  const { currentProject, setCurrentProject, updateProject, chatMessages, addChatMessage, clearChatMessages } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [refining, setRefining] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
      fetchDeployments(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/projects/${id}`)
      const data = await response.json()
      setCurrentProject(data.project)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeployments = async (projectId: string) => {
    try {
      const response = await fetch(`/api/deployments?project_id=${projectId}`)
      const data = await response.json()
      if (data.deployments?.length > 0) {
        const latestDeployment = data.deployments[0]
        if (latestDeployment.status === 'deployed') {
          setDeploymentUrl(latestDeployment.deployment_url)
        }
      }
    } catch (error) {
      console.error('Error fetching deployments:', error)
    }
  }

  const handleRefine = async () => {
    if (!chatInput.trim() || !currentProject?.id) return

    setRefining(true)
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    })

    try {
      const response = await fetch(`/api/projects/${currentProject.id}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: chatInput })
      })

      if (!response.ok) throw new Error('Failed to refine project')

      const data = await response.json()
      updateProject(currentProject.id, { code: data.code })
      setCurrentProject({ ...currentProject, code: data.code })

      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Code has been refined based on your feedback.',
        timestamp: new Date().toISOString()
      })

      setChatInput('')
    } catch (error) {
      console.error('Error refining project:', error)
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while refining the code. Please try again.',
        timestamp: new Date().toISOString()
      })
    } finally {
      setRefining(false)
    }
  }

  const handleDeploy = async () => {
    if (!currentProject?.id || currentProject.status !== 'completed') {
      alert('Project must be completed before deploying')
      return
    }

    setDeploying(true)
    try {
      const response = await fetch(`/api/projects/${currentProject.id}/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: 'vercel' })
      })

      if (!response.ok) throw new Error('Failed to deploy project')

      const data = await response.json()
      updateProject(currentProject.id, { status: 'deployed' })
      setDeploymentUrl(data.deployment_url)
    } catch (error) {
      console.error('Error deploying project:', error)
      alert('Failed to deploy project. Please try again.')
    } finally {
      setDeploying(false)
    }
  }

  const handleDownload = async () => {
    if (!currentProject?.code) return

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: currentProject.id })
      })

      if (!response.ok) throw new Error('Failed to export project')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentProject.name.toLowerCase().replace(/\s+/g, '-')}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading project:', error)
      alert('Failed to download project. Please try again.')
    }
  }

  const handleDelete = async () => {
    if (!currentProject?.id) return
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await fetch(`/api/projects/${currentProject.id}`, { method: 'DELETE' })
      router.push('/')
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project. Please try again.')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'generating':
        return <Badge variant="warning">Generating</Badge>
      case 'deployed':
        return <Badge>Deployed</Badge>
      case 'error':
        return <Badge variant="danger">Error</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Project not found</p>
            <Link href="/">
              <Button className="w-full mt-4">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {currentProject.name}
                </h1>
                {getStatusBadge(currentProject.status)}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {currentProject.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Created {formatRelativeTime(currentProject.created_at)}</span>
                <span>•</span>
                <span>Updated {formatRelativeTime(currentProject.updated_at)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {deploymentUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(deploymentUrl, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live App
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleDownload}
                className="gap-2"
                disabled={currentProject.status !== 'completed'}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={handleDeploy}
                disabled={deploying || currentProject.status !== 'completed'}
                className="gap-2"
              >
                {deploying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                Deploy
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {currentProject.status === 'generating' ? (
          <Card className="p-12 text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-purple-600" />
            <h2 className="text-2xl font-bold mb-2">Generating Your App...</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our AI is crafting your application. This may take a few minutes.
            </p>
            <p className="text-sm text-gray-500">
              You can leave this page and come back later.
            </p>
          </Card>
        ) : (
          <Tabs defaultValue="code" className="space-y-4">
            <TabsList>
              <TabsTrigger value="code" className="gap-2">
                <Code2 className="h-4 w-4" />
                Code
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Play className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="chat" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileCode className="h-5 w-5" />
                    Generated Code
                  </CardTitle>
                  <CardDescription>
                    Review and edit the AI-generated code
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[600px]">
                  <MonacoEditor
                    code={currentProject.code || '// Code will appear here after generation completes'}
                    onChange={(value) => {
                      setCurrentProject({ ...currentProject, code: value })
                    }}
                    onDownload={handleDownload}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                  <CardDescription>
                    See your app running in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[600px]">
                  <WebContainerPreview
                    files={{
                      'App.tsx': { code: currentProject.code || '' },
                      'package.json': { code: JSON.stringify({
                        name: currentProject.name.toLowerCase().replace(/\s+/g, '-'),
                        version: '1.0.0',
                        scripts: {
                          dev: 'next dev'
                        },
                        dependencies: {
                          next: '^14.0.0',
                          react: '^18.0.0',
                          'react-dom': '^18.0.0'
                        }
                      }, null, 2) }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Refine your code with AI feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Start a conversation with AI to refine your code</p>
                        <p className="text-sm mt-2">Try things like:</p>
                        <ul className="text-sm mt-1 space-y-1">
                          <li>"Add a dark mode toggle"</li>
                          <li>"Make the design more modern"</li>
                          <li>"Fix the mobile responsiveness"</li>
                          <li>"Add more animations"</li>
                        </ul>
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              msg.role === 'user'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Describe what you want to change..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleRefine())}
                      disabled={refining || currentProject.status !== 'completed'}
                    />
                    <Button
                      onClick={handleRefine}
                      disabled={refining || !chatInput.trim() || currentProject.status !== 'completed'}
                      className="gap-2"
                    >
                      {refining ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      Refine
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}