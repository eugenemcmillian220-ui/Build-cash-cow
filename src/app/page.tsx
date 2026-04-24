'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-5xl font-bold text-transparent">
            AI App Builder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Build full-stack applications with the power of AI
          </p>
        </div>

        <div className="mb-8 flex justify-end">
          <Link
            href="/create"
            className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
          >
            Create New Project
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-xl dark:bg-gray-800">
            <div className="mb-4 text-6xl">🚀</div>
            <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
              No projects yet
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Create your first AI-powered application
            </p>
            <Link
              href="/create"
              className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all hover:bg-purple-700"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group transform overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-gray-800"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {project.name}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                    <span>
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center text-purple-600 group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
