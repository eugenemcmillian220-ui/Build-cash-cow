'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Rocket, Clock, CheckCircle, XCircle, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/lib/store'
import { formatRelativeTime } from '@/lib/utils'

export default function Dashboard() {
  const { projects, setProjects, isLoading, setLoading } = useAppStore()
  const [stats, setStats] = useState({
    total: 0,
    generating: 0,
    completed: 0,
    deployed: 0
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data.projects || [])
      
      // Calculate stats
      const projectStats = {
        total: data.projects?.length || 0,
        generating: data.projects?.filter((p: any) => p.status === 'generating').length || 0,
        completed: data.projects?.filter((p: any) => p.status === 'completed').length || 0,
        deployed: data.projects?.filter((p: any) => p.status === 'deployed').length || 0
      }
      setStats(projectStats)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'generating':
        return <Activity className="h-5 w-5 text-yellow-600 animate-pulse" />
      case 'deployed':
        return <Rocket className="h-5 w-5 text-blue-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI App Builder
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Build full-stack applications with the power of AI
            </p>
          </div>
          <Link href="/create">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create New Project
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Generating</CardTitle>
              <Activity className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.generating}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Deployed</CardTitle>
              <Rocket className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.deployed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your Projects
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mb-4 mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <Rocket className="h-12 w-12 text-purple-600" />
            </div>
            <CardTitle className="mb-2 text-2xl">No projects yet</CardTitle>
            <CardDescription className="mb-6 text-base">
              Start building your first AI-powered application
            </CardDescription>
            <Link href="/create">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Project
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <Card className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(project.status)}
                        <CardTitle className="text-lg line-clamp-1">
                          {project.name}
                        </CardTitle>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatRelativeTime(project.created_at)}
                      </div>
                      <span className="text-purple-600 group-hover:translate-x-1 transition-transform">
                        View Details →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}