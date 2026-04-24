'use client'

import React, { useEffect, useRef, useState } from 'react'
import { WebContainer } from '@webcontainer/api'
import { Loader2, ExternalLink, RefreshCw, Terminal, Globe } from 'lucide-react'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface WebContainerPreviewProps {
  files: Record<string, { code: string }>
  onReady?: () => void
}

export default function WebContainerPreview({ files, onReady }: WebContainerPreviewProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [url, setUrl] = useState<string>('')
  const [logs, setLogs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'preview' | 'logs'>('preview')
  const containerRef = useRef<WebContainer | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  useEffect(() => {
    initWebContainer()
    return () => {
      containerRef.current?.teardown()
    }
  }, [])

  const initWebContainer = async () => {
    try {
      setStatus('loading')
      setLogs(['Initializing WebContainer...'])

      // Initialize WebContainer
      const webcontainer = await WebContainer.boot()
      containerRef.current = webcontainer

      setLogs(prev => [...prev, 'WebContainer initialized'])

      // Write files
      await webcontainer.mount(files as any)
      setLogs(prev => [...prev, 'Files mounted'])

      // Install dependencies
      setLogs(prev => [...prev, 'Installing dependencies...'])
      const installProcess = await webcontainer.spawn('npm', ['install'])
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            setLogs(prev => [...prev, data])
          }
        })
      )
      await installProcess.exit

      setLogs(prev => [...prev, 'Dependencies installed'])

      // Start dev server
      setLogs(prev => [...prev, 'Starting dev server...'])
      const devServer = await webcontainer.spawn('npm', ['run', 'dev'])
      devServer.output.pipeTo(
        new WritableStream({
          write(data) {
            setLogs(prev => [...prev, data])
          }
        })
      )

      // Wait for server to be ready
      webcontainer.on('server-ready', (port, serverUrl) => {
        setUrl(serverUrl)
        setStatus('ready')
        setLogs(prev => [...prev, `Server ready at ${serverUrl}`])
        onReady?.()
      })
    } catch (error) {
      console.error('WebContainer error:', error)
      setStatus('error')
      setLogs(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`])
    }
  }

  const handleRefresh = async () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const handleRestart = async () => {
    if (containerRef.current) {
      await containerRef.current.teardown()
      setUrl('')
      setLogs([])
      initWebContainer()
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-8">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-lg font-medium">Setting up preview environment...</p>
        <div className="mt-4 w-full max-w-2xl bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-y-auto max-h-64">
          {logs.map((log, i) => (
            <div key={i} className="text-gray-300">{log}</div>
          ))}
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-8">
        <div className="text-red-500 mb-4">
          <Terminal className="h-12 w-12" />
        </div>
        <p className="text-lg font-medium mb-4">Failed to start preview</p>
        <Button onClick={handleRestart} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <div className="mt-4 w-full max-w-2xl bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-y-auto max-h-64">
          {logs.map((log, i) => (
            <div key={i} className="text-gray-300">{log}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-300 font-mono">{url}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="bg-gray-700">
              <TabsTrigger value="preview" className="data-[state=active]:bg-gray-600">
                Preview
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-gray-600">
                Logs
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            className="h-8 px-2 text-gray-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {url && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(url, '_blank')}
              className="h-8 px-2 text-gray-300 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' ? (
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            title="App Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 p-4 font-mono text-sm overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-gray-300 mb-1">{log}</div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}