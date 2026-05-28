import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Create a standard server-side Supabase client
 * Uses ANON key for regular operations (protected by RLS)
 * Safe for use in Server Components and API routes
 * Returns null if environment variables are missing (for graceful degradation)
 */
export async function createClient() {
  const cookieStore = await cookies()
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.warn('Missing Supabase environment variables. Blog/Content features will be unavailable.')
    return null
  }

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies can be set from middleware
          }
        },
      },
    }
  )
}

/**
 * Create an admin Supabase client with elevated privileges
 * Uses SERVICE_ROLE_KEY - bypasses RLS
 * ⚠️ SECURITY: Only use in server-side code (API routes, scheduled functions)
 * Never expose this client to the frontend/browser
 */
export async function createAdminClient() {
  const cookieStore = await cookies()
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Required for admin operations.'
    )
  }
  
  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Required for admin operations.'
    )
  }

  return createServerClient(
    url,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
