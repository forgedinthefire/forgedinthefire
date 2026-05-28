import { createBrowserClient } from '@supabase/ssr'

/**
 * Create a browser-side Supabase client
 * For use in Client Components only
 * Returns null if environment variables are missing (graceful degradation)
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.warn('Missing Supabase environment variables. Auth features will be unavailable.')
    return null
  }

  return createBrowserClient(url, anonKey)
}
