'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProjectDetail() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [deployments, setDeployments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [refining, setRefining] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    fetchProject()
    fetchDeployments()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      const data = await response.json()
      setProject(data.project)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeployments = async () => {
    try {
      const response = await fetch(`/api/deployments?project_id=${params.id}`)
      const data = await response.json()
      setDeployments(data.deployments || [])
    } catch (error) {
      console.error('Error fetching deployments:', error)
    }
  }

  const handleDeploy = async () => {
    setDeploying(true)
    try {
      const response = await fetch(`/api/projects/${params.id}/deploy`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to deploy')
      await fetchDeployments()
    } catch (error) {
      console.error('Error deploying:', error)
      alert('Failed to deploy project')
    } finally {
      setDeploying(false)
    }
  }

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault()
    setRefining(true)
    try {
      const response = await fetch(`/api/projects/${params.id}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      })
      if (!response.ok) throw new Error('Failed to refine')
      const data = await response.json()
      setProject(data.project)
      setFeedback('')
      alert('Project refined successfully!')
    } catch (error) {
      console.error('Error refining:', error)
      alert('Failed to refine project')
    } finally {
      setRefining(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      router.push('/')
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Failed to delete project')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'generating':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Project not found</h2>
          <Link href="/" className="text-purple-600 hover:underline">
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to Projects
          </Link>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="mb-8 rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-white">
                  {project.name}
                </h1>
                <span
                  className={`rounded-full px-4 py-1 text-sm font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-100 px-4 py-2 text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
              >
                Delete Project
              </button>
            </div>

            <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
              {project.description}
            </p>

            <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <h3 className="mb-2 font-semibold text-gray-800 dark:text-white">
                Original Prompt
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{project.prompt}</p>
            </div>

            {project.status === 'completed' && (
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700"
                >
                  {showCode ? 'Hide Code' : 'View Code'}
                </button>
                <button
                  onClick={handleDeploy}
                  disabled={deploying}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  {deploying ? 'Deploying...' : 'Deploy to Vercel'}
                </button>
              </div>
            )}

            {project.status === 'generating' && (
              <div className="flex items-center gap-4 text-yellow-600">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-600"></div>
                <span className="font-medium">AI is generating your app...</span>
              </div>
            )}

            {project.status === 'error' && (
              <div className="rounded-lg bg-red-100 p-4 text-red-800">
                Failed to generate app. Please try creating a new project.
              </div>
            )}
          </div>

          {showCode && project.code && (
            <div className="mb-8 rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
                Generated Code
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{project.code}</code>
              </pre>
            </div>
          )}

          {project.status === 'completed' && (
            <div className="mb-8 rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
                Refine with AI
              </h2>
              <form onSubmit={handleRefine} className="space-y-4">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="Describe what you'd like to change or improve..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-purple-900"
                />
                <button
                  type="submit"
                  disabled={refining || !feedback.trim()}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {refining ? 'Refining...' : 'Refine App'}
                </button>
              </form>
            </div>
          )}

          {deployments.length > 0 && (
            <div className="rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
                Deployments
              </h2>
              <div className="space-y-4">
                {deployments.map((deployment) => (
                  <div
                    key={deployment.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-700"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            deployment.status === 'deployed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {deployment.status}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(deployment.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {deployment.vercel_url && (
                      <a
                        href={deployment.vercel_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        Open App →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
