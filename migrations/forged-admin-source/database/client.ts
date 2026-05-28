import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Global cache for the client instance
let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

/**
 * Get Supabase URL for frontend (browser) usage
 * Note: In Netlify, SUPABASE_* vars are server-side only.
 * You must manually add NEXT_PUBLIC_SUPABASE_URL for browser access.
 */
function getSupabaseUrl(): string {
  // Priority 1: Public prefixed URL (required for browser)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
  }
  
  // During build/SSR - return placeholder to prevent crash
  if (typeof window === 'undefined') {
    return 'https://placeholder.supabase.co'
  }
  
  // Runtime browser check - show clear fix instructions
  console.error(
    '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL',
    '\nFix: In Netlify dashboard, go to',
    '\nSite Settings > Environment Variables',
    '\nAdd: NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co'
  )
  
  throw new Error(
    'Missing Supabase URL. Add NEXT_PUBLIC_SUPABASE_URL to Netlify Environment Variables.'
  )
}

/**
 * Get Supabase Anon Key for frontend (browser) usage
 * SECURITY: ANON key only - safe for frontend as RLS protects data
 */
function getSupabaseAnonKey(): string {
  // Priority 1: Public prefixed key (required for browser)
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
  
  // During build/SSR - return placeholder
  if (typeof window === 'undefined') {
    return 'placeholder-key'
  }
  
  // Runtime browser check
  console.error(
    '[Supabase] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY',
    '\nFix: In Netlify dashboard, go to',
    '\nSite Settings > Environment Variables',
    '\nAdd: NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-from-supabase'
  )
  
  throw new Error(
    'Missing Supabase Anon Key. Add NEXT_PUBLIC_SUPABASE_ANON_KEY to Netlify Environment Variables.'
  )
}

/**
 * Create a browser-side Supabase client
 * Uses singleton pattern to prevent multiple instances
 * ⚠️ SECURITY: Never expose SUPABASE_SERVICE_ROLE_KEY in frontend code
 */
export function createClient() {
  // Return cached instance if exists
  if (clientInstance) {
    return clientInstance
  }
  
  const url = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()
  
  // Create new instance and cache it
  clientInstance = createBrowserClient<Database>(url, anonKey)
  
  return clientInstance
}
