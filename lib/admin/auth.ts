import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'

/**
 * Check if the current authenticated user is an admin
 * Uses the admin_users table to verify privileges
 * @returns {Promise<{isAdmin: boolean, user: User | null, error?: string}>}
 */
export async function verifyAdminAccess(): Promise<{
  isAdmin: boolean
  user: { id: string; email: string } | null
  error?: string
}> {
  const supabase = await createClient()
  
  if (!supabase) {
    return {
      isAdmin: false,
      user: null,
      error: 'Database not configured'
    }
  }
  
  // Get the current authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user?.email) {
    return {
      isAdmin: false,
      user: null,
      error: 'Not authenticated'
    }
  }
  
  // Check if user exists in admin_users table
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('role')
    .eq('email', user.email)
    .single()
  
  if (adminError || !adminUser) {
    return {
      isAdmin: false,
      user: { id: user.id, email: user.email },
      error: 'Not authorized as admin'
    }
  }
  
  // Verify role is admin or owner
  if (adminUser.role !== 'admin' && adminUser.role !== 'owner') {
    return {
      isAdmin: false,
      user: { id: user.id, email: user.email },
      error: 'Insufficient privileges'
    }
  }
  
  return {
    isAdmin: true,
    user: { id: user.id, email: user.email }
  }
}

/**
 * Check if a specific email has admin privileges
 * Uses service role client for server-side checks
 * @param email - The email to check
 * @returns {Promise<boolean>}
 */
export async function isAdminEmail(email: string): Promise<boolean> {
  const adminClient = await createAdminClient()
  
  if (!adminClient) {
    console.error('Admin client not available')
    return false
  }
  
  const { data, error } = await adminClient
    .from('admin_users')
    .select('role')
    .eq('email', email.toLowerCase().trim())
    .single()
  
  if (error || !data) {
    return false
  }
  
  return data.role === 'admin' || data.role === 'owner'
}

/**
 * Require admin access or throw error
 * Use this in API routes and server actions
 * @throws {Error} If user is not an admin
 */
export async function requireAdmin(): Promise<{ id: string; email: string }> {
  const { isAdmin, user, error } = await verifyAdminAccess()
  
  if (!isAdmin || !user) {
    throw new Error(error || 'Admin access required')
  }
  
  return user
}
