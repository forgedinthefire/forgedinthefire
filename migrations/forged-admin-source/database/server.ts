import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Deploy: 2026-05-24 08:37 - Supabase Netlify Extension Connected

/**
 * Get Supabase URL from environment variables
 * Priority: NEXT_PUBLIC_SUPABASE_URL > extracted from SUPABASE_DATABASE_URL
 */
function getSupabaseUrl(): string {
  // Priority 1: Direct public URL (backward compatibility)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
  }
  
  // Priority 2: Extract from DATABASE_URL (postgresql://... format)
  // Convert: postgresql://...@db.PROJECT_ID.supabase.co:5432/... 
  // To: https://PROJECT_ID.supabase.co
  if (process.env.SUPABASE_DATABASE_URL) {
    const dbUrl = process.env.SUPABASE_DATABASE_URL
    const match = dbUrl.match(/@db\.([^.]+)\.supabase\.co/)
    if (match) {
      return `https://${match[1]}.supabase.co`
    }
  }
  
  // During build time, env vars may not be available - return placeholder
  // Runtime checks will catch actual missing configuration
  if (process.env.NODE_ENV === 'production' && !process.env.NETLIFY) {
    return 'https://placeholder.supabase.co'
  }
  
  throw new Error(
    'Missing Supabase URL. Please set either NEXT_PUBLIC_SUPABASE_URL or SUPABASE_DATABASE_URL environment variable.'
  )
}

/**
 * Get Supabase Anon Key from environment variables
 * Priority: SUPABASE_ANON_KEY (Netlify) > NEXT_PUBLIC_SUPABASE_ANON_KEY (fallback)
 */
function getSupabaseAnonKey(): string {
  // Priority 1: Netlify extension variable
  if (process.env.SUPABASE_ANON_KEY) {
    return process.env.SUPABASE_ANON_KEY
  }
  
  // Priority 2: Legacy variable name
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
  
  // During build time, env vars may not be available - return placeholder
  // Runtime checks will catch actual missing configuration
  if (process.env.NODE_ENV === 'production' && !process.env.NETLIFY) {
    return 'placeholder-key'
  }
  
  throw new Error(
    'Missing Supabase Anon Key. Please set SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.'
  )
}

/**
 * Create a standard server-side Supabase client
 * Uses ANON key for regular operations (protected by RLS)
 * Safe for use in Server Components and API routes
 */
export async function createClient() {
  const cookieStore = await cookies()
  
  const url = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()

  return createServerClient<Database>(
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
 * ⚠️ SECURITY: Only use in server-side code (API routes, scheduled functions, sync jobs)
 * Never expose this client to the frontend/browser
 */
export async function createAdminClient() {
  const cookieStore = await cookies()
  
  const url = getSupabaseUrl()
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Required for admin operations.'
    )
  }

  return createServerClient<Database>(
    url,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
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
