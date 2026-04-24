import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import JSZip from 'jszip'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data: project, error } = await (supabase as any)
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) throw error
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Create ZIP file
    const zip = new JSZip()

    // Add project files
    zip.file('README.md', `# ${project.name}\n\n${project.description}\n`)
    zip.file('src/app/page.tsx', project.code || '// Your code here')
    
    // Add package.json
    zip.file('package.json', JSON.stringify({
      name: project.name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: {
        next: '^14.0.0',
        react: '^18.0.0',
        'react-dom': '^18.0.0'
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        autoprefixer: '^10.0.0',
        'postcss': '^8.0.0',
        tailwindcss: '^3.0.0',
        typescript: '^5.0.0'
      }
    }, null, 2))

    // Add tsconfig.json
    zip.file('tsconfig.json', JSON.stringify({
      compilerOptions: {
        target: 'ES2017',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: { '@/*': ['./*'] }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    }, null, 2))

    // Add next.config.js
    zip.file('next.config.js', '/** @type {import(\'next\').NextConfig} */\nconst nextConfig = {}\nmodule.exports = nextConfig')

    // Add tailwind.config.ts
    zip.file('tailwind.config.ts', `import type { Config } from 'tailwindcss'\n\nconst config: Config = {\n  content: [\n    './pages/**/*.{js,ts,jsx,tsx,mdx}',\n    './components/**/*.{js,ts,jsx,tsx,mdx}',\n    './app/**/*.{js,ts,jsx,tsx,mdx}',\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}\nexport default config`)

    // Generate ZIP
    const zipBuffer = await zip.generateAsync({ type: 'uint8array' })

    return new NextResponse(Buffer.from(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${project.name.toLowerCase().replace(/\s+/g, '-')}.zip"`,
      },
    })
  } catch (error) {
    console.error('Error exporting project:', error)
    return NextResponse.json(
      { error: 'Failed to export project' },
      { status: 500 }
    )
  }
}