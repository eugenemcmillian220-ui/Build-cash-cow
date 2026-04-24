import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Lazy initialization to avoid build-time errors
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url_here') {
    return null
  }

  try {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
    return supabaseClient
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    return null
  }
}

export const supabase = getSupabaseClient()
export type { Database } from './types'
