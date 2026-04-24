'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateProject() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const data = await response.json()
      router.push(`/project/${data.project.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
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

        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
            Create New Project
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Describe your app and let AI generate it for you
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-purple-900"
                placeholder="My Awesome App"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-purple-900"
                placeholder="Brief description of what your app does"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                App Prompt
              </label>
              <textarea
                required
                rows={8}
                value={formData.prompt}
                onChange={(e) =>
                  setFormData({ ...formData, prompt: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-purple-900"
                placeholder="Describe your app in detail. Include features, UI requirements, functionality, and any specific technologies you prefer..."
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Example: "Create a todo app with categories, due dates, and a dashboard with statistics. Use a modern, clean design with purple accents."
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Generating App...
                </span>
              ) : (
                'Generate App with AI'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
