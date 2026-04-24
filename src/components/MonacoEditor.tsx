'use client'

import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Loader2, Download, Copy, Check } from 'lucide-react'
import { Button } from './ui/button'

interface MonacoEditorProps {
  code: string
  onChange?: (value: string) => void
  language?: string
  readOnly?: boolean
  onDownload?: () => void
  onCopy?: () => void
}

export default function MonacoEditor({
  code,
  onChange,
  language = 'typescript',
  readOnly = false,
  onDownload,
  onCopy
}: MonacoEditorProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  return (
    <div className="relative h-full flex flex-col border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
        <span className="text-sm font-medium text-gray-600">
          {language}
        </span>
        <div className="flex gap-2">
          {onCopy && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-8 px-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-xs ml-1">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="text-xs ml-1">Copy</span>
                </>
              )}
            </Button>
          )}
          {onDownload && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDownload}
              className="h-8 px-2"
            >
              <Download className="h-4 w-4" />
              <span className="text-xs ml-1">Download</span>
            </Button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => onChange?.(value || '')}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderWhitespace: 'selection',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible'
            }
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading editor...</span>
            </div>
          }
        />
      </div>
    </div>
  )
}