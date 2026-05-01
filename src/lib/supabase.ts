import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

let supabaseClient: SupabaseClient<Database> | null = null

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

/**
 * Untyped Supabase client for deployment mutations where the generic
 * chain doesn't resolve correctly with hand-crafted Database types.
 * Prefer the typed `supabase` export for project queries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabaseUntyped = supabase as SupabaseClient<any> | null

export type { Database } from './types'
